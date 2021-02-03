import { useToast } from "@/toast";
import { getPublicKeyFromCertificate } from "@/use/crypto/certificates";
import { signProtobuf, verifyProtobufSignature } from "@/use/crypto/signing";
import { useStore } from "@/use/store/store";
import SignedProposalMessage from "../api_models/common/SignedProposalMessage";
import SignedTransactionMessage from "../api_models/common/SignedTransactionMessage";
import AbstractTransaction from "./AbstractTransaction";

export default async function executeTransaction(executableTransaction: AbstractTransaction, protoUrl?: string) {
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

    const unsignedProposal = await executableTransaction.getProposal();

    if (!unsignedProposal.unsignedProposal) return false;

    const proposal = await executableTransaction.decodeProposal(unsignedProposal, protoUrl).catch((reason: any) => {
        useToast().error("Could not decode proposal. This is a bug on our side, please consider reporting this.");
    });

    if (!proposal) {
        useToast().error("Could not decode proposal. This is a bug on our side, please consider reporting this.");
        return false;
    }

    const proposalValidation = await executableTransaction.validateProposal(proposal);

    if (!proposalValidation) {
        console.log("failed to validate proposal");

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

    const unsignedTransaction = await executableTransaction.getTransaction(signedProposalMessage);

    if (!unsignedTransaction.unsignedTransaction) return false;

    const transaction = await executableTransaction.decodeTransaction(unsignedTransaction, protoUrl).catch((reason: any) => {
        useToast().error("Could not decode transaction. This is a bug on our side, please consider reporting this.");
    });

    if (!transaction) {
        useToast().error("Could not decode transaction. This is a bug on our side, please consider reporting this.");
        return false;
    }

    const transactionValidation = await executableTransaction.validateTransaction(transaction);

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

    return await executableTransaction.submitTransaction(signedTransactionMessage);
}
