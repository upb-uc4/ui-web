import { ProposalPayload } from "@/api/api_models/common/Proposal";
import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import Operation, { TransactionInfo } from "@/api/api_models/operation_management/Operation";
import { validateOperationId } from "@/api/helpers/OperationValidator";
import { UC4Identifier } from "@/api/helpers/UC4Identifier";
import OperationManagement from "@/api/OperationManagement";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import AbstractTransaction from "../../AbstractTransaction";

export class RejectOperationTransaction extends AbstractTransaction {
    private operation: Operation;
    private rejectionMessage: string;

    constructor(operation: Operation, rejectionMessage: string) {
        super();
        this.operation = operation;
        this.rejectionMessage = rejectionMessage;
    }

    public buildTransactionInfo(): TransactionInfo {
        return {} as TransactionInfo;
    }

    public async calculateOperationId(_: TransactionInfo) {
        return this.operation.operationId;
    }

    protected async validateProposalOperationId(proposalPayload: ProposalPayload, transactionInfo: TransactionInfo) {
        const operationId = await this.calculateOperationId(transactionInfo);

        const name = proposalPayload.input.input.args[0];
        const proposalOperationId = proposalPayload.input.input.args[1];

        if (name !== UC4Identifier.CONTRACT_APPROVAL + UC4Identifier.SEPERATOR + UC4Identifier.TRANSACTION_REJECTION) return false;

        return proposalOperationId === operationId;
    }

    public async getProposal(): Promise<UnsignedProposalMessage> {
        if (!(await validateOperationId(this.operation))) {
            throw new Error("OperationId does not conform to transaction");
        }

        return new GenericResponseHandler("operation").handleResponse(
            await new OperationManagement().getUnsignedRejectionProposal(this.operation.operationId, this.rejectionMessage)
        );
    }
}
