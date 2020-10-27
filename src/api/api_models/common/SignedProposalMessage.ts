export default interface SignedProposalMessage {
    unsignedProposal: string;
    signature: string;
    transactionId: string;
}
