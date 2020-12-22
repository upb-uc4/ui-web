import { load } from "protobufjs";
import { arrayBufferToBase64, base64ToArrayBuffer } from "@/use/crypto/certificates";

import { ChaincodeHeaderExtension, ChannelHeader, Header, ProposalPayload, SignatureHeader } from "../api_models/common/Proposal";
import TransactionMessage, {
    ChaincodeActionPayload,
    ChaincodeEndorsedAction,
    Transaction,
    TransactionAction,
} from "../api_models/common/Transaction";

export async function decodeTransaction(base64Proposal: string, protoURL?: string): Promise<TransactionMessage | undefined> {
    if (protoURL === undefined) protoURL = "hlf-proto.json";

    const buf = base64ToArrayBuffer(base64Proposal);

    return load(protoURL).then((root) => {
        try {
            let transaction: TransactionMessage = {} as TransactionMessage;
            transaction.data = {} as Transaction;
            transaction.data.actions = [];

            const protoTransaction = root.lookupType("protos.Transaction");
            const protoChaincodeActionPayload = root.lookupType("protos.ChaincodeActionPayload");
            const channelHeaderType = root.lookupType("common.ChannelHeader");
            const serializedIdentityType = root.lookupType("msp.SerializedIdentity");
            const signatureHeaderType = root.lookupType("common.SignatureHeader");
            const protoPayload = root.lookupType("common.Payload");
            const chaincodeHeaderExtensionType = root.lookupType("ChaincodeHeaderExtension");
            const protoProposalResponsePayload = root.lookupType("protos.ProposalResponsePayload");
            const protoChaincodeProposalPayload = root.lookupType("protos.ChaincodeProposalPayload");
            const chaincodeInvocationSpec = root.lookupType("protos.ChaincodeInvocationSpec");

            const testPayload = protoPayload.decode(new Uint8Array(buf));

            const cHeader = channelHeaderType.decode((testPayload as any)["header"]["channelHeader"]);
            const sHeader = signatureHeaderType.decode((testPayload as any)["header"]["signatureHeader"]);
            const serializedIdentity = serializedIdentityType.decode((sHeader as any)["creator"]);
            const signatureHeader: SignatureHeader = {
                nonce: (sHeader as any)["nonce"],
                creator: serializedIdentity.toJSON() as { mspid: string; idBytes: string },
            };
            signatureHeader.creator.idBytes = Utf8ArrayToStr((serializedIdentity as any)["idBytes"]);

            const channelHeader = cHeader.toJSON() as ChannelHeader;
            channelHeader.extension = chaincodeHeaderExtensionType
                .decode((cHeader as any)["extension"])
                .toJSON() as ChaincodeHeaderExtension;

            transaction.header = {
                signatureHeader,
                channelHeader,
            };

            const trans = protoTransaction.decode((testPayload as any)["data"]);

            // transaction.actions
            for (let action of trans.toJSON().actions) {
                const transactionAction: TransactionAction = {} as TransactionAction;
                transactionAction.header = {} as SignatureHeader;
                transactionAction.payload = {} as ChaincodeActionPayload;
                transactionAction.payload.action = {} as ChaincodeEndorsedAction;
                transactionAction.payload.action.endorsements = [];

                // header
                const header = signatureHeaderType.decode(new Uint8Array(base64ToArrayBuffer(action["header"])));

                const serializedIdentity = serializedIdentityType.decode((header as any)["creator"]);
                const signatureHeader: SignatureHeader = {
                    nonce: (header as any)["nonce"],
                    creator: serializedIdentity.toJSON() as { mspid: string; idBytes: string },
                };
                signatureHeader.creator.idBytes = Utf8ArrayToStr((serializedIdentity as any)["idBytes"]);

                transactionAction.header = signatureHeader;

                // payload (ChaincodeActionPayload)

                const chaincodeActionPayload = protoChaincodeActionPayload.decode(new Uint8Array(base64ToArrayBuffer(action["payload"])));

                // action endorsements
                for (let endorsement of (chaincodeActionPayload as any)["action"]["endorsements"]) {
                    const identity: { mspId: string; idBytes: string } = {} as { mspId: string; idBytes: string };
                    const endorser = serializedIdentityType.decode((endorsement as any)["endorser"]);
                    identity.mspId = endorser as any["mspid"];
                    identity.idBytes = Utf8ArrayToStr((endorser as any)["idBytes"]);

                    const signature = arrayBufferToBase64((endorsement as any)["signature"]);

                    transactionAction.payload.action.endorsements.push({ endorser: identity, signature });
                }

                // action proposalresponsepayload

                const proposalResponsePayload = protoProposalResponsePayload.decode(
                    (chaincodeActionPayload as any)["action"]["proposalResponsePayload"]
                );

                transactionAction.payload.action.proposalResponsePayload = proposalResponsePayload.toJSON() as any;
                transactionAction.payload.action.rawProposalResponsePayload = (chaincodeActionPayload as any)["action"][
                    "proposalResponsePayload"
                ];

                // action extension
                // ignore

                // action hash
                const proposalHash = arrayBufferToBase64((proposalResponsePayload as any)["proposalHash"]);

                transactionAction.payload.action.proposalResponsePayload.proposalHash = proposalHash;

                const proposalPayload = protoChaincodeProposalPayload.decode((chaincodeActionPayload as any)["chaincodeProposalPayload"]);
                let chainInvocSpec = chaincodeInvocationSpec.decode((proposalPayload as any)["input"]);

                const payload: ProposalPayload = {
                    transientMap: (proposalPayload as any)["TransientMap"],
                    input: (chainInvocSpec.toJSON() as any).chaincodeSpec,
                };

                payload.input.input.args = [];
                let args = (chainInvocSpec as any)["chaincodeSpec"]["input"]["args"] as Uint8Array[];
                args.forEach((e) => payload.input.input.args.push(Utf8ArrayToStr(e)));

                transactionAction.payload.chainCodeProposalPayload = payload;
                transaction.data.actions.push(transactionAction);
            }

            return transaction;
        } catch (error) {
            Promise.reject("Transaction decoding failed with error: " + error);
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

    function str2ab(str: string) {
        var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
}
