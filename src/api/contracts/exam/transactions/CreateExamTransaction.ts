import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import Exam from "@/api/api_models/exam_management/Exam";
import { TransactionInfo } from "@/api/api_models/operation_management/Operation";
import ExamManagement from "@/api/ExamManagement";
import { UC4Identifier } from "@/api/helpers/UC4Identifier";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import AbstractTransaction from "../../AbstractTransaction";

export class CreateExamTransaction extends AbstractTransaction {
    private exam: Exam;

    constructor(exam: Exam) {
        super();
        this.exam = exam;
    }

    public buildTransactionInfo(): TransactionInfo {
        return CreateExamTransaction.buildTransactionInfo(this.exam);
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
