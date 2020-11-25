import Student from "@/api/api_models/user_management/Student";
import UserManagement from "@/api/UserManagement";
import CertificateManagement from "@/api/CertificateManagement";
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { readFileSync } from "fs";
import { getRandomizedUserAndAuthUser } from "../../helper/Users";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";
import {
    createKeyPair,
    deriveKeyFromPassword,
    wrapKey,
    unwrapKey,
    createCSR,
    arrayBufferToBase64,
    base64ToArrayBuffer,
} from "@/use/crypto/certificates";
import { usedAlgorithmObject } from "@/use/crypto/certificates";

const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as {
    username: string;
    password: string;
};
let enrollmentId = "";
const iv = window.crypto.getRandomValues(new Uint8Array(12));
const encryptionPassword = "My-Super-Password";
const student = getRandomizedUserAndAuthUser(Role.STUDENT) as { governmentId: string; authUser: Account; student: Student };
const governmentId = student.governmentId;
const student2 = getRandomizedUserAndAuthUser(Role.STUDENT) as { governmentId: string; authUser: Account; student: Student };
const governmentId2 = student2.governmentId;
let keypair = {} as CryptoKeyPair;
let certManagement: CertificateManagement;

jest.setTimeout(30000);

describe("Certificate management tests", () => {
    beforeAll(async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
        keypair = await createKeyPair();
        expect(success.returnValue.login).not.toEqual("");

        const userManagement = new UserManagement();
        const success2 = await userManagement.createUser(governmentId, student.authUser, student.student);
        expect(success2.returnValue).toBe(true);

        const success3 = await userManagement.createUser(governmentId2, student2.authUser, student2.student);
        expect(success3.returnValue).toBe(true);

        await new Promise((r) => setTimeout(r, 25000));
    });

    test("Login as student", async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(student.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();
    });

    test("Fetch enrollmentId", async () => {
        const response = await certManagement.getEnrollmentId(student.authUser.username);

        expect(response.statusCode).toEqual(200);
        enrollmentId = response.returnValue.id;

        expect(enrollmentId).not.toEqual("");
    });

    test("Create and send certificate signing request", async () => {
        const csr = await createCSR(keypair, enrollmentId);
        const wrappingKeyObject = await deriveKeyFromPassword(encryptionPassword);
        const encryptedPrivateKey = await wrapKey(keypair.privateKey, wrappingKeyObject.key, iv);

        const base64EncryptedPrivateKey = arrayBufferToBase64(encryptedPrivateKey);
        const base64iv = arrayBufferToBase64(iv);

        const response = await certManagement.sendCertificateSigningRequest(student.authUser.username, csr, {
            iv: base64iv,
            key: base64EncryptedPrivateKey,
            salt: wrappingKeyObject.salt,
        });

        expect(response.statusCode).toBe(201);
        expect(response.returnValue.certificate).not.toBe(undefined);
        expect(response.returnValue.certificate).not.toEqual("");
    });

    test("Fetch encrypted private key", async () => {
        const response = await certManagement.getEncryptedPrivateKey(student.authUser.username);
        expect(response.statusCode).toBe(200);
        const keyObject = response.returnValue;
        const base64EncryptedPrivateKey = keyObject.key;
        const buf: ArrayBuffer = base64ToArrayBuffer(base64EncryptedPrivateKey);
        const decryptionKey = await deriveKeyFromPassword(encryptionPassword, keyObject.salt);

        const decryptedPrivateKey = await unwrapKey(buf, decryptionKey.key, base64ToArrayBuffer(keyObject.iv));

        // test that we fetched the correct key and it works
        const crypto = window.crypto.subtle;
        const signature = await crypto.sign(usedAlgorithmObject, decryptedPrivateKey, base64ToArrayBuffer("asdf"));
        const success = await crypto.verify(usedAlgorithmObject, keypair.publicKey, signature, base64ToArrayBuffer("asdf"));
        expect(success).toBe(true);
    });

    test("Fetch own certificate", async () => {
        const response = await certManagement.getCertificate(student.authUser.username);

        expect(response.statusCode).toBe(200);
        expect(response.returnValue.certificate).not.toEqual("");
    });

    test("Login as student2", async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(student2.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();
    });

    test("Fetch other certificate", async () => {
        const response = await certManagement.getCertificate(student.authUser.username);

        expect(response.statusCode).toBe(200);
        expect(response.returnValue.certificate).not.toEqual("");
    });

    test("Fetch enrollmentId", async () => {
        const response = await certManagement.getEnrollmentId(student2.authUser.username);

        expect(response.statusCode).toEqual(200);
        enrollmentId = response.returnValue.id;

        expect(enrollmentId).not.toEqual("");
    });

    test("Create and send certificate signing request without key", async () => {
        const keys = await createKeyPair();

        const csr = await createCSR(keys, enrollmentId);

        const response = await certManagement.sendCertificateSigningRequest(student2.authUser.username, csr);

        expect(response.statusCode).toBe(201);
    });

    test("Try to fetch key", async () => {
        const response = await certManagement.getEncryptedPrivateKey(student2.authUser.username);
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.iv).toEqual("");
        expect(response.returnValue.salt).toEqual("");
        expect(response.returnValue.key).toEqual("");
    });

    afterAll(async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
        const userManagement = new UserManagement();
        const success2 = await userManagement.deleteUser(student.authUser.username);
        const success3 = await userManagement.deleteUser(student2.authUser.username);

        expect(success.statusCode).toBe(true);
        expect(success2.statusCode).toBe(true);
        expect(success3.statusCode).toBe(true);
    });
});
