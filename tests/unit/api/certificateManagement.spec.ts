import Student from "@/api/api_models/user_management/Student";
import UserManagement from "@/api/UserManagement";
import CertificateManagement from "@/api/CertificateManagement";
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { readFileSync } from "fs";
import { getRandomizedUserAndAuthUser } from "tests/helper/Users";
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

const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as {
    username: string;
    password: string;
};
let enrollmentId = "";
const iv = window.crypto.getRandomValues(new Uint8Array(12));
const encryptionPassword = "My-Super-Password";
const student = getRandomizedUserAndAuthUser(Role.STUDENT) as { authUser: Account; student: Student };
const student2 = getRandomizedUserAndAuthUser(Role.STUDENT) as { authUser: Account; student: Student };
let keypair = {} as CryptoKeyPair;

jest.setTimeout(30000);

describe("Certificate management tests", () => {
    beforeAll(async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
        keypair = await createKeyPair();
        expect(success.returnValue.login).not.toEqual("");

        const userManagement = new UserManagement();
        const success2 = userManagement.createUser(student.authUser, student.student);
        expect(success2).toBe(true);

        const success3 = userManagement.createUser(student2.authUser, student2.student);
        expect(success3).toBe(true);
    });

    test("Login as student", async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(student.authUser);
        expect(success.returnValue.login).not.toEqual("");
    });

    test("Fetch enrollmentId", async () => {
        const certManagement = new CertificateManagement();
        const response = await certManagement.getEnrollmentId(student.authUser.username);

        expect(response.statusCode).toEqual(200);
        enrollmentId = response.returnValue.id;

        expect(enrollmentId).not.toEqual("");
    });

    test("Create and send certificate signing request", async () => {
        const certManagement = new CertificateManagement();

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

        expect(response.statusCode).toBe(200);
    });

    test("Fetch encrypted private key", async () => {
        const certManagement = new CertificateManagement();
        const response = await certManagement.getEncryptedPrivateKey(student.authUser.username);
        expect(response.statusCode).toBe(200);
        const keyObject = response.returnValue;
        const base64EncryptedPrivateKey = keyObject.key;
        const buf: ArrayBuffer = base64ToArrayBuffer(base64EncryptedPrivateKey);
        const decryptionKey = await deriveKeyFromPassword(encryptionPassword, keyObject.salt);

        const decryptedPrivateKey = await unwrapKey(buf, decryptionKey.key, base64ToArrayBuffer(keyObject.iv));

        // test that we fetched the correct key and it works
        const crypto = window.crypto.subtle;
        const signature = await crypto.sign({ name: "RSASSA-PKCS1-v1_5" }, decryptedPrivateKey, base64ToArrayBuffer("asdf"));
        const success = await crypto.verify({ name: "RSASSA-PKCS1-v1_5" }, keypair.publicKey, signature, base64ToArrayBuffer("asdf"));
        expect(success).toBe(true);
    });

    test("Fetch own certificate", async () => {
        const certManagement = new CertificateManagement();

        const response = await certManagement.getCertificate(student.authUser.username);

        expect(response.statusCode).toBe(200);
        expect(response.returnValue.cert).not.toEqual("");
    });

    test("Fetch other certificate", async () => {
        const certManagement = new CertificateManagement();

        const response = await certManagement.getCertificate(adminAuth.username);

        expect(response.statusCode).toBe(200);
        expect(response.returnValue.cert).not.toEqual("");
    });

    test("Login as student2", async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(student2.authUser);
        expect(success.returnValue.login).not.toEqual("");
    });

    test("Fetch enrollmentId", async () => {
        const certManagement = new CertificateManagement();
        const response = await certManagement.getEnrollmentId(student2.authUser.username);

        expect(response.statusCode).toEqual(200);
        enrollmentId = response.returnValue.id;

        expect(enrollmentId).not.toEqual("");
    });

    test("Create and send certificate signing request without key", async () => {
        const certManagement = new CertificateManagement();
        const keys = await createKeyPair();

        const csr = await createCSR(keys, enrollmentId);

        const response = await certManagement.sendCertificateSigningRequest(student2.authUser.username, csr);

        expect(response.statusCode).toBe(200);
    });

    test("Try to fetch key", async () => {
        const certManagement = new CertificateManagement();
        const response = await certManagement.getEncryptedPrivateKey(student.authUser.username);
        expect(response.statusCode).toBe(404);
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