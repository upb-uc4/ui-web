import * as asn1js from "asn1js";
import Attribute from "pkijs/src/Attribute";
import CertificationRequest from "pkijs/src/CertificationRequest";
import { getAlgorithmParameters, getCrypto } from "pkijs/src/common";
import Extension from "pkijs/src/Extension";
import Extensions from "pkijs/src/Extensions";
import AttributeTypeAndValue from "pkijs/src/AttributeTypeAndValue";
import { arrayBufferToString, toBase64 } from "pvutils";
import { formatPEM } from "./formatPem";

const signAlg = "RSASSA-PKCS1-v1_5";
const hashAlg = "SHA-256";

export async function createKeyPair() {
    const crypto = await getCrypto();
    if (typeof crypto === "undefined") {
        return Promise.reject("No WebCrypto extension found");
    }
    const algorithm = {
        hash: {
            name: hashAlg,
        },
        modulusLength: 4096,
        name: "RSASSA-PKCS1-v1_5",
        publicExponent: new Uint8Array([1, 0, 1]),
    };
    const usages: KeyUsage[] = ["sign", "verify"];

    return (await crypto.generateKey(algorithm, true, usages)) as CryptoKeyPair;
}

export async function createCSRObject(keyPair: CryptoKeyPair, enrollmenId: string) {
    const crypto = await getCrypto();
    if (typeof crypto === "undefined") {
        return Promise.reject("No WebCrypto extension found");
    }
    const pkcs10 = new CertificationRequest();
    pkcs10.version = 0;
    //add common name to certificate
    pkcs10.subject.typesAndValues.push(
        new AttributeTypeAndValue({
            type: "2.5.4.3", //common name
            value: new asn1js.PrintableString({ value: enrollmenId }),
        })
    );
    await pkcs10.subjectPublicKeyInfo.importKey(keyPair.publicKey);
    pkcs10.attributes = [];
    const hashedPK = await crypto.digest({ name: "SHA-256" }, pkcs10.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex);
    //add hashed public key to certificate's attributes
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

    await pkcs10.sign(keyPair.privateKey, hashAlg);
    return pkcs10;
}

export async function createCSR(keyPair: CryptoKeyPair, enrollmenId: string) {
    let csr = await createCSRObject(keyPair, enrollmenId);
    let result: string = "-----BEGIN CERTIFICATE REQUEST-----\r\n";
    result = `${result}${formatPEM(toBase64(arrayBufferToString(csr.toSchema().toBER(false))))}`;
    result = `${result}\r\n-----END CERTIFICATE REQUEST-----\r\n`;
    return result;
}
