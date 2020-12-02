import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
import Student from "@/api/api_models/user_management/Student";
import CertificateManagement from "@/api/CertificateManagement";
import MatriculationManagement from "@/api/MatriculationManagement";
import UserManagement from "@/api/UserManagement";
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { arrayBufferToBase64, createCSR, createKeyPair, deriveKeyFromPassword, wrapKey } from "@/use/crypto/certificates";
import { readFileSync } from "fs";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";
import { getRandomizedUserAndAuthUser } from "../../helper/Users";
import { updateMatriculation } from "@/api/abstractions/FrontendSigning";

let matriculationManagement: MatriculationManagement;
let userManagement: UserManagement;
let certManagement: CertificateManagement;
const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };
const pair = getRandomizedUserAndAuthUser(Role.STUDENT) as { governmentId: string; student: Student; authUser: Account };
const student = pair.student;
const authUser = pair.authUser;
let enrollmentId = "";
let keypair: CryptoKeyPair;
const iv = window.crypto.getRandomValues(new Uint8Array(12));
const encryptionPassword = "My-Super-Password";
let matriculation: SubjectMatriculation[];
const protoURL = "public/hlf-proto.json";
const governmentId = pair.governmentId;

jest.setTimeout(30000);

describe("Matriculation management", () => {
    beforeAll(async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
        userManagement = new UserManagement();

        matriculationManagement = new MatriculationManagement();
        expect(success.returnValue.login).not.toEqual("");
    });

    test("Create student user", async () => {
        const success = await userManagement.createUser(governmentId, authUser, student);
        expect(success.returnValue).toBe(true);
        expect(success.statusCode).toEqual(201);
        await new Promise((r) => setTimeout(r, 25000));
    });

    test("Get empty matriculation history", async () => {
        const response = await matriculationManagement.getMatriculationHistory(student.username);
        expect(response.statusCode).toEqual(404);
    });

    test("Login as student", async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();
        matriculationManagement = new MatriculationManagement();
    });

    test("Fetch enrollmentId", async () => {
        const response = await certManagement.getEnrollmentId(authUser.username);

        expect(response.statusCode).toEqual(200);
        enrollmentId = response.returnValue.id;

        expect(enrollmentId).not.toEqual("");
    });

    test("Create and send certificate signing request", async () => {
        keypair = await createKeyPair();
        const csr = await createCSR(keypair, enrollmentId);
        const wrappingKeyObject = await deriveKeyFromPassword(encryptionPassword);
        const encryptedPrivateKey = await wrapKey(keypair.privateKey, wrappingKeyObject.key, iv);

        const base64EncryptedPrivateKey = arrayBufferToBase64(encryptedPrivateKey);
        const base64iv = arrayBufferToBase64(iv);

        const response = await certManagement.sendCertificateSigningRequest(authUser.username, csr, {
            iv: base64iv,
            key: base64EncryptedPrivateKey,
            salt: wrappingKeyObject.salt,
        });

        expect(response.statusCode).toBe(201);
        expect(response.returnValue.certificate).not.toBe(undefined);
        expect(response.returnValue.certificate).not.toEqual("");
    });

    test("Update matriculation", async () => {
        matriculation = [{ fieldOfStudy: FieldOfStudy.COMPUTER_SCIENCE, semesters: ["SS2020"] }];

        const result = await updateMatriculation(enrollmentId, authUser.username, matriculation, protoURL);

        expect(result).toBe(true);
    });

    test("Fetch matriculation", async () => {
        const filledResponse = await matriculationManagement.getMatriculationHistory(student.username);
        const data: MatriculationData = filledResponse.returnValue;
        expect((data as MatriculationData).matriculationStatus).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[0].fieldOfStudy).toBe(FieldOfStudy.COMPUTER_SCIENCE);
        expect((data as MatriculationData).matriculationStatus[0].semesters).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[0].semesters[0]).toBe("SS2020");
    });

    test("Delete student user", async () => {
        const success = await userManagement.forceDeleteUser(student.username);
        expect(success.returnValue).toBe(true);
    });
});
