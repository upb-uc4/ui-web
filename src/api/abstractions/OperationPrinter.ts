import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import MatriculationData from "../api_models/matriculation_management/MatriculationData";
import SubjectMatriculation from "../api_models/matriculation_management/SubjectMatriculation";
import Operation from "../api_models/operation_management/Operation";
import CertificateManagement from "../CertificateManagement";
import { UC4Identifier } from "../helpers/UC4Identifier";
import { updateMatriculation } from "./FrontendSigning";

export function printOperation(operation: Operation): string[] {
    const contractName = operation.transactionInfo.contractName;

    if (contractName == UC4Identifier.CONTRACT_MATRICULATION) {
        return printMatriculationOperation(operation);
    }

    return [];
}

function printMatriculationOperation(operation: Operation): string[] {
    const transactionName = operation.transactionInfo.transactionName;

    if (transactionName === UC4Identifier.TRANSACTION_ADD_ENTRIES_MATRICULATION) {
        const paramsArray: string[] = JSON.parse(operation.transactionInfo.parameters);
        const subjectMatriculation: SubjectMatriculation[] = <SubjectMatriculation[]>JSON.parse(paramsArray[1]);

        return printSubjectMatriculation(subjectMatriculation);
    } else if (
        transactionName === UC4Identifier.TRANSACTION_ADD_MATRICULATION ||
        transactionName === UC4Identifier.TRANSACTION_UPDATE_MATRICULATION
    ) {
        const paramsArray: string[] = JSON.parse(operation.transactionInfo.parameters);
        const matriculationData: MatriculationData = <MatriculationData>JSON.parse(paramsArray[0]);

        return printSubjectMatriculation(matriculationData.matriculationStatus);
    }

    return [];
}

function printSubjectMatriculation(data: SubjectMatriculation[]): string[] {
    const result: string[] = [];
    data.forEach((matr) => {
        result.push(matr.fieldOfStudy + " " + matr.semesters.reduce((a, b) => a + ", " + b));
    });

    return result;
}
