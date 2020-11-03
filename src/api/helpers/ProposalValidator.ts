// This checks, whether the payload of a proposal is in fact the same as the submitted data

import MatriculationData from "../api_models/matriculation_management/MatriculationData";
import SubjectMatriculation from "../api_models/matriculation_management/SubjectMatriculation";
import Proposal from "../api_models/transactions/Proposal";
import { isEqual } from "lodash";

export function validateMatriculationProposal(enrollmentId: string, matriculation: SubjectMatriculation[], proposal: Proposal): boolean {
    const txName = proposal.payload.input.input.args[0];

    if (txName !== "UC4.Approval:approveTransaction") return false;

    const name = proposal.payload.input.input.args[1] + ":" + proposal.payload.input.input.args[2];

    if (name == "UC4.MatriculationData:addEntriesToMatriculationData") {
        const jsonString = proposal.payload.input.input.args[3];
        const paramsArray: string[] = JSON.parse(jsonString);
        const proposalEnrollmentId = paramsArray[0];
        const proposalMatriculation: SubjectMatriculation[] = <SubjectMatriculation[]>JSON.parse(paramsArray[1]);

        let result = true;
        result = result && proposalEnrollmentId === enrollmentId;
        result = result && isEqual(proposalMatriculation, matriculation);

        return result;
    }

    if (name == "UC4.MatriculationData:addMatriculationData" || name === "UC4.MatriculationData:updateMatriculationData") {
        const jsonString = proposal.payload.input.input.args[3];
        const paramsArray: string[] = JSON.parse(jsonString);
        const proposalMatriculationData: MatriculationData = <MatriculationData>JSON.parse(paramsArray[0]);

        let result = true;
        result = result && proposalMatriculationData.enrollmentId === enrollmentId;
        result = result && isEqual(proposalMatriculationData.matriculationStatus, matriculation);

        return result;
    }

    return false;
}
