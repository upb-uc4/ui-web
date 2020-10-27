// This checks, whether the payload of a proposal is in fact the same as the submitted data

import MatriculationData from "../api_models/matriculation_management/MatriculationData";
import SubjectMatriculation from "../api_models/matriculation_management/SubjectMatriculation";
import Proposal from "../api_models/transactions/Proposal";

export function validateMatriculationProposal(enrollmentId: string, matriculation: SubjectMatriculation[], proposal: Proposal): boolean {
    const txName = proposal.payload.input.input.args[0];

    if (txName === "UC4.Matriculation:addEntriesToMatriculationData") {
        const proposalEnrollmentId = proposal.payload.input.input.args[1];
        const proposalMatriculation: SubjectMatriculation[] = JSON.parse(proposal.payload.input.input.args[2]);

        let result = true;
        result = result && proposalEnrollmentId === enrollmentId;
        result = result && proposalMatriculation === matriculation;
    }

    if (txName === "UC4.Matriculation:addMatriculationData" || txName === "UC4.Matriculation:updateMatriculationData") {
        const proposalMatriculationData: MatriculationData = JSON.parse(proposal.payload.input.input.args[1]);

        let result = true;
        result = result && proposalMatriculationData.enrollmentId === enrollmentId;
        result = result && proposalMatriculationData.matriculationStatus === matriculation;

        return result;
    }

    return false;
}
