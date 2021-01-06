// Incomplete representations of HLF proposals

export default interface Proposal {
    header: Header;
    payload: ProposalPayload;
}

export interface Header {
    signatureHeader: SignatureHeader;
    channelHeader: ChannelHeader;
}

export interface ProposalPayload {
    transientMap: ArrayBuffer;
    input: ChaincodeInvocationSpec;
}

export interface ChannelHeader {
    channelId: string;
    extension: ChaincodeHeaderExtension;
    timestamp: {
        nanos: number;
        seconds: string;
    };
    txId: string;
    type: number;
    version: number;
}

export interface ChaincodeHeaderExtension {
    chaincodeId: string;
}

export interface SignatureHeader {
    creator: {
        mspid: string;
        idBytes: string;
    };
    nonce: ArrayBuffer;
}

export interface ChaincodeInvocationSpec {
    chaincodeId: {
        name: string;
    };
    input: {
        args: string[];
    };
}
