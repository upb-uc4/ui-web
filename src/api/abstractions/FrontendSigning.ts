import { useToast } from "@/toast";
import { getPublicKeyFromCertificate } from "@/use/crypto/certificates";
import { signProtobuf, verifyProtobufSignature } from "@/use/crypto/signing";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import { MatriculationValidationResponseHandler } from "@/use/helpers/ImmatriculationResponseHandler";

import { useStore } from "@/use/store/store";
import SignedProposalMessage from "../api_models/common/SignedProposalMessage";
import SignedTransactionMessage from "../api_models/common/SignedTransactionMessage";
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
        matriculationManagement.getUnsignedMatriculationProposal,
        [username, matriculation],
        handler.handleResponse,
        validateMatriculationProposal,
        matriculationManagement.submitSignedMatriculationProposal,
        [username],
        genericHandler.handleResponse,
        matriculationTransactionValidator,
        matriculationManagement.submitSignedMatriculationTransaction,
        [username],
        [enrollmentId, matriculation],
        genericHandler.handleResponse,
        protoUrl
    );
}

async function abstractHandler(
    getUnsignedProposal: (...args: any[]) => Promise<APIResponse<UnsignedProposalMessage>>,
    argsUnsignedProposal: any[],
    proposalValidationHandler: (...args: any[]) => UnsignedProposalMessage,
    proposalValidator: (...args: any[]) => boolean,
    submitProposal: (...args: any[]) => Promise<APIResponse<UnsignedTransactionMessage>>,
    argsSubmitProposal: any[],
    transactionValidationHandler: (...args: any[]) => UnsignedTransactionMessage,
    transactionValidator: (...args: any[]) => boolean,
    submitTransaction: (...args: any[]) => Promise<APIResponse<boolean>>,
    argsSubmitTransaction: any[],
    argsValidation: any[],
    submitHandler: (...args: any[]) => boolean,
    protoUrl?: string
) {
    const proposalResponse = await getUnsignedProposal(...argsUnsignedProposal);
    const unsignedProposal = proposalValidationHandler(proposalResponse);

    if (!unsignedProposal.unsignedProposal) return false;

    const proposal = await decodeProposal(unsignedProposal.unsignedProposal, protoUrl);

    if (!proposal) {
        useToast().error("Could not decode proposal. This is a bug on our side, please consider reporting this.");
        return false;
    }

    const proposalValidation = proposalValidator(proposal.payload, ...argsValidation);

    if (!proposalValidation) {
        useToast().error("Proposal validation failed. Your browser or university might be compromised.");
        return false;
    }

    const privateKey = await useStore().getters.privateKey;
    const certificate = await useStore().getters.certificate();
    const publicKey = await getPublicKeyFromCertificate(certificate.certificate);

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
    const response = await submitProposal(...argsSubmitProposal, signedProposalMessage);

    const unsignedTransaction = transactionValidationHandler(response);

    if (!unsignedTransaction.unsignedTransaction) return false;

    const transaction = await decodeTransaction(unsignedTransaction.unsignedTransaction, protoUrl);

    if (!transaction) {
        useToast().error("Could not decode transaction. This is a bug on our side, please consider reporting this.");
        return false;
    }

    const transactionValidation = transactionValidator(transaction, ...argsValidation);

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

    const submitResponse = await submitTransaction(...argsSubmitTransaction, signedTransactionMessage);

    return submitHandler(submitResponse);
}
