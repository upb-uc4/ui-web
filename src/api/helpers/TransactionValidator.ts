import { base64ToArrayBuffer, getPublicKeyFromCertificate } from "@/use/crypto/certificates";
import { verifyProposalResponsePayloadSignature } from "@/use/crypto/signing";
import CourseAdmission from "../api_models/admission_management/CourseAdmission";
import { ProposalPayload } from "../api_models/common/Proposal";
import TransactionMessage from "../api_models/common/Transaction";
import SubjectMatriculation from "../api_models/matriculation_management/SubjectMatriculation";
import { validateCourseAdmissionProposal, validateMatriculationProposal } from "./ProposalPayloadValidator";

export function matriculationTransactionValidator(
    enrollmentId: string,
    matriculation: SubjectMatriculation[],
    transaction: TransactionMessage
): boolean {
    if (!(transaction.data.actions.length === 1)) {
        return false;
    }

    const payload: ProposalPayload = transaction.data.actions[0].payload.chainCodeProposalPayload;

    if (!validateMatriculationProposal(payload, enrollmentId, matriculation)) {
        return false;
    }

    if (!verifyPeerSignatures(transaction)) {
        return false;
    }

    return true;
}

export function admissionsTransactionValidator(
    transaction: TransactionMessage,
    admissionId?: string,
    courseAdmission?: CourseAdmission
): boolean {
    if (!(transaction.data.actions.length === 1)) {
        return false;
    }

    const payload: ProposalPayload = transaction.data.actions[0].payload.chainCodeProposalPayload;

    if (!validateCourseAdmissionProposal(payload, admissionId, courseAdmission)) {
        return false;
    }

    if (!verifyPeerSignatures(transaction)) {
        return false;
    }

    return true;
}

export async function verifyPeerSignatures(transaction: TransactionMessage): Promise<boolean> {
    const endorsements = transaction.data.actions[0].payload.action.endorsements;
    const rawProposalResponsePayload = transaction.data.actions[0].payload.action.rawProposalResponsePayload;

    for (let endorsement of endorsements) {
        const pubKey = await getPublicKeyFromCertificate(endorsement.endorser.idBytes);

        if (!(await verifyProposalResponsePayloadSignature(rawProposalResponsePayload, endorsement.signature, pubKey))) {
            return false;
        }
    }

    return true;
}
