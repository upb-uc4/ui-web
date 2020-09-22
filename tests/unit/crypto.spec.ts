import {
    createKeyPair,
    privateKeyToPemString,
    pemStringToPrivateKey,
    createCSRObject,
    deriveKeyFromPassword,
    wrapKey,
    unwrapKey,
} from "@/use/crypto/certificates";
import { stringToArrayBuffer, arrayBufferToString, toBase64, fromBase64 } from "pvutils";
import CertificationRequest from "pkijs/src/CertificationRequest";
import { PrintableString } from "asn1js";

describe("Key generation tests", () => {
    let keypair: CryptoKeyPair;

    beforeAll(async () => {
        keypair = await createKeyPair();
    });

    it("Private Key tests", () => {
        expect(keypair.privateKey.algorithm.name).toBe("RSASSA-PKCS1-v1_5");
        expect((keypair.privateKey.algorithm as any).hash.name).toBe("SHA-256");
        expect((keypair.privateKey.algorithm as any).modulusLength).toBe(4096);
        expect((keypair.privateKey.algorithm as any).publicExponent).toEqual(new Uint8Array([1, 0, 1]));
        expect(keypair.privateKey.type).toBe("private");
        expect(keypair.privateKey.extractable).toBe(true);
        expect(keypair.privateKey.usages).toEqual(["sign"]);
    });

    it("Public Key tests", () => {
        expect(keypair.publicKey.algorithm.name).toBe("RSASSA-PKCS1-v1_5");
        expect((keypair.publicKey.algorithm as any).hash.name).toBe("SHA-256");
        expect((keypair.publicKey.algorithm as any).modulusLength).toBe(4096);
        expect((keypair.publicKey.algorithm as any).publicExponent).toEqual(new Uint8Array([1, 0, 1]));
        expect(keypair.publicKey.type).toBe("public");
        expect(keypair.publicKey.extractable).toBe(true);
        expect(keypair.publicKey.usages).toEqual(["verify"]);
    });

    it("Tests that keys match", async () => {
        const crypto = window.crypto.subtle;

        const signed = await crypto.sign({ name: "RSASSA-PKCS1-v1_5" }, keypair.privateKey, new Uint16Array([5, 3, 1, 5, 6, 7, 1]));

        expect(await crypto.verify({ name: "RSASSA-PKCS1-v1_5" }, keypair.publicKey, signed, new Uint16Array([5, 3, 1, 5, 6, 7, 1]))).toBe(
            true
        );
    });

    it("Second keypair is different", async () => {
        const secondKeypair = await createKeyPair();
        const crypto = window.crypto.subtle;

        const signed = await crypto.sign({ name: "RSASSA-PKCS1-v1_5" }, secondKeypair.privateKey, new Uint16Array([5, 3, 1, 5, 6, 7, 1]));
        expect(await crypto.verify({ name: "RSASSA-PKCS1-v1_5" }, keypair.publicKey, signed, new Uint16Array([5, 3, 1, 5, 6, 7, 1]))).toBe(
            false
        );
    });

    it("PEM export import works", async () => {
        const privatePem = await privateKeyToPemString(keypair.privateKey);
        const crypto = window.crypto.subtle;
        const importedKey = await pemStringToPrivateKey(privatePem);

        expect(importedKey).toEqual(keypair.privateKey);

        const signed = await crypto.sign({ name: "RSASSA-PKCS1-v1_5" }, importedKey, new Uint16Array([5, 3, 1, 5, 6, 7, 1]));
        expect(await crypto.verify({ name: "RSASSA-PKCS1-v1_5" }, keypair.publicKey, signed, new Uint16Array([5, 3, 1, 5, 6, 7, 1]))).toBe(
            true
        );
    });

    it("Password derivation works", async () => {
        const key = await deriveKeyFromPassword("SuperPassword");
        const crypto = window.crypto.subtle;

        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const algorithm = {
            name: "AES-GCM",
            iv: iv,
        };

        const message = stringToArrayBuffer("This is a secret message!");

        console.log(message);
        const ciphertext = await crypto.encrypt(algorithm, key.key, message);

        const secondDerivation = await deriveKeyFromPassword("SuperPassword", key.salt);

        const plaintext = await crypto.decrypt(algorithm, secondDerivation.key, ciphertext);

        const reconstructed = arrayBufferToString(plaintext);
        expect(reconstructed).toEqual("This is a secret message!");
    });

    it("Wrapping and unwrapping key works", async () => {
        const info = await deriveKeyFromPassword("SuperPassword");
        const crypto = window.crypto.subtle;
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const wrapped = await wrapKey(keypair.privateKey, info.key, iv);

        const unwrapped = await unwrapKey(wrapped, info.key, iv);

        const signed = await crypto.sign({ name: "RSASSA-PKCS1-v1_5" }, unwrapped, new Uint16Array([5, 3, 1, 5, 6, 7, 1]));
        expect(await crypto.verify({ name: "RSASSA-PKCS1-v1_5" }, keypair.publicKey, signed, new Uint16Array([5, 3, 1, 5, 6, 7, 1]))).toBe(
            true
        );
    });

    it("Certificate creation works", async () => {
        const csr: CertificationRequest = await createCSRObject(keypair, "exampleId");

        const crypto = window.crypto.subtle;
        const publicKeyInfo = await crypto.exportKey("spki", keypair.publicKey);

        expect(csr.signatureAlgorithm.algorithmId).toEqual("1.2.840.113549.1.1.11");

        const algorithm = {
            hash: {
                name: "SHA-256",
            },
            modulusLength: 4096,
            name: "RSASSA-PKCS1-v1_5",
            publicExponent: new Uint8Array([1, 0, 1]),
        };
        expect(await csr.verify()).toBe(true);
    });
});
