// This checks, whether the payload of a proposal is in fact the same as the submitted data

import MatriculationData from "../api_models/matriculation_management/MatriculationData";
import SubjectMatriculation from "../api_models/matriculation_management/SubjectMatriculation";
import { ProposalPayload } from "../api_models/common/Proposal";
import { isEqual } from "lodash";
import { UC4Identifier } from "./UC4Identifier";

export function validateMatriculationProposal(
    proposalPayload: ProposalPayload,
    enrollmentId: string,
    matriculation: SubjectMatriculation[]
): boolean {
    const name = proposalPayload.input.input.args[0];
    const contractToApprove = proposalPayload.input.input.args[1];
    const transactionToApprove = proposalPayload.input.input.args[2];

    if (name !== UC4Identifier.CONTRACT_APPROVAL + UC4Identifier.SEPERATOR + UC4Identifier.TRANSACTION_APPROVAL) return false;
    if (contractToApprove !== UC4Identifier.CONTRACT_MATRICULATION) return false;

    if (transactionToApprove === UC4Identifier.TRANSACTION_ADD_ENTRIES_MATRICULATION) {
        const jsonString = proposalPayload.input.input.args[3];
        const paramsArray: string[] = JSON.parse(jsonString);
        const proposalEnrollmentId = paramsArray[0];
        const proposalMatriculation: SubjectMatriculation[] = <SubjectMatriculation[]>JSON.parse(paramsArray[1]);

        let result = proposalEnrollmentId === enrollmentId;
        result = result && isEqual(proposalMatriculation, matriculation);

        return result;
    }

    if (
        transactionToApprove === UC4Identifier.TRANSACTION_ADD_MATRICULATION ||
        transactionToApprove === UC4Identifier.TRANSACTION_UPDATE_MATRICULATION
    ) {
        const jsonString = proposalPayload.input.input.args[3];
        const paramsArray: string[] = JSON.parse(jsonString);
        const proposalMatriculationData: MatriculationData = <MatriculationData>JSON.parse(paramsArray[0]);

        let result = proposalMatriculationData.enrollmentId === enrollmentId;
        result = result && isEqual(proposalMatriculationData.matriculationStatus, matriculation);

        return result;
    }

    return false;
}
