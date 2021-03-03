import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import ExamResult from "@/api/api_models/exam_result_management/ExamResult";
import { TransactionInfo } from "@/api/api_models/operation_management/Operation";
import ExamResultManagement from "@/api/ExamResultManagement";
import { UC4Identifier } from "@/api/helpers/UC4Identifier";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import AbstractTransaction from "../../AbstractTransaction";

export class AddExamResultTransaction extends AbstractTransaction {
    private examResults: ExamResult[];

    constructor(examResults: ExamResult[]) {
        super();
        this.examResults = examResults;
    }

    public buildTransactionInfo(): TransactionInfo {
        return AddExamResultTransaction.buildTransactionInfo(this.examResults);
    }

    public static buildTransactionInfo(examResults: ExamResult[]): TransactionInfo {
        const examJSONString = JSON.stringify({examResultEntries: examResults});
        const paramArray: string[] = [examJSONString];

        const parameters = JSON.stringify(paramArray);

        const transactionInfo = {
            contractName: UC4Identifier.CONTRACT_EXAM_RESULT,
            transactionName: UC4Identifier.TRANSACTION_ADD_EXAM_RESULT,
            parameters,
        };
        return transactionInfo;
    }

    public async getProposal(): Promise<UnsignedProposalMessage> {
        return new GenericResponseHandler("exam").handleResponse(
            await new ExamResultManagement().getUnsignedExamResultAddProposal(this.examResults)
        );
    }
}
