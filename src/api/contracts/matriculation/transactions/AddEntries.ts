import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
import { TransactionInfo } from "@/api/api_models/operation_management/Operation";
import CertificateManagement from "@/api/CertificateManagement";
import { UC4Identifier } from "@/api/helpers/UC4Identifier";
import MatriculationManagement from "@/api/MatriculationManagement";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import AbstractTransaction from "../../AbstractTransaction";

export class AddEntriesToMatriculationTransaction extends AbstractTransaction {
    private usernameToEnroll: string;
    private matriculation: SubjectMatriculation[];
    private enrollmentId: string;

    constructor(usernameToEnroll: string, matriculation: SubjectMatriculation[], enrollmentId: string) {
        super();
        this.usernameToEnroll = usernameToEnroll;
        this.matriculation = matriculation;
        this.enrollmentId = enrollmentId;
    }

    public buildTransactionInfo(): TransactionInfo {
        return AddEntriesToMatriculationTransaction.buildTransactionInfo(this.enrollmentId, this.matriculation);
    }

    public static buildTransactionInfo(enrollmentId: string, matriculation: SubjectMatriculation[]): TransactionInfo {
        const matriculationJSONString = JSON.stringify(matriculation);
        const paramArray: string[] = [enrollmentId, matriculationJSONString];

        const parameters = JSON.stringify(paramArray);

        const transactionInfo = {
            contractName: UC4Identifier.CONTRACT_MATRICULATION,
            transactionName: UC4Identifier.TRANSACTION_ADD_ENTRIES_MATRICULATION,
            parameters,
        };
        return transactionInfo;
    }

    public async getProposal(): Promise<UnsignedProposalMessage> {
        return new GenericResponseHandler("matriculation").handleResponse(
            await new MatriculationManagement().getUnsignedMatriculationProposal(this.usernameToEnroll, this.matriculation)
        );
    }
}
