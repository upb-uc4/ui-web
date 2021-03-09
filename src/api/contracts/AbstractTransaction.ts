import { getPublicKeyFromCertificate } from "@/use/crypto/certificates";
import { verifyProposalResponsePayloadSignature } from "@/use/crypto/signing";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import Proposal, { ProposalPayload } from "../api_models/common/Proposal";
import SignedProposalMessage from "../api_models/common/SignedProposalMessage";
import SignedTransactionMessage from "../api_models/common/SignedTransactionMessage";
import TransactionMessage, { Transaction } from "../api_models/common/Transaction";
import UnsignedProposalMessage from "../api_models/common/UnsignedProposalMessage";
import UnsignedTransactionMessage from "../api_models/common/UnsignedTransactionMessage";
import MatriculationData from "../api_models/matriculation_management/MatriculationData";
import { TransactionInfo } from "../api_models/operation_management/Operation";
import { calculateOperationId } from "../helpers/OperationValidator";
import { decodeProposal } from "../helpers/ProtobuffDecoding";
import { decodeTransaction } from "../helpers/TransactionDecoding";
import { UC4Identifier } from "../helpers/UC4Identifier";
import OperationManagement from "../OperationManagement";

export default abstract class AbstractTransaction {
    public abstract getProposal(): Promise<UnsignedProposalMessage>;

    public async validateProposal(proposal: Proposal): Promise<boolean> {
        const transactionInfo = this.buildTransactionInfo();
        return this.validateProposalOperationId(proposal.payload, transactionInfo);
    }

    public async getTransaction(proposal: SignedProposalMessage): Promise<UnsignedTransactionMessage> {
        const response = await new OperationManagement().submitSignedProposal(proposal);
        return new GenericResponseHandler("proposal").handleResponse(response);
    }

    public async validateTransaction(transaction: TransactionMessage): Promise<boolean> {
        if (!(transaction.data.actions.length === 1)) {
            return false;
        }

        const payload: ProposalPayload = transaction.data.actions[0].payload.chainCodeProposalPayload;
        const transactionInfo = this.buildTransactionInfo();

        if (!(await this.validateProposalOperationId(payload, transactionInfo))) {
            return false;
        }

        if (!(await this.verifyPeerSignatures(transaction))) {
            return false;
        }

        return true;
    }

    public async submitTransaction(transaction: SignedTransactionMessage): Promise<boolean> {
        const response = await new OperationManagement().submitSignedTransaction(transaction);
        return new GenericResponseHandler("transaction").handleResponse(response);
    }

    public decodeProposal(proposal: UnsignedProposalMessage, protoUrl?: string) {
        return decodeProposal(proposal.unsignedProposal, protoUrl);
    }

    public decodeTransaction(transaction: UnsignedTransactionMessage, protoUrl?: string) {
        return decodeTransaction(transaction.unsignedTransaction, protoUrl);
    }

    public abstract buildTransactionInfo(...params: any): TransactionInfo;

    public calculateOperationId(transactionInfo: TransactionInfo) {
        return calculateOperationId(transactionInfo);
    }

    protected async validateProposalOperationId(proposalPayload: ProposalPayload, transactionInfo: TransactionInfo) {
        const operationId = await this.calculateOperationId(transactionInfo);

        const name = proposalPayload.input.input.args[0];
        const proposalOperationId = proposalPayload.input.input.args[1];

        if (name !== UC4Identifier.CONTRACT_APPROVAL + UC4Identifier.SEPERATOR + UC4Identifier.TRANSACTION_APPROVAL) return false;

        return proposalOperationId === operationId;
    }

    protected async verifyPeerSignatures(transaction: TransactionMessage): Promise<boolean> {
        const endorsements = transaction.data.actions[0].payload.action.endorsements;
        const rawProposalResponsePayload = transaction.data.actions[0].payload.action.rawProposalResponsePayload;

        for (let endorsement of endorsements) {
            if (!(await verifyProposalResponsePayloadSignature(rawProposalResponsePayload, endorsement, endorsement.endorser.idBytes))) {
                return false;
            }
        }

        return true;
    }
}
