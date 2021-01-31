import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
import { TransactionInfo } from "@/api/api_models/operation_management/Operation";
import { UC4Identifier } from "../UC4Identifier";

export function buildTransactionInfoMatriculationAddEntries(enrollmentId: string, matriculation: SubjectMatriculation[]): TransactionInfo {
    const matriculationJSONString = JSON.stringify(matriculation);
    const paramArray: string[] = [enrollmentId, matriculationJSONString];

    const parameters = JSON.stringify(paramArray);

    const transactionInfo = {
        contractName: UC4Identifier.CONTRACT_MATRICULATION,
        transactionName: UC4Identifier.TRANSACTION_ADD_ENTRIES_MATRICULATION,
        parameters,
    };
    console.log(transactionInfo);

    return transactionInfo;
}

export function buildTransactionInfoMatriculationAddMatriculation(matriculation: MatriculationData): TransactionInfo {
    const matriculationJSONString = JSON.stringify(matriculation);
    const paramArray: string[] = [matriculationJSONString];

    const parameters = JSON.stringify(paramArray);

    const transactionInfo = {
        contractName: UC4Identifier.CONTRACT_MATRICULATION,
        transactionName: UC4Identifier.TRANSACTION_ADD_MATRICULATION,
        parameters,
    };
    console.log(transactionInfo);
    return transactionInfo;
}

export function buildTransactionInfoMatriculationUpdateMatriculation(matriculation: MatriculationData): TransactionInfo {
    const matriculationJSONString = JSON.stringify(matriculation);
    const paramArray: string[] = [matriculationJSONString];

    const parameters = JSON.stringify(paramArray);

    const transactionInfo = {
        contractName: UC4Identifier.CONTRACT_MATRICULATION,
        transactionName: UC4Identifier.TRANSACTION_UPDATE_MATRICULATION,
        parameters,
    };
    console.log(transactionInfo);
    return transactionInfo;
}
