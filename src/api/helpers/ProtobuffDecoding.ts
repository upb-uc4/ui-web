import { load } from "protobufjs";
import { base64ToArrayBuffer } from "@/use/crypto/certificates";
import Proposal, { ChaincodeHeaderExtension, ChannelHeader, ProposalPayload, SignatureHeader } from "../api_models/transactions/Proposal";

export async function decodeProposal(base64Proposal: string): Promise<Proposal | undefined> {
    const buf = base64ToArrayBuffer(base64Proposal);

    return load("hlf-proto.json").then((root) => {
        const proposalMessage = root.lookupType("protos.Proposal");
        const headerMessage = root.lookupType("common.Header");
        const channelHeaderType = root.lookupType("common.ChannelHeader");
        const signatureHeaderType = root.lookupType("common.SignatureHeader");
        const chaincodeHeaderExtensionType = root.lookupType("ChaincodeHeaderExtension");
        const chaincodeProposalPayload = root.lookupType("protos.ChaincodeProposalPayload");
        const chaincodeInvocationSpec = root.lookupType("protos.ChaincodeInvocationSpec");
        const serializedIdentityType = root.lookupType("msp.SerializedIdentity");

        const message = proposalMessage.decode(new Uint8Array(buf));
        const mHeader = headerMessage.decode((message as any)["header"]);
        const cHeader = channelHeaderType.decode((mHeader as any)["channelHeader"]);
        const sHeader = signatureHeaderType.decode((mHeader as any)["signatureHeader"]);

        const channelHeader = cHeader.toJSON() as ChannelHeader;
        channelHeader.extension = chaincodeHeaderExtensionType.decode((cHeader as any)["extension"]).toJSON() as ChaincodeHeaderExtension;

        const serializedIdentity = serializedIdentityType.decode((sHeader as any)["creator"]);

        const signatureHeader: SignatureHeader = {
            nonce: (sHeader as any)["nonce"],
            creator: serializedIdentity.toJSON() as { mspid: string; idBytes: string },
        };
        signatureHeader.creator.idBytes = new TextDecoder("utf-8").decode((serializedIdentity as any)["idBytes"]);

        const header = {
            signatureHeader,
            channelHeader,
        };

        const proposalPayload = chaincodeProposalPayload.decode((message as any)["payload"]);
        let chainInvocSpec = chaincodeInvocationSpec.decode((proposalPayload as any)["input"]);

        const payload: ProposalPayload = {
            transientMap: (proposalPayload as any)["TransientMap"],
            input: (chainInvocSpec.toJSON() as any).chaincodeSpec,
        };

        payload.input.input.args = [];
        let args = (chainInvocSpec as any)["chaincodeSpec"]["input"]["args"] as Uint8Array[];
        args.forEach((e) => payload.input.input.args.push(new TextDecoder("utf-8").decode(e)));

        return {
            header,
            payload,
        };
    });
}
