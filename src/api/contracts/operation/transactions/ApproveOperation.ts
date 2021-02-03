import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import Operation, { TransactionInfo } from "@/api/api_models/operation_management/Operation";
import { validateOperationId } from "@/api/helpers/OperationValidator";
import OperationManagement from "@/api/OperationManagement";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import AbstractTransaction from "../../AbstractTransaction";

export class ApproveOperationTransaction extends AbstractTransaction {
    private operation: Operation;

    constructor(operation: Operation) {
        super();
        this.operation = operation;
    }

    public buildTransactionInfo(): TransactionInfo {
        return {} as TransactionInfo;
    }

    public async calculateOperationId(_: TransactionInfo) {
        return this.operation.operationId;
    }

    public async getProposal(): Promise<UnsignedProposalMessage> {
        if (!(await validateOperationId(this.operation))) {
            throw new Error("OperationId does not conform to transaction");
        }

        return new GenericResponseHandler("operation").handleResponse(
            await new OperationManagement().getUnsignedApprovalProposal(this.operation.operationId)
        );
    }
}
