// This checks, whether the payload of a proposal is in fact the same as the submitted data

import MatriculationData from "../api_models/matriculation_management/MatriculationData";
import SubjectMatriculation from "../api_models/matriculation_management/SubjectMatriculation";
import { ProposalPayload } from "../api_models/common/Proposal";
import { isEqual } from "lodash";
import { UC4Identifier } from "./UC4Identifier";
import CourseAdmission from "../api_models/admission_management/CourseAdmission";

export function validateMatriculationProposal(
    proposalPayload: ProposalPayload,
    enrollmentId: string,
    matriculation: SubjectMatriculation[]
): boolean {
    const name = proposalPayload.input.input.args[0];
    const initiator = proposalPayload.input.input.args[1];
    const contractToApprove = proposalPayload.input.input.args[2];
    const transactionToApprove = proposalPayload.input.input.args[3];

    if (name !== UC4Identifier.CONTRACT_APPROVAL + UC4Identifier.SEPERATOR + UC4Identifier.TRANSACTION_APPROVAL) return false;
    if (contractToApprove !== UC4Identifier.CONTRACT_MATRICULATION) return false;

    if (transactionToApprove === UC4Identifier.TRANSACTION_ADD_ENTRIES_MATRICULATION) {
        const jsonString = proposalPayload.input.input.args[4];
        const paramsArray: string[] = JSON.parse(jsonString);
        const proposalEnrollmentId = paramsArray[0];
        const proposalMatriculation: SubjectMatriculation[] = <SubjectMatriculation[]>JSON.parse(paramsArray[1]);

        if (paramsArray.length > 2) return false;

        let result = proposalEnrollmentId === enrollmentId;
        result = result && isEqual(proposalMatriculation, matriculation);

        return result;
    }

    if (
        transactionToApprove === UC4Identifier.TRANSACTION_ADD_MATRICULATION ||
        transactionToApprove === UC4Identifier.TRANSACTION_UPDATE_MATRICULATION
    ) {
        const jsonString = proposalPayload.input.input.args[4];
        const paramsArray: string[] = JSON.parse(jsonString);
        const proposalMatriculationData: MatriculationData = <MatriculationData>JSON.parse(paramsArray[0]);

        if (paramsArray.length > 1) return false;

        let result = proposalMatriculationData.enrollmentId === enrollmentId;
        result = result && isEqual(proposalMatriculationData.matriculationStatus, matriculation);

        return result;
    }

    return false;
}

export function validateCourseAdmissionProposal(
    proposalPayload: ProposalPayload,
    admissionId?: string,
    courseAdmission?: CourseAdmission,
    enrollmentId?: string
): boolean {
    if (!admissionId && !courseAdmission) return false;

    const name = proposalPayload.input.input.args[0];
    const initiator = proposalPayload.input.input.args[1];
    const contractToApprove = proposalPayload.input.input.args[2];
    const transactionToApprove = proposalPayload.input.input.args[3];

    if (name !== UC4Identifier.CONTRACT_APPROVAL + UC4Identifier.SEPERATOR + UC4Identifier.TRANSACTION_APPROVAL) return false;
    if (contractToApprove !== UC4Identifier.CONTRACT_ADMISSION) return false;

    if (transactionToApprove === UC4Identifier.TRANSACTION_ADD_ADMISSION) {
        if (!courseAdmission || !enrollmentId) return false;

        const jsonString = proposalPayload.input.input.args[4];
        const paramsArray: string[] = JSON.parse(jsonString);
        const proposalAdmission: CourseAdmission = <CourseAdmission>JSON.parse(paramsArray[0]);

        if (paramsArray.length > 1) return false;

        let result = proposalAdmission.courseId === courseAdmission.courseId;
        result = result && proposalAdmission.moduleId === courseAdmission.moduleId;
        result = result && proposalAdmission.enrollmentId === enrollmentId;
        return result;
    }

    if (transactionToApprove === UC4Identifier.TRANSACTION_DROP_ADMISSION) {
        if (!admissionId) return false;

        const jsonString = proposalPayload.input.input.args[4];
        const paramsArray: string[] = JSON.parse(jsonString);
        const proposalAdmissionId = paramsArray[0];

        let result = proposalAdmissionId === admissionId;

        return result;
    }

    return false;
}

export function validateRejectionProposal(proposalPayload: ProposalPayload, operationId: string, rejectionReason: string): boolean {
    const name = proposalPayload.input.input.args[0];
    const proposalOperationId = proposalPayload.input.input.args[1];
    const proposalRejectionReason = proposalPayload.input.input.args[2];

    if (name !== UC4Identifier.CONTRACT_APPROVAL + UC4Identifier.SEPERATOR + UC4Identifier.TRANSACTION_REJECTION) return false;

    let result = proposalOperationId === operationId;

    result = result && proposalRejectionReason === rejectionReason;
    return result;
}

export function validateApprovalProposal(proposalPayload: ProposalPayload, operationId: string): boolean {
    const name = proposalPayload.input.input.args[0];
    const proposalOperationId = proposalPayload.input.input.args[1];

    if (name !== UC4Identifier.CONTRACT_APPROVAL + UC4Identifier.SEPERATOR + UC4Identifier.TRANSACTION_REJECTION) return false;

    let result = proposalOperationId === operationId;
    return result;
}
