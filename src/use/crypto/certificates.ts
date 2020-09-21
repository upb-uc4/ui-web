import * as asn1js from "asn1js";
import Attribute from "pkijs/src/Attribute";
import CertificationRequest from "pkijs/src/CertificationRequest";
import { getAlgorithmParameters, getCrypto } from "pkijs/src/common";
import Extension from "pkijs/src/Extension";
import Extensions from "pkijs/src/Extensions";
import AttributeTypeAndValue from "pkijs/src/AttributeTypeAndValue";
import { arrayBufferToString, toBase64 } from "pvutils";

const signAlg = "RSASSA-PKCS1-V1_5";
const hashAlg = "SHA-1";

export async function createKeyPair() {
    const crypto = await getCrypto();
    if (typeof crypto === "undefined") {
        return Promise.reject("No WebCrypto extension found");
    }
    const algorithm = getAlgorithmParameters(signAlg, "generatekey");
    if ("hash" in algorithm.algorithm) {
        (algorithm.algorithm as any).hash.name = hashAlg;
    }
    return (await crypto.generateKey(algorithm.algorithm, true, algorithm.usages)) as CryptoKeyPair;
}

export async function buildCSR(keyPair: CryptoKeyPair, enrollmenId: string) {
    const crypto = await getCrypto();
    if (typeof crypto === "undefined") {
        return Promise.reject("No WebCrypto extension found");
    }
    const pkcs10 = new CertificationRequest();
    pkcs10.version = 0;
    pkcs10.subject.typesAndValues.push(
        new AttributeTypeAndValue({
            type: "2.5.4.3", //common name
            value: new asn1js.PrintableString({ value: enrollmenId }),
        })
    );
    pkcs10.attributes = [];
    await pkcs10.subjectPublicKeyInfo.importKey(keyPair.publicKey);
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

    await pkcs10.sign(keyPair.privateKey);
    let result: string = "-----BEGIN CERTIFICATE REQUEST-----\r\n";
    result = `${result}${formatPEM(toBase64(arrayBufferToString(pkcs10.toSchema().toBER(false))))}`;
    result = `${result}\r\n-----END CERTIFICATE REQUEST-----\r\n`;
    return result;
}

export function formatPEM(pemString: string) {
    const PEM_STRING_LENGTH = pemString.length,
        LINE_LENGTH = 64;
    const wrapNeeded = PEM_STRING_LENGTH > LINE_LENGTH;

    if (wrapNeeded) {
        let formattedString = "",
            wrapIndex = 0;

        for (let i = LINE_LENGTH; i < PEM_STRING_LENGTH; i += LINE_LENGTH) {
            formattedString += pemString.substring(wrapIndex, i) + "\r\n";
            wrapIndex = i;
        }

        formattedString += pemString.substring(wrapIndex, PEM_STRING_LENGTH);
        return formattedString;
    } else {
        return pemString;
    }
}
