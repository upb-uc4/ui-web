import AdmissionManagement from "@/api/AdmissionManagement";
import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import { TransactionInfo } from "@/api/api_models/operation_management/Operation";
import { UC4Identifier } from "@/api/helpers/UC4Identifier";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import AbstractTransaction from "../../AbstractTransaction";

export class DropAdmissionTransaction extends AbstractTransaction {
    private admissionId: string;

    constructor(admissionId: string) {
        super();
        this.admissionId = admissionId;
    }

    public buildTransactionInfo(): TransactionInfo {
        return DropAdmissionTransaction.buildTransactionInfo(this.admissionId);
    }

    public static buildTransactionInfo(admissionId: string): TransactionInfo {
        const paramArray: string[] = [admissionId];

        const parameters = JSON.stringify(paramArray);

        const transactionInfo = {
            contractName: UC4Identifier.CONTRACT_ADMISSION,
            transactionName: UC4Identifier.TRANSACTION_DROP_ADMISSION,
            parameters,
        };

        return transactionInfo;
    }

    public async getProposal(): Promise<UnsignedProposalMessage> {
        return new GenericResponseHandler("matriculation").handleResponse(
            await new AdmissionManagement().getUnsignedCourseAdmissionDropProposal(this.admissionId)
        );
    }
}
