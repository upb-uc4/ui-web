import { useToast } from "@/toast";
import { getPublicKeyFromCertificate } from "@/use/crypto/certificates";
import { signProtobuf, verifyProtobufSignature } from "@/use/crypto/signing";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import { MatriculationValidationResponseHandler } from "@/use/helpers/ImmatriculationResponseHandler";

import { useStore } from "@/use/store/store";
import { ProposalPayload } from "../api_models/common/Proposal";
import SignedProposalMessage from "../api_models/common/SignedProposalMessage";
import SignedTransactionMessage from "../api_models/common/SignedTransactionMessage";
import TransactionMessage from "../api_models/common/Transaction";
import UnsignedProposalMessage from "../api_models/common/UnsignedProposalMessage";
import UnsignedTransactionMessage from "../api_models/common/UnsignedTransactionMessage";
import SubjectMatriculation from "../api_models/matriculation_management/SubjectMatriculation";

import APIResponse from "../helpers/models/APIResponse";
import { validateMatriculationProposal } from "../helpers/ProposalPayloadValidator";

import { decodeProposal } from "../helpers/ProtobuffDecoding";
import { decodeTransaction } from "../helpers/TransactionDecoding";
import { matriculationTransactionValidator } from "../helpers/TransactionValidator";
import MatriculationManagement from "../MatriculationManagement";

export async function updateMatriculation(
    enrollmentId: string,
    username: string,
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
        (payload: ProposalPayload) => {
            return validateMatriculationProposal(payload, enrollmentId, matriculation);
        },
        async (message: SignedProposalMessage) => {
            return await matriculationManagement.submitSignedMatriculationProposal(username, message);
        },
        (response: APIResponse<UnsignedTransactionMessage>) => {
            return genericHandler.handleResponse(response);
        },
        (transaction: TransactionMessage) => {
            return matriculationTransactionValidator(enrollmentId, matriculation, transaction);
        },
        async (message: SignedTransactionMessage) => {
            return await matriculationManagement.submitSignedMatriculationTransaction(username, message);
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
    proposalValidator: (...args: any[]) => boolean,
    submitProposal: (...args: any[]) => Promise<APIResponse<UnsignedTransactionMessage>>,
    transactionValidationHandler: (...args: any[]) => UnsignedTransactionMessage,
    transactionValidator: (...args: any[]) => boolean,
    submitTransaction: (...args: any[]) => Promise<APIResponse<boolean>>,
    submitHandler: (...args: any[]) => boolean,
    protoUrl?: string
) {
    const privateKey = await useStore().getters.privateKey;
    const certificate = await useStore().getters.certificate();
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
    const response = await submitProposal(signedProposalMessage);

    const unsignedTransaction = transactionValidationHandler(response);

    if (!unsignedTransaction.unsignedTransaction) return false;

    const transaction = await decodeTransaction(unsignedTransaction.unsignedTransaction, protoUrl).catch((reason: any) => {
        useToast().error("Could not decode transaction. This is a bug on our side, please consider reporting this.");
    });

    if (!transaction) {
        useToast().error("Could not decode transaction. This is a bug on our side, please consider reporting this.");
        return false;
    }

    const transactionValidation = transactionValidator(transaction);

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

    const submitResponse = await submitTransaction(signedTransactionMessage);

    return submitHandler(submitResponse);
}
