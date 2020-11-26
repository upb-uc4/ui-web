// This checks, whether the payload of a proposal is in fact the same as the submitted data

import MatriculationData from "../api_models/matriculation_management/MatriculationData";
import SubjectMatriculation from "../api_models/matriculation_management/SubjectMatriculation";
import Proposal from "../api_models/transactions/Proposal";
import { isEqual } from "lodash";
import { UC4Identifier } from "./UC4Identifier";
import CourseAdmission from "../api_models/admission_management/CourseAdmission";
import { useStore } from "@/use/store/store";
import CertificateManagement from "../CertificateManagement";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";

export function validateMatriculationProposal(enrollmentId: string, matriculation: SubjectMatriculation[], proposal: Proposal): boolean {
    const name = proposal.payload.input.input.args[0];
    const contractToApprove = proposal.payload.input.input.args[1];
    const transactionToApprove = proposal.payload.input.input.args[2];

    if (name !== UC4Identifier.CONTRACT_APPROVAL + UC4Identifier.SEPERATOR + UC4Identifier.TRANSACTION_APPROVAL) return false;
    if (contractToApprove !== UC4Identifier.CONTRACT_MATRICULATION) return false;

    if (transactionToApprove === UC4Identifier.TRANSACTION_ADD_ENTRIES_MATRICULATION) {
        const jsonString = proposal.payload.input.input.args[3];
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
        const jsonString = proposal.payload.input.input.args[3];
        const paramsArray: string[] = JSON.parse(jsonString);
        const proposalMatriculationData: MatriculationData = <MatriculationData>JSON.parse(paramsArray[0]);

        let result = proposalMatriculationData.enrollmentId === enrollmentId;
        result = result && isEqual(proposalMatriculationData.matriculationStatus, matriculation);

        return result;
    }

    return false;
}

export async function validateCourseAdmissionProposal(
    proposal: Proposal,
    admissionId?: string,
    courseAdmission?: CourseAdmission
): Promise<boolean> {
    if (!admissionId && !courseAdmission) return false;

    const name = proposal.payload.input.input.args[0];
    const contractToApprove = proposal.payload.input.input.args[1];
    const transactionToApprove = proposal.payload.input.input.args[2];

    if (name !== UC4Identifier.CONTRACT_APPROVAL + UC4Identifier.SEPERATOR + UC4Identifier.TRANSACTION_APPROVAL) return false;
    if (contractToApprove !== UC4Identifier.CONTRACT_ADMISSION) return false;

    const certificateManagement = new CertificateManagement();
    const response = await certificateManagement.getOwnEnrollmentId();
    const enrollmentId = new GenericResponseHandler("enrollment id").handleResponse(response).id;

    if (transactionToApprove === UC4Identifier.TRANSACTION_ADD_ADMISSION) {
        if (!courseAdmission) return false;

        const jsonString = proposal.payload.input.input.args[3];
        const paramsArray: string[] = JSON.parse(jsonString);
        const proposalEnrollmentId = paramsArray[0];
        const proposalCourseId = paramsArray[1];
        const proposalModuleId = paramsArray[2];
        const proposalTimestamp = paramsArray[3];

        let result = proposalEnrollmentId === enrollmentId;
        result = result && proposalCourseId === courseAdmission.courseId;
        result = result && proposalModuleId === courseAdmission.moduleId;

        return result;
    }

    if (transactionToApprove === UC4Identifier.TRANSACTION_DROP_ADMISSION) {
        if (!admissionId) return false;

        const jsonString = proposal.payload.input.input.args[3];
        const paramsArray: string[] = JSON.parse(jsonString);
        const proposalAdmissionId = paramsArray[0];

        let result = proposalAdmissionId === admissionId;

        return result;
    }

    return false;
}
