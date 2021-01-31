import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
import { TransactionInfo } from "@/api/api_models/operation_management/Operation";
import { UC4Identifier } from "@/api/helpers/UC4Identifier";
import MatriculationManagement from "@/api/MatriculationManagement";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import AbstractTransaction from "../../AbstractTransaction";

export default class AddEntriesToMatriculationTransaction extends AbstractTransaction {
    private usernameToEnroll: string;
    private matriculation: SubjectMatriculation[];

    constructor(usernameToEnroll: string, matriculation: SubjectMatriculation[]) {
        super();
        this.usernameToEnroll = usernameToEnroll;
        this.matriculation = matriculation;
    }

    public buildTransactionInfo(): TransactionInfo {
        return AddEntriesToMatriculationTransaction.buildTransactionInfo(this.usernameToEnroll, this.matriculation);
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
