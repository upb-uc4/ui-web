import { base64ToArrayBuffer } from "@/use/crypto/certificates";
import { load } from "protobufjs";
import Proposal, { ChaincodeHeaderExtension, ChannelHeader, ProposalPayload, SignatureHeader } from "../api_models/common/Proposal";

export async function decodeProposal(base64Proposal: string, protoURL?: string): Promise<Proposal | undefined> {
    if (protoURL === undefined) protoURL = "/hlf-proto.json";

    const buf = base64ToArrayBuffer(base64Proposal);

    return load(protoURL).then((root) => {
        try {
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
            channelHeader.extension = chaincodeHeaderExtensionType
                .decode((cHeader as any)["extension"])
                .toJSON() as ChaincodeHeaderExtension;

            const serializedIdentity = serializedIdentityType.decode((sHeader as any)["creator"]);

            const signatureHeader: SignatureHeader = {
                nonce: (sHeader as any)["nonce"],
                creator: serializedIdentity.toJSON() as { mspid: string; idBytes: string },
            };
            signatureHeader.creator.idBytes = Utf8ArrayToStr((serializedIdentity as any)["idBytes"]);

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
            args.forEach((e) => payload.input.input.args.push(Utf8ArrayToStr(e)));

            return {
                header,
                payload,
            };
        } catch (error) {
            Promise.reject("Proposal decoding failed with error: " + error);
        }
    });

    // http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt

    /* utf.js - UTF-8 <=> UTF-16 convertion
     *
     * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
     * Version: 1.0
     * LastModified: Dec 25 1999
     * This library is free.  You can redistribute it and/or modify it.
     */

    function Utf8ArrayToStr(array: Uint8Array) {
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12:
                case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0));
                    break;
            }
        }
        return out;
    }
}
