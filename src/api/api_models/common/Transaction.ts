import { Header, ProposalPayload, SignatureHeader } from "./Proposal";

export default interface TransactionMessage {
    header: Header;
    data: Transaction;
}

export interface Transaction {
    actions: TransactionAction[];
}

export interface TransactionAction {
    header: SignatureHeader;
    payload: ChaincodeActionPayload;
}

export interface ChaincodeActionPayload {
    action: ChaincodeEndorsedAction;
    chainCodeProposalPayload: ProposalPayload;
}

export interface ChaincodeEndorsedAction {
    endorsements: Endorsement[];
    proposalResponsePayload: ProposalResponsePayload;
    rawProposalResponsePayload: ArrayBuffer;
}

export interface Endorsement {
    endorser: { mspId: string; idBytes: string; rawEndorserBytes: ArrayBuffer };
    signature: string;
}

export interface ProposalResponsePayload {
    extension: string;
    proposalHash: string;
}
