import * as asn1js from "asn1js";
import Attribute from "pkijs/src/Attribute";
import CertificationRequest from "pkijs/src/CertificationRequest";
import { getCrypto } from "pkijs/src/common";
import GeneralName from "pkijs/src/GeneralName";
import Extension from "pkijs/src/Extension";
import Extensions from "pkijs/src/Extensions";

export async function createKeyPair() {
    const crypto = window.crypto;
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );
    return {
        public: await crypto.subtle.exportKey("spki", keyPair.publicKey),
        private: await crypto.subtle.exportKey("pkcs8", keyPair.privateKey),
    };
}

export async function buildCSR(keyPair: CryptoKeyPair, enrollmenId: string, enrollmentSecret: string) {
    //TODO
    const crypto = await getCrypto();
    if (typeof crypto === "undefined") {
        return Promise.reject("No WebCrypto extension found");
    }
    const pkcs10 = new CertificationRequest();
    pkcs10.version = 0;
    const info = new GeneralName({
        info: [
            new GeneralName({
                type: 1,
                value: enrollmenId,
            }),
            new GeneralName({
                type: 2,
                value: enrollmentSecret,
            }),
        ],
    });
    pkcs10.attributes = [];
    pkcs10.subjectPublicKeyInfo.importKey(keyPair.publicKey);
    const hashedPK = await crypto.digest({ name: "SHA-1" }, pkcs10.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex);
    pkcs10.attributes.push(
        new Attribute({
            type: "1.2.840.113549.1.9.14", // pkcs-9-at-extensionRequest (from example)
            values: [
                new Extensions({
                    extensions: [
                        new Extension({
                            extnID: "2.5.29.14",
                            critical: false,
                            extnValue: new asn1js.OctetString({ valueHex: hashedPK }).toBER(false),
                        }),
                    ],
                }).toSchema(),
            ],
        })
    );

    return pkcs10.toSchema().toBER(false);
}
