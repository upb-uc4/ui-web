import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
import { TransactionInfo } from "@/api/api_models/operation_management/Operation";
import { UC4Identifier } from "@/api/helpers/UC4Identifier";
import MatriculationManagement from "@/api/MatriculationManagement";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import AbstractTransaction from "../../AbstractTransaction";

export class UpdateMatriculationDataTranscation extends AbstractTransaction {
    private matriculationData: MatriculationData;
    private userNameToEnroll: string;

    constructor(userNameToEnroll: string, matriculationData: MatriculationData) {
        super();
        this.matriculationData = matriculationData;
        this.userNameToEnroll = userNameToEnroll;
    }

    public buildTransactionInfo(): TransactionInfo {
        return UpdateMatriculationDataTranscation.buildTransactionInfo(this.matriculationData);
    }

    public static buildTransactionInfo(matriculationData: MatriculationData): TransactionInfo {
        const matriculationJSONString = JSON.stringify(matriculationData);
        const paramArray: string[] = [matriculationJSONString];

        const parameters = JSON.stringify(paramArray);

        const transactionInfo = {
            contractName: UC4Identifier.CONTRACT_MATRICULATION,
            transactionName: UC4Identifier.TRANSACTION_ADD_MATRICULATION,
            parameters,
        };
        return transactionInfo;
    }

    public async getProposal(): Promise<UnsignedProposalMessage> {
        return new GenericResponseHandler("matriculation").handleResponse(
            await new MatriculationManagement().getUnsignedMatriculationProposal(
                this.userNameToEnroll,
                this.matriculationData.matriculationStatus
            )
        );
    }
}
