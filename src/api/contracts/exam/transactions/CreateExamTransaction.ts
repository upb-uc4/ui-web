import Proposal from "@/api/api_models/common/Proposal";
import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import Exam from "@/api/api_models/exam_management/Exam";
import { TransactionInfo } from "@/api/api_models/operation_management/Operation";
import ExamManagement from "@/api/ExamManagement";
import { UC4Identifier } from "@/api/helpers/UC4Identifier";
import OperationManagement from "@/api/OperationManagement";
import { ExamEntity } from "@/entities/ExamEntity";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import AbstractTransaction from "../../AbstractTransaction";

export class CreateExamTransaction extends AbstractTransaction {
    private exam: ExamEntity;
    private operationId: string;

    constructor(exam: ExamEntity) {
        super();
        this.exam = exam;
        this.operationId = "This is not a valid ID.";
    }

    public buildTransactionInfo(): TransactionInfo {
        return CreateExamTransaction.buildTransactionInfo(this.exam);
    }

    public async validateProposal(proposal: Proposal) {
        const proposalOperationId = proposal.payload.input.input.args[1];
        const examProposal: ExamEntity = new ExamEntity(
            JSON.parse(
                JSON.parse((await new OperationManagement().getOperation(proposalOperationId)).returnValue.transactionInfo.parameters)[0]
            )
        );

        if (!examProposal) {
            return false;
        }

        let isValid = examProposal.equals(this.exam);

        if (isValid) {
            this.operationId = proposalOperationId;
        }

        isValid = isValid && (await super.validateProposal(proposal));

        return isValid;
    }

    public async calculateOperationId(_: TransactionInfo) {
        return this.operationId;
    }

    public static buildTransactionInfo(exam: Exam): TransactionInfo {
        const examJSONString = JSON.stringify(exam);
        const paramArray: string[] = [examJSONString];

        const parameters = JSON.stringify(paramArray);

        const transactionInfo = {
            contractName: UC4Identifier.CONTRACT_EXAM,
            transactionName: UC4Identifier.TRANSACTION_ADD_EXAM,
            parameters,
        };
        return transactionInfo;
    }

    public async getProposal(): Promise<UnsignedProposalMessage> {
        return new GenericResponseHandler("exam").handleResponse(await new ExamManagement().getUnsignedExamCreateProposal(this.exam));
    }
}
