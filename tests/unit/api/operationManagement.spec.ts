import { approveMatriculation, rejectOperation, updateMatriculation } from "@/api/abstractions/FrontendSigning";
import EncryptedPrivateKey from "@/api/api_models/certificate_management/EncryptedPrivateKey";
import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
import { OperationStatus } from "@/api/api_models/operation_management/OperationState";
import Admin from "@/api/api_models/user_management/Admin";
import Student from "@/api/api_models/user_management/Student";
import CertificateManagement from "@/api/CertificateManagement";
import { UC4Identifier } from "@/api/helpers/UC4Identifier";
import OperationManagement from "@/api/OperationManagement";
import UserManagement from "@/api/UserManagement";
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import {
    arrayBufferToBase64,
    base64ToArrayBuffer,
    createCSR,
    createKeyPair,
    deriveKeyFromPassword,
    unwrapKey,
    wrapKey,
} from "@/use/crypto/certificates";
import { MutationTypes } from "@/use/store/mutation-types";
import { useStore } from "@/use/store/store";
import { readFileSync } from "fs";
import { isEqual } from "lodash";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";
import { getRandomizedUserAndAuthUser } from "../../helper/Users";
import resetState from "../../helper/ResetState";
import MatriculationManagement from "@/api/MatriculationManagement";

jest.setTimeout(60000);

const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as {
    username: string;
    password: string;
};
let enrollmentIdStudent = "";
let enrollmentIdStudent2 = "";
let enrollmentIdAdmin = "";
const iv = window.crypto.getRandomValues(new Uint8Array(12));
const encryptionPassword = "My-Super-Password";
const student = getRandomizedUserAndAuthUser(Role.STUDENT) as { governmentId: string; authUser: Account; student: Student };
const student2 = getRandomizedUserAndAuthUser(Role.STUDENT) as { governmentId: string; authUser: Account; student: Student };
const admin = getRandomizedUserAndAuthUser(Role.ADMIN) as { governmentId: string; authUser: Account; admin: Admin };
const governmentId = student.governmentId;
let keypair = {} as CryptoKeyPair;
let certManagement: CertificateManagement;
const protoURL = "public/hlf-proto.json";
const EXAM_REG_1 = "Bachelor Computer Science v3";
let matriculationToApprove: SubjectMatriculation[];
let matriculationToReject: SubjectMatriculation[];
let matriculationToApproveWithDifferentStudent: SubjectMatriculation[];
let operationIdToApprove: string;
let operationIdToReject: string;
let operationIdToApproveWithDifferentStudent: string;
const rejectionReason = "Some reason";

describe("Operation Management tests", () => {
    beforeAll(async () => {
        resetState(encryptionPassword);

        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
        keypair = await createKeyPair();
        expect(success.returnValue.login).not.toEqual("");

        const userManagement = new UserManagement();
        const success2 = await userManagement.createUser(governmentId, student.authUser, student.student);
        expect(success2.returnValue).toBe(true);

        const success3 = await userManagement.createUser(student2.governmentId, student2.authUser, student2.student);
        expect(success3.returnValue).toBe(true);

        const success4 = await userManagement.createUser(admin.governmentId, admin.authUser, admin.admin);
        expect(success4.returnValue).toBe(true);

        await new Promise((r) => setTimeout(r, 25000));
    });

    test("Login as student", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(student.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();
    });

    test("Fetch enrollmentId", async () => {
        const response = await certManagement.getEnrollmentId(student.authUser.username);

        expect(response.statusCode).toEqual(200);
        enrollmentIdStudent = response.returnValue.id;

        expect(enrollmentIdStudent).not.toEqual("");
    });

    test("Create and send certificate signing request", async () => {
        keypair = await createKeyPair();
        const csr = await createCSR(keypair, enrollmentIdStudent);
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
        await new Promise((r) => setTimeout(r, 3000));
    });

    test("Update matriculation", async () => {
        matriculationToApprove = [{ fieldOfStudy: EXAM_REG_1, semesters: ["SS2020"] }];

        const result = await updateMatriculation(student.authUser.username, enrollmentIdStudent, matriculationToApprove, protoURL);

        expect(result).toBe(true);

        await new Promise((r) => setTimeout(r, 500));
    });

    test("Fetch self initiated operations", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperations(true);
        expect(response.statusCode).toEqual(200);
        expect(response.returnValue.length).toEqual(1);

        const operation = response.returnValue[0];
        expect(operation.state).toEqual(OperationStatus.PENDING);
        expect(operation.reason).toEqual("");
        expect(operation.transactionInfo.contractName).toEqual(UC4Identifier.CONTRACT_MATRICULATION);
        expect(operation.transactionInfo.transactionName).toEqual(UC4Identifier.TRANSACTION_ADD_MATRICULATION);
        expect(operation.transactionInfo.parameters).not.toEqual("");

        const paramsArray: string[] = JSON.parse(operation.transactionInfo.parameters);

        const proposalMatriculationData: MatriculationData = JSON.parse(paramsArray[0]);

        expect(proposalMatriculationData.enrollmentId).toEqual(enrollmentIdStudent);
        expect(isEqual(proposalMatriculationData.matriculationStatus, matriculationToApprove));

        expect(operation.existingApprovals.users.length).toEqual(2);
        expect(operation.existingApprovals.users[0]).toEqual("scala-admin-org1");
        expect(operation.existingApprovals.users[1]).toEqual(enrollmentIdStudent);

        expect(operation.existingApprovals.groups.length).toEqual(2);
        expect(operation.existingApprovals.groups[0]).toEqual("System");
        expect(operation.existingApprovals.groups[1]).toEqual("Student");

        expect(operation.operationId).not.toEqual("");

        operationIdToApprove = operation.operationId;

        expect(operation.initiator).toEqual(enrollmentIdStudent);
        expect(operation.initiatedTimestamp).not.toEqual("");
        expect(operation.lastModifiedTimestamp).not.toEqual("");
    });

    test("Fetch selfActionRequired", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperations(undefined, true);

        expect(response.statusCode).toEqual(200);
        expect(response.returnValue.length).toEqual(0);
    });

    test("Fetch by states", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperations(undefined, undefined, [OperationStatus.PENDING]);
        expect(response.statusCode).toEqual(200);
        expect(response.returnValue.length).toEqual(1);
        expect(response.returnValue[0].operationId).toEqual(operationIdToApprove);

        const response2 = await operationManagement.getOperations(undefined, undefined, [OperationStatus.FINISHED]);
        expect(response2.statusCode).toEqual(200);
        expect(response2.returnValue.length).toEqual(0);

        const response3 = await operationManagement.getOperations(undefined, undefined, [OperationStatus.REJECTED]);
        expect(response3.statusCode).toEqual(200);
        expect(response3.returnValue.length).toEqual(0);

        const response4 = await operationManagement.getOperations(undefined, undefined, [
            OperationStatus.PENDING,
            OperationStatus.FINISHED,
        ]);
        expect(response4.statusCode).toEqual(200);
        expect(response4.returnValue.length).toEqual(1);
        expect(response4.returnValue[0].operationId).toEqual(operationIdToApprove);

        const response5 = await operationManagement.getOperations(undefined, undefined, [
            OperationStatus.PENDING,
            OperationStatus.FINISHED,
            OperationStatus.REJECTED,
        ]);
        expect(response5.statusCode).toEqual(200);
        expect(response5.returnValue.length).toEqual(1);
        expect(response5.returnValue[0].operationId).toEqual(operationIdToApprove);

        const response6 = await operationManagement.getOperations(undefined, undefined, [
            OperationStatus.FINISHED,
            OperationStatus.REJECTED,
        ]);
        expect(response6.statusCode).toEqual(200);
        expect(response6.returnValue.length).toEqual(0);
    });

    test("Fetch with multiple parameters", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperations(true, false, [OperationStatus.PENDING]);
        expect(response.statusCode).toEqual(200);
        expect(response.returnValue.length).toEqual(1);
        expect(response.returnValue[0].operationId).toEqual(operationIdToApprove);

        const response2 = await operationManagement.getOperations(false, false, [OperationStatus.PENDING]);
        expect(response2.statusCode).toEqual(200);
        expect(response2.returnValue.length).toEqual(1);
        expect(response2.returnValue[0].operationId).toEqual(operationIdToApprove);

        const response3 = await operationManagement.getOperations(true, false, [OperationStatus.FINISHED]);
        expect(response3.statusCode).toEqual(200);
        expect(response3.returnValue.length).toEqual(0);
    });

    test("Login as admin", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(admin.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();

        enrollmentIdAdmin = (await certManagement.getEnrollmentId(admin.authUser.username)).returnValue.id;
    });

    test("Create and send certificate signing request", async () => {
        keypair = await createKeyPair();
        const csr = await createCSR(keypair, enrollmentIdAdmin);
        const wrappingKeyObject = await deriveKeyFromPassword(encryptionPassword);
        const encryptedPrivateKey = await wrapKey(keypair.privateKey, wrappingKeyObject.key, iv);

        const base64EncryptedPrivateKey = arrayBufferToBase64(encryptedPrivateKey);
        const base64iv = arrayBufferToBase64(iv);

        const response = await certManagement.sendCertificateSigningRequest(admin.authUser.username, csr, {
            iv: base64iv,
            key: base64EncryptedPrivateKey,
            salt: wrappingKeyObject.salt,
        });

        expect(response.statusCode).toBe(201);
        expect(response.returnValue.certificate).not.toBe(undefined);
        expect(response.returnValue.certificate).not.toEqual("");
        await new Promise((r) => setTimeout(r, 3000));
    });

    test("Fetch open operations as admin", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperations(false, true);
        expect(response.returnValue.length).toBeGreaterThanOrEqual(1);
        const operationToApprove = response.returnValue.find((e) => e.operationId == operationIdToApprove);

        expect(operationToApprove !== undefined);
    });

    test("Approve operation as admin", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperations(false, true);
        expect(response.returnValue.length).toBeGreaterThanOrEqual(1);
        const operationToApprove = response.returnValue.find((e) => e.operationId == operationIdToApprove);

        if (!operationToApprove) fail();

        const success = await approveMatriculation(operationToApprove, protoURL);

        expect(success).toBe(true);
    });

    test("Login as student", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(student.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();
    });

    test("Update matriculation for rejection", async () => {
        matriculationToReject = [{ fieldOfStudy: EXAM_REG_1, semesters: ["SS2021"] }];

        const result = await updateMatriculation(student.authUser.username, enrollmentIdStudent, matriculationToReject, protoURL);

        expect(result).toBe(true);

        const operationManagement = new OperationManagement();
        const response = await operationManagement.getOperations(true, false, [OperationStatus.PENDING]);

        expect(response.statusCode).toEqual(200);
        expect(response.returnValue.length).toEqual(1);

        expect(response.returnValue.filter((e) => e.operationId != operationIdToApprove).length).toEqual(1);
        operationIdToReject = response.returnValue.filter((e) => e.operationId != operationIdToApprove)[0].operationId;
    });

    test("Update matriculation for approvalByDifferentStudent", async () => {
        matriculationToApproveWithDifferentStudent = [{ fieldOfStudy: EXAM_REG_1, semesters: ["SS2019"] }];

        const result = await updateMatriculation(
            student.authUser.username,
            enrollmentIdStudent,
            matriculationToApproveWithDifferentStudent,
            protoURL
        );

        expect(result).toBe(true);

        const operationManagement = new OperationManagement();
        const response = await operationManagement.getOperations(true, false, [OperationStatus.PENDING]);

        expect(response.statusCode).toEqual(200);
        expect(response.returnValue.length).toEqual(2);

        expect(
            response.returnValue.filter((e) => e.operationId != operationIdToApprove && e.operationId != operationIdToReject).length
        ).toEqual(1);
        operationIdToApproveWithDifferentStudent = response.returnValue.filter(
            (e) => e.operationId != operationIdToApprove && e.operationId != operationIdToReject
        )[0].operationId;
    });

    test("Login as admin", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(admin.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();

        enrollmentIdAdmin = (await certManagement.getEnrollmentId(admin.authUser.username)).returnValue.id;
    });

    test("Reject operation as admin", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperations(false, true);
        expect(response.returnValue.length).toBeGreaterThanOrEqual(2);
        const operationToReject = response.returnValue.find((e) => e.operationId == operationIdToReject);

        if (!operationToReject) fail();

        const success = await rejectOperation(operationToReject, rejectionReason);

        expect(success).toBe(true);
    });

    test("Login as student", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(student.authUser);
        expect(success.returnValue.login).not.toEqual("");
    });

    test("Fetch operations", async () => {
        const operationManagement = new OperationManagement();
        const operations = await operationManagement.getOperations(true);

        expect(operations.statusCode).toEqual(200);
        expect(operations.returnValue.length).toEqual(3);

        const approvedOperation = operations.returnValue.find((e) => e.state == OperationStatus.FINISHED);
        expect(approvedOperation).not.toBe(undefined);
        expect((await operationManagement.getOperations(true, undefined, [OperationStatus.FINISHED])).returnValue.length).toEqual(1);

        const rejectedOperation = operations.returnValue.find((e) => e.state == OperationStatus.REJECTED);
        expect(rejectedOperation).not.toBe(undefined);
        expect((await operationManagement.getOperations(true, undefined, [OperationStatus.REJECTED])).returnValue.length).toEqual(1);

        const pendingOperation = operations.returnValue.find((e) => e.state == OperationStatus.PENDING);
        expect(pendingOperation).not.toBe(undefined);
        expect((await operationManagement.getOperations(true, undefined, [OperationStatus.PENDING])).returnValue.length).toEqual(1);
    });

    test("See operation is watched", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperations(true, false, undefined, true);
        expect(response.statusCode).toEqual(200);
        console.log(response.returnValue);

        expect(response.returnValue.find((e) => e.operationId == operationIdToApprove)).not.toBe(undefined);
    });

    test("Unwatch finished operation", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.unwatchOperation(operationIdToApprove);
        expect(response.statusCode).toEqual(200);
        expect(response.returnValue).toBe(true);
    });

    test("See operation is unwatched", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperations(true, false, undefined, true);
        expect(response.statusCode).toEqual(200);

        expect(response.returnValue.find((e) => e.operationId == operationIdToApprove)).toBe(undefined);
    });

    test("Fetch operation without watchlist again", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperations(true, false, undefined, false);
        expect(response.statusCode).toEqual(200);
        expect(response.returnValue.length).not.toEqual(0);

        expect(response.returnValue.find((e) => e.operationId == operationIdToApprove)).not.toBe(undefined);
    });

    test("Fetch rejected operation", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperation(operationIdToReject);
        expect(response.statusCode).toEqual(200);
        const operation = response.returnValue;
        expect(operation.operationId).toEqual(operationIdToReject);
        expect(operation.reason).toEqual(rejectionReason);
        expect(operation.state).toEqual(OperationStatus.REJECTED);
    });

    test("Login as other student", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(student2.authUser);
        expect(success.returnValue.login).not.toEqual("");

        certManagement = new CertificateManagement();

        enrollmentIdStudent2 = (await certManagement.getEnrollmentId(student2.authUser.username)).returnValue.id;
    });

    test("Create and send certificate signing request", async () => {
        keypair = await createKeyPair();
        const csr = await createCSR(keypair, enrollmentIdStudent2);
        const wrappingKeyObject = await deriveKeyFromPassword(encryptionPassword);
        const encryptedPrivateKey = await wrapKey(keypair.privateKey, wrappingKeyObject.key, iv);

        const base64EncryptedPrivateKey = arrayBufferToBase64(encryptedPrivateKey);
        const base64iv = arrayBufferToBase64(iv);

        const response = await certManagement.sendCertificateSigningRequest(student2.authUser.username, csr, {
            iv: base64iv,
            key: base64EncryptedPrivateKey,
            salt: wrappingKeyObject.salt,
        });

        expect(response.statusCode).toBe(201);
        expect(response.returnValue.certificate).not.toBe(undefined);
        expect(response.returnValue.certificate).not.toEqual("");
        await new Promise((r) => setTimeout(r, 3000));
    });

    test("Fetch operations of other student", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperations();

        expect(response.statusCode).toEqual(200);
        expect(response.returnValue.length).toEqual(0);
    });

    test("Fetch operation of different student", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperation(operationIdToApproveWithDifferentStudent);
        expect(response.statusCode).not.toEqual(200);
        expect(response.statusCode).toEqual(403);

        expect(response.returnValue.operationId).toBe(undefined);
    });

    test.skip("Reject operation as other student", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getUnsignedRejectionProposal(operationIdToApproveWithDifferentStudent, rejectionReason);

        expect(response.statusCode).not.toEqual(200);
        expect(response.statusCode).toEqual(403);
    });

    // owner mismatch for now
    test.skip("Approve operation as other student", async () => {
        const success = await updateMatriculation(
            student.authUser.username,
            enrollmentIdStudent,
            matriculationToApproveWithDifferentStudent,
            protoURL
        );

        expect(success).toBe(true);
    });

    test("Login as student", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(student.authUser);
        expect(success.returnValue.login).not.toEqual("");
    });

    test("Fetch pending operation", async () => {
        const operationManagement = new OperationManagement();

        const response = await operationManagement.getOperation(operationIdToApproveWithDifferentStudent);

        expect(response.statusCode).toEqual(200);
        expect(response.returnValue.state).toEqual(OperationStatus.PENDING);
        expect(response.returnValue.existingApprovals.users.length).toEqual(2); //3 if owner mismatch in 469 is resolved
        expect(response.returnValue.reason).toEqual("");
    });

    test("Validate matriculation", async () => {
        const matriculationManagement = new MatriculationManagement();
        const response = await matriculationManagement.getMatriculationHistory(student.authUser.username);
        expect(response.statusCode).toEqual(200);
        expect(response.returnValue.matriculationStatus.length).toEqual(1);

        expect(response.returnValue.matriculationStatus[0].fieldOfStudy).toEqual(matriculationToApprove[0].fieldOfStudy);
        expect(response.returnValue.matriculationStatus[0].semesters.length).toEqual(1);
        expect(response.returnValue.matriculationStatus[0].semesters[0]).toEqual(matriculationToApprove[0].semesters[0]);
    });

    afterAll(async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
        expect(success).toEqual(true);

        const userManagement = new UserManagement();
        const response = await userManagement.forceDeleteUser(admin.authUser.username);
        expect(response.statusCode).toEqual(200);

        const response2 = await userManagement.forceDeleteUser(student.authUser.username);
        expect(response2.statusCode).toEqual(200);

        const response3 = await userManagement.forceDeleteUser(student2.authUser.username);
        expect(response3.statusCode).toEqual(200);
    });
});
