import * as asn1js from "asn1js";
import Attribute from "pkijs/src/Attribute";
import AttributeTypeAndValue from "pkijs/src/AttributeTypeAndValue";
import Certificate from "pkijs/src/Certificate";
import CertificationRequest from "pkijs/src/CertificationRequest";
import { getCrypto } from "pkijs/src/common";
import Extension from "pkijs/src/Extension";
import Extensions from "pkijs/src/Extensions";
import { arrayBufferToString, fromBase64, stringToArrayBuffer, toBase64 } from "pvutils";
import formatPEM from "./formatPem";

const signAlg = "ECDSA";
const hashAlg = "SHA-256";
const ellipticCurve = "P-256";

export const usedAlgorithmObject = {
    hash: {
        name: hashAlg,
    },
    namedCurve: ellipticCurve,
    name: signAlg,
};

export const wrappingAlgorithmObject = {
    name: "AES-GCM",
    length: 256,
};

export const passwordDerivationAlgorithmObject = {
    name: "PBKDF2",
    iterations: 100000,
    hash: "SHA-256",
};

export const signingAlgorithm = usedAlgorithmObject;

export async function createKeyPair() {
    const crypto = window.crypto.subtle;

    if (typeof crypto === "undefined") {
        return Promise.reject("No WebCrypto extension found");
    }

    const usages: KeyUsage[] = ["sign", "verify"];

    return (await crypto.generateKey(usedAlgorithmObject, true, usages)) as CryptoKeyPair;
}

export async function createCSRObject(keyPair: CryptoKeyPair, enrollmenId: string) {
    const crypto = getCrypto();
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
    const hashedPK = await crypto.digest({ name: hashAlg }, pkcs10.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex);
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

export async function privateKeyToPemString(privateKey: CryptoKey) {
    const crypto = getCrypto();
    if (crypto == null) {
        return Promise.reject("No WebCrypto extension found");
    }
    const key = await crypto.exportKey("pkcs8", privateKey);

    let result: string = "-----BEGIN PRIVATE KEY-----\r\n";
    result = `${result}${formatPEM(toBase64(arrayBufferToString(key)))}`;
    result = `${result}\r\n-----END PRIVATE KEY-----\r\n`;

    return result;
}

export async function pemStringToPrivateKey(pem: string): Promise<CryptoKey> {
    const crypto = getCrypto();
    if (crypto == null) {
        return Promise.reject("No WebCrypto extension found");
    }

    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length - 1);
    const pemContentsNoBreaks = pemContents.replace(/(\r\n|\n|\r|\t)/gm, "").trim();
    // base64 decode the string to get the binary data
    const binaryDerString = fromBase64(pemContentsNoBreaks);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = stringToArrayBuffer(binaryDerString);

    const importedKey = await crypto.importKey("pkcs8", binaryDer, usedAlgorithmObject, true, ["sign"]);

    return importedKey;
}

export async function pemStringToPublicKey(pem: string): Promise<CryptoKey> {
    const crypto = getCrypto();
    if (crypto == null) {
        return Promise.reject("No WebCrypto extension found");
    }

    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length - 1);
    const pemContentsNoBreaks = pemContents.replace(/(\r\n|\n|\r|\t)/gm, "").trim();
    // base64 decode the string to get the binary data
    const binaryDerString = fromBase64(pemContentsNoBreaks);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = stringToArrayBuffer(binaryDerString);

    const importedKey = await crypto.importKey("spki", binaryDer, usedAlgorithmObject, true, ["verify"]);

    return importedKey;
}

export async function wrapKey(key: CryptoKey, wrappingKey: CryptoKey, iv: ArrayBuffer): Promise<ArrayBuffer> {
    // Firefox 1.0+
    const userAgentString = navigator.userAgent;
    const firefoxAgent = userAgentString.indexOf("Firefox") > -1;

    if (firefoxAgent) {
        // firefox implementation of subtle crypto wrapKey is broken, imitate behaivour using encryption
        return _wrapKeyFirefox(key, wrappingKey, iv);
    }

    const crypto = getCrypto();
    if (crypto == null) {
        return Promise.reject("No WebCrypto extension found");
    }
    const algorithm = {
        ...wrappingAlgorithmObject,
        iv: iv,
    };

    const result = await crypto.wrapKey("pkcs8", key, wrappingKey, algorithm);

    return result;
}

async function _wrapKeyFirefox(key: CryptoKey, wrappingKey: CryptoKey, iv: ArrayBuffer): Promise<ArrayBuffer> {
    const crypto = getCrypto();
    if (crypto == null) {
        return Promise.reject("No WebCrypto extension found");
    }
    const algorithm = {
        ...wrappingAlgorithmObject,
        iv: iv,
    };

    const exportedKey = await crypto.exportKey("pkcs8", key);
    const encryptedKey = await window.crypto.subtle.encrypt(algorithm, wrappingKey, exportedKey);

    return encryptedKey;
}

export async function unwrapKey(key: ArrayBuffer, wrappingKey: CryptoKey, iv: ArrayBuffer): Promise<CryptoKey> {
    // Firefox 1.0+
    const userAgentString = navigator.userAgent;
    const firefoxAgent = userAgentString.indexOf("Firefox") > -1;

    if (firefoxAgent) {
        // firefox implementation of subtle crypto wrapKey is broken, imitate behaivour using encryption
        return _unwrapKeyFirefox(key, wrappingKey, iv);
    }
    const crypto = getCrypto();
    if (crypto == null) {
        return Promise.reject("No WebCrypto extension found");
    }
    const unwrapAlgorithm = {
        ...wrappingAlgorithmObject,
        iv: iv,
    };

    const result = await crypto.unwrapKey("pkcs8", key, wrappingKey, unwrapAlgorithm, usedAlgorithmObject, true, ["sign"]);

    return result;
}

async function _unwrapKeyFirefox(key: ArrayBuffer, wrappingKey: CryptoKey, iv: ArrayBuffer): Promise<CryptoKey> {
    const crypto = getCrypto();
    if (crypto == null) {
        return Promise.reject("No WebCrypto extension found");
    }
    const unwrapAlgorithm = {
        ...wrappingAlgorithmObject,
        iv: iv,
    };

    const decryptedKey = await crypto.decrypt(unwrapAlgorithm, wrappingKey, key);
    const importedKey = await crypto.importKey("pkcs8", decryptedKey, usedAlgorithmObject, true, ["sign"]);

    return importedKey;
}

export async function deriveKeyFromPassword(password: string, salt?: string): Promise<{ key: CryptoKey; salt: string }> {
    const crypto = getCrypto();
    if (crypto == null) {
        return Promise.reject("No WebCrypto extension found");
    }

    if (salt == undefined) {
        const rand = window.crypto.getRandomValues(new Uint8Array(32)); // 256 bit salt
        salt = arrayBufferToBase64(rand);
    }

    // password used to derive key from key material
    const deriveAlgorithm = {
        ...passwordDerivationAlgorithmObject,
        salt: base64ToArrayBuffer(salt),
    };

    const usages: KeyUsage[] = ["wrapKey", "unwrapKey", "encrypt", "decrypt"];

    const keyMaterial = <CryptoKey>await crypto.importKey("raw", stringToArrayBuffer(password), "PBKDF2", false, ["deriveKey"]);

    return {
        key: <CryptoKey>(<unknown>await crypto.deriveKey(deriveAlgorithm, keyMaterial, wrappingAlgorithmObject, false, usages)),
        salt: salt,
    };
}

export function arrayBufferToBase64(buf: ArrayBuffer): string {
    return btoa(arrayBufferToString(buf));
}

export function base64ToArrayBuffer(str: string): ArrayBuffer {
    return stringToArrayBuffer(atob(str));
}

export async function getPublicKeyFromCertificate(certificate: string): Promise<CryptoKey> {
    console.log(certificate);
    const beginString = "-----BEGIN CERTIFICATE-----";
    const endString = "-----END CERTIFICATE-----";

    let cert: string = certificate;
    cert = cert.replace(beginString, "");
    cert = cert.replace(endString, "");
    cert = cert.replace(/(\r\n|\n|\r|\t)/gm, "").trim();

    const asn1 = asn1js.fromBER(stringToArrayBuffer(fromBase64(cert)));

    const pkijsCertificate = new Certificate({ schema: asn1.result });
    return await pkijsCertificate.getPublicKey();
}
