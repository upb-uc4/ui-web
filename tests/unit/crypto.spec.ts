import {
    createKeyPair,
    privateKeyToPemString,
    pemStringToPrivateKey,
    createCSRObject,
    deriveKeyFromPassword,
    wrapKey,
    unwrapKey,
    arrayBufferToBase64,
    base64ToArrayBuffer,
    usedAlgorithmObject,
} from "@/use/crypto/certificates";
import { stringToArrayBuffer, arrayBufferToString, toBase64, fromBase64 } from "pvutils";
import CertificationRequest from "pkijs/src/CertificationRequest";

describe("Crypto tests", () => {
    let keypair: CryptoKeyPair;

    beforeAll(async () => {
        keypair = await createKeyPair();
    });

    it("Private Key tests", () => {
        expect(keypair.privateKey.algorithm.name).toBe("ECDSA");
        expect((keypair.privateKey.algorithm as any).hash.name).toBe("SHA-256");
        expect((keypair.privateKey.algorithm as any).namedCurve).toEqual("P-256");
        expect(keypair.privateKey.type).toBe("private");
        expect(keypair.privateKey.extractable).toBe(true);
        expect(keypair.privateKey.usages).toEqual(["sign"]);
    });

    it("Public Key tests", () => {
        expect(keypair.publicKey.algorithm.name).toBe("ECDSA");
        expect((keypair.publicKey.algorithm as any).hash.name).toBe("SHA-256");
        expect((keypair.privateKey.algorithm as any).namedCurve).toEqual("P-256");
        expect(keypair.publicKey.type).toBe("public");
        expect(keypair.publicKey.extractable).toBe(true);
        expect(keypair.publicKey.usages).toEqual(["verify"]);
    });

    it("Tests that keys match", async () => {
        const crypto = window.crypto.subtle;

        const signed = await crypto.sign(usedAlgorithmObject, keypair.privateKey, new Uint16Array([5, 3, 1, 5, 6, 7, 1]));

        expect(await crypto.verify(usedAlgorithmObject, keypair.publicKey, signed, new Uint16Array([5, 3, 1, 5, 6, 7, 1]))).toBe(true);
    });

    it("Second keypair is different", async () => {
        const secondKeypair = await createKeyPair();
        const crypto = window.crypto.subtle;

        const signed = await crypto.sign(usedAlgorithmObject, secondKeypair.privateKey, new Uint16Array([5, 3, 1, 5, 6, 7, 1]));
        expect(await crypto.verify(usedAlgorithmObject, keypair.publicKey, signed, new Uint16Array([5, 3, 1, 5, 6, 7, 1]))).toBe(false);
    });

    it("PEM export import works", async () => {
        const privatePem = await privateKeyToPemString(keypair.privateKey);
        const crypto = window.crypto.subtle;
        const importedKey = await pemStringToPrivateKey(privatePem);

        expect(importedKey).toEqual(keypair.privateKey);

        const signed = await crypto.sign(usedAlgorithmObject, importedKey, new Uint16Array([5, 3, 1, 5, 6, 7, 1]));
        expect(await crypto.verify(usedAlgorithmObject, keypair.publicKey, signed, new Uint16Array([5, 3, 1, 5, 6, 7, 1]))).toBe(true);
    });

    it("Wrapping and unwrapping key works", async () => {
        const info = await deriveKeyFromPassword("SuperPassword");
        const crypto = window.crypto.subtle;
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const wrapped = await wrapKey(keypair.privateKey, info.key, iv);
        const wrappedStringBase64 = arrayBufferToBase64(wrapped);
        const wrapped2 = base64ToArrayBuffer(wrappedStringBase64);

        expect(wrapped).toEqual(wrapped2);

        const unwrapped = await unwrapKey(wrapped2, info.key, iv);

        const signed = await crypto.sign(usedAlgorithmObject, unwrapped, new Uint16Array([5, 3, 1, 5, 6, 7, 1]));
        expect(await crypto.verify(usedAlgorithmObject, keypair.publicKey, signed, new Uint16Array([5, 3, 1, 5, 6, 7, 1]))).toBe(true);
    });

    it("Certificate creation works", async () => {
        const csr: CertificationRequest = await createCSRObject(keypair, "exampleId");

        const crypto = window.crypto.subtle;

        expect(csr.signatureAlgorithm.algorithmId).toEqual("1.2.840.10045.4.3.2");

        expect(await csr.verify()).toBe(true);
    });
});
