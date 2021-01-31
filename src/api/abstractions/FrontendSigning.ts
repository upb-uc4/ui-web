import { useToast } from "@/toast";
import { getPublicKeyFromCertificate } from "@/use/crypto/certificates";
import { signProtobuf, verifyProtobufSignature } from "@/use/crypto/signing";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import { MatriculationValidationResponseHandler } from "@/use/helpers/ImmatriculationResponseHandler";
import { useStore } from "@/use/store/store";
import AdmissionManagement from "../AdmissionManagement";
import CourseAdmission from "../api_models/admission_management/CourseAdmission";
import { ProposalPayload } from "../api_models/common/Proposal";
import SignedProposalMessage from "../api_models/common/SignedProposalMessage";
import SignedTransactionMessage from "../api_models/common/SignedTransactionMessage";
import TransactionMessage from "../api_models/common/Transaction";
import UnsignedProposalMessage from "../api_models/common/UnsignedProposalMessage";
import UnsignedTransactionMessage from "../api_models/common/UnsignedTransactionMessage";
import SubjectMatriculation from "../api_models/matriculation_management/SubjectMatriculation";
import CertificateManagement from "../CertificateManagement";
import Operation from "../api_models/operation_management/Operation";
import APIResponse from "../helpers/models/APIResponse";
import { calculateOperationId, validateOperationId } from "../helpers/OperationValidator";
import {
    validateApprovalProposal,
    validateCourseAdmissionProposal,
    validateMatriculationProposal,
    validateRejectionProposal,
} from "../helpers/ProposalPayloadValidator";
import { decodeProposal } from "../helpers/ProtobuffDecoding";
import { decodeTransaction } from "../helpers/TransactionDecoding";
import {
    admissionsTransactionValidator,
    approveTransactionValidator,
    matriculationTransactionValidator,
    rejectionTransactionValidator,
} from "../helpers/TransactionValidator";
import MatriculationManagement from "../MatriculationManagement";
import OperationManagement from "../OperationManagement";
import { UC4Identifier } from "../helpers/UC4Identifier";
import MatriculationData from "../api_models/matriculation_management/MatriculationData";
import {
    buildTransactionInfoMatriculationAddEntries,
    buildTransactionInfoMatriculationAddMatriculation,
    buildTransactionInfoMatriculationUpdateMatriculation,
} from "../helpers/TransactionInfoBuilder/MatriculationTransactionInfoBuilder";

export async function updateMatriculation(
    username: string,
    enrollmentId: string,
    matriculation: SubjectMatriculation[],
    protoUrl?: string
): Promise<boolean> {
    const matriculationManagement = new MatriculationManagement();

    const handler = new MatriculationValidationResponseHandler();
    const genericHandler = new GenericResponseHandler("transaction");

    return await abstractHandler(
        async () => {
            return await matriculationManagement.getUnsignedMatriculationProposal(username, matriculation);
        },
        (arg: APIResponse<UnsignedProposalMessage>) => {
            return handler.handleResponse(arg);
        },
        async (payload: ProposalPayload) => {
            const transactionInfoAddEntries = buildTransactionInfoMatriculationAddEntries(enrollmentId, matriculation);
            const transactionInfoAddMatriculation = buildTransactionInfoMatriculationAddMatriculation({
                enrollmentId,
                matriculationStatus: matriculation,
            });
            const transactionInfoUpdateMatriculation = buildTransactionInfoMatriculationUpdateMatriculation({
                enrollmentId,
                matriculationStatus: matriculation,
            });

            const promiseAddEntries = calculateOperationId(transactionInfoAddEntries).then((operationId) => {
                return validateApprovalProposal(payload, operationId);
            });

            const promiseAddMatriculation = calculateOperationId(transactionInfoAddMatriculation).then((operationId) => {
                return validateApprovalProposal(payload, operationId);
            });

            const promiseUpdateMatriculation = calculateOperationId(transactionInfoUpdateMatriculation).then((operationId) => {
                return validateApprovalProposal(payload, operationId);
            });

            const promises = [promiseAddEntries, promiseAddMatriculation, promiseUpdateMatriculation];

            const [validate1, validate2, validate3] = await Promise.all(promises);

            console.log((validate1 || validate2 || validate3) && !(validate1 && validate2 && validate3));

            return (validate1 || validate2 || validate3) && !(validate1 && validate2 && validate3);
        },
        (response: APIResponse<UnsignedTransactionMessage>) => {
            return genericHandler.handleResponse(response);
        },
        async (transaction: TransactionMessage) => {
            const transactionInfoAddEntries = buildTransactionInfoMatriculationAddEntries(enrollmentId, matriculation);
            const transactionInfoAddMatriculation = buildTransactionInfoMatriculationAddMatriculation({
                enrollmentId,
                matriculationStatus: matriculation,
            });
            const transactionInfoUpdateMatriculation = buildTransactionInfoMatriculationUpdateMatriculation({
                enrollmentId,
                matriculationStatus: matriculation,
            });

            const promiseAddEntries = calculateOperationId(transactionInfoAddEntries).then((operationId) => {
                return approveTransactionValidator(transaction, operationId);
            });

            const promiseAddMatriculation = calculateOperationId(transactionInfoAddMatriculation).then((operationId) => {
                return approveTransactionValidator(transaction, operationId);
            });

            const promiseUpdateMatriculation = calculateOperationId(transactionInfoUpdateMatriculation).then((operationId) => {
                return approveTransactionValidator(transaction, operationId);
            });

            const promises = [promiseAddEntries, promiseAddMatriculation, promiseUpdateMatriculation];

            const [validate1, validate2, validate3] = await Promise.all(promises);

            console.log((validate1 || validate2 || validate3) && !(validate1 && validate2 && validate3));

            return (validate1 || validate2 || validate3) && !(validate1 && validate2 && validate3);
        },
        (response: APIResponse<boolean>) => {
            return genericHandler.handleResponse(response);
        },
        protoUrl
    );
}

export async function addCourseAdmission(enrollmentId: string, addAdmission: CourseAdmission, protoUrl?: string) {
    const genericHandler = new GenericResponseHandler("admission");

    const genericHandler2 = new GenericResponseHandler("transaction");

    const admissionManagement = new AdmissionManagement();

    return await abstractHandler(
        async () => {
            return await admissionManagement.getUnsignedCourseAdmissionAddProposal(addAdmission);
        },
        (arg: APIResponse<UnsignedProposalMessage>) => {
            return genericHandler.handleResponse(arg);
        },
        async (payload: ProposalPayload) => {
            return validateCourseAdmissionProposal(payload, undefined, addAdmission, enrollmentId);
        },
        (response: APIResponse<UnsignedTransactionMessage>) => {
            return genericHandler2.handleResponse(response);
        },
        async (transaction: TransactionMessage) => {
            return admissionsTransactionValidator(transaction, undefined, addAdmission, enrollmentId);
        },
        (response: APIResponse<boolean>) => {
            return genericHandler.handleResponse(response);
        },
        protoUrl
    );
}

export async function dropCourseAdmission(admissionId: string, protoUrl?: string) {
    const genericHandler = new GenericResponseHandler("drop admission");

    const genericHandler2 = new GenericResponseHandler("transaction");

    const admissionManagement = new AdmissionManagement();

    return await abstractHandler(
        async () => {
            return await admissionManagement.getUnsignedCourseAdmissionDropProposal(admissionId);
        },
        (arg: APIResponse<UnsignedProposalMessage>) => {
            return genericHandler.handleResponse(arg);
        },
        async (payload: ProposalPayload) => {
            return validateCourseAdmissionProposal(payload, admissionId);
        },
        (response: APIResponse<UnsignedTransactionMessage>) => {
            return genericHandler2.handleResponse(response);
        },
        async (transaction: TransactionMessage) => {
            return admissionsTransactionValidator(transaction, admissionId);
        },
        (response: APIResponse<boolean>) => {
            return genericHandler.handleResponse(response);
        },
        protoUrl
    );
}

export async function approveOperation(operation: Operation, protoUrl?: string): Promise<boolean> {
    if (!(await validateOperationId(operation))) return Promise.reject("OperationId does not fit to transactionInfo");

    const genericHandler = new GenericResponseHandler("approve operation");

    const genericHandler2 = new GenericResponseHandler("transaction");

    const operationManagement = new OperationManagement();

    return await abstractHandler(
        async () => {
            return await operationManagement.getUnsignedApprovalProposal(operation.operationId);
        },
        (arg: APIResponse<UnsignedProposalMessage>) => {
            return genericHandler.handleResponse(arg);
        },
        async (payload: ProposalPayload) => {
            return validateApprovalProposal(payload, operation.operationId);
        },
        (response: APIResponse<UnsignedTransactionMessage>) => {
            return genericHandler2.handleResponse(response);
        },
        async (transaction: TransactionMessage) => {
            return approveTransactionValidator(transaction, operation.operationId);
        },
        (response: APIResponse<boolean>) => {
            return genericHandler.handleResponse(response);
        },
        protoUrl
    );
}

export async function rejectOperation(operation: Operation, rejectMessage: string, protoUrl?: string): Promise<boolean> {
    if (!(await validateOperationId(operation))) return Promise.reject("OperationId does not fit to transactionInfo");

    const genericHandler = new GenericResponseHandler("reject operation");

    const genericHandler2 = new GenericResponseHandler("transaction");

    const operationManagement = new OperationManagement();

    return await abstractHandler(
        async () => {
            return await operationManagement.getUnsignedRejectionProposal(operation.operationId, rejectMessage);
        },
        (arg: APIResponse<UnsignedProposalMessage>) => {
            return genericHandler.handleResponse(arg);
        },
        async (payload: ProposalPayload) => {
            return validateRejectionProposal(payload, operation.operationId, rejectMessage);
        },
        (response: APIResponse<UnsignedTransactionMessage>) => {
            return genericHandler2.handleResponse(response);
        },
        async (transaction: TransactionMessage) => {
            return rejectionTransactionValidator(transaction, operation.operationId, rejectMessage);
        },
        (response: APIResponse<boolean>) => {
            return genericHandler.handleResponse(response);
        },
        protoUrl
    );
}

async function abstractHandler(
    getUnsignedProposal: (...args: any[]) => Promise<APIResponse<UnsignedProposalMessage>>,
    proposalValidationHandler: (...args: any[]) => UnsignedProposalMessage,
    proposalValidator: (...args: any[]) => Promise<boolean>,
    transactionValidationHandler: (...args: any[]) => UnsignedTransactionMessage,
    transactionValidator: (...args: any[]) => Promise<boolean>,
    submitHandler: (...args: any[]) => boolean,
    protoUrl?: string
) {
    const privateKey = await useStore()
        .getters.privateKey()
        .catch(() => {
            return undefined;
        });

    if (!privateKey) return false;

    const certificate = await useStore()
        .getters.certificate()
        .catch(() => {
            return undefined;
        });

    if (!certificate) return false;

    const publicKey = await getPublicKeyFromCertificate(certificate.certificate);

    const proposalResponse = await getUnsignedProposal();
    const unsignedProposal = proposalValidationHandler(proposalResponse);

    if (!unsignedProposal.unsignedProposal) return false;

    const proposal = await decodeProposal(unsignedProposal.unsignedProposal, protoUrl).catch((reason: any) => {
        useToast().error("Could not decode proposal. This is a bug on our side, please consider reporting this.");
    });

    if (!proposal) {
        useToast().error("Could not decode proposal. This is a bug on our side, please consider reporting this.");
        return false;
    }

    const proposalValidation = proposalValidator(proposal.payload);

    if (!proposalValidation) {
        useToast().error("Proposal validation failed. Your browser or university might be compromised.");
        return false;
    }

    const proposalSignature = await signProtobuf(unsignedProposal.unsignedProposal, privateKey);

    const proposalSignatureValidation = await verifyProtobufSignature(unsignedProposal.unsignedProposal, proposalSignature, publicKey);

    if (!proposalSignatureValidation) {
        useToast().error("Could not verify own signature. Your private key or certificate might be compromised.");
        return false;
    }

    const signedProposalMessage: SignedProposalMessage = {
        signature: proposalSignature,
        unsignedProposal: unsignedProposal.unsignedProposal,
    };

    const operationManagement = new OperationManagement();

    const response = await operationManagement.submitSignedProposal(signedProposalMessage);

    const unsignedTransaction = transactionValidationHandler(response);

    if (!unsignedTransaction.unsignedTransaction) return false;

    const transaction = await decodeTransaction(unsignedTransaction.unsignedTransaction, protoUrl).catch((reason: any) => {
        useToast().error("Could not decode transaction. This is a bug on our side, please consider reporting this.");
    });

    if (!transaction) {
        useToast().error("Could not decode transaction. This is a bug on our side, please consider reporting this.");
        return false;
    }

    const transactionValidation = await transactionValidator(transaction);

    if (!transactionValidation) {
        useToast().error("Transaction validation failed. Your browser or university might be compromised.");
        return false;
    }

    const transactionSignature = await signProtobuf(unsignedTransaction.unsignedTransaction, privateKey);
    const transactionSignatureValidation = await verifyProtobufSignature(
        unsignedTransaction.unsignedTransaction,
        transactionSignature,
        publicKey
    );

    if (!transactionSignatureValidation) {
        useToast().error("Could not verify own signature. Your private key or certificate might be compromised.");
        return false;
    }

    const signedTransactionMessage: SignedTransactionMessage = {
        signature: transactionSignature,
        unsignedTransaction: unsignedTransaction.unsignedTransaction,
    };

    const submitResponse = await operationManagement.submitSignedTransaction(signedTransactionMessage);

    return submitHandler(submitResponse);
}
