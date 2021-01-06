import Student from "@/api/api_models/user_management/Student";
import CertificateManagement from "@/api/CertificateManagement";
import UserManagement from "@/api/UserManagement";
import AdmissionManagement from "@/api/AdmissionManagement";
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { readFileSync } from "fs";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";
import { getRandomizedUserAndAuthUser } from "../../helper/Users";
import {
    arrayBufferToBase64,
    base64ToArrayBuffer,
    createCSR,
    createKeyPair,
    deriveKeyFromPassword,
    unwrapKey,
    wrapKey,
} from "@/use/crypto/certificates";
import CourseAdmission from "@/api/api_models/admission_management/CourseAdmission";
import CourseManagement from "@/api/CourseManagement";
import { getRandomizedCourse } from "../../helper/Courses";
import { addCourseAdmission, dropCourseAdmission, updateMatriculation } from "@/api/abstractions/FrontendSigning";
import { useStore } from "@/use/store/store";
import EncryptedPrivateKey from "@/api/api_models/certificate_management/EncryptedPrivateKey";
import { MutationTypes } from "@/use/store/mutation-types";

let userManagement: UserManagement;
let certManagement: CertificateManagement;
let admissionsManagement: AdmissionManagement;
let enrollmentId = "";
let courseAdmission: CourseAdmission;
let keypair: CryptoKeyPair;
let courseId: string;
const moduleId: string = "M.1275.01158";
const iv = window.crypto.getRandomValues(new Uint8Array(12));
const encryptionPassword = "My-Super-Password";
const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };
const pair = getRandomizedUserAndAuthUser(Role.STUDENT) as { governmentId: string; student: Student; authUser: Account };
const student = pair.student;
const authUser = pair.authUser;
const course = getRandomizedCourse();
const protoURL = "public/hlf-proto.json";
const EXAM_REG_1 = "Bachelor Computer Science v3";

jest.setTimeout(60000);

describe("Admissions management", () => {
    beforeAll(async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
        userManagement = new UserManagement();

        useStore().commit(MutationTypes.SET_DECRYPT_PRIVATE_KEY_MODAL, async (encKey: EncryptedPrivateKey) => {
            const wrappingKey = await deriveKeyFromPassword(encryptionPassword, encKey.salt);
            return await unwrapKey(base64ToArrayBuffer(encKey.key), wrappingKey.key, base64ToArrayBuffer(encKey.iv));
        });

        expect(success.returnValue.login).not.toEqual("");
    });

    test("Create student user", async () => {
        const success = await userManagement.createUser(pair.governmentId, authUser, student);
        expect(success.returnValue).toBe(true);
        expect(success.statusCode).toEqual(201);
        await new Promise((r) => setTimeout(r, 25000));
    });

    test("Create course in module", async () => {
        const courseManagement = new CourseManagement();
        const response = await courseManagement.createCourse(course);
        expect(response.statusCode).toBe(201);
        expect(response.returnValue).toBe(true);
    });

    test("Fetch course id of course", async () => {
        await new Promise((r) => setTimeout(r, 3000));
        const courseManagement = new CourseManagement();
        const response = await courseManagement.getCourses(course.courseName);
        expect(response.statusCode).toBe(200);
        courseId = response.returnValue[0].courseId;
    });

    test("Login as student", async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();
        admissionsManagement = new AdmissionManagement();
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

    test("Immatriculate student", async () => {
        const matriculation = [{ fieldOfStudy: EXAM_REG_1, semesters: ["SS2020"] }];

        const result = await updateMatriculation(enrollmentId, authUser.username, matriculation, protoURL);

        expect(result).toBe(true);
    });

    test("Add course admission", async () => {
        const admission: CourseAdmission = {
            admissionId: "",
            courseId,
            enrollmentId: "",
            moduleId,
            timestamp: "",
        };

        const result = await addCourseAdmission(enrollmentId, admission, protoURL);

        expect(result).toBe(true);
    });

    test("Fetch course admissions", async () => {
        const response = await admissionsManagement.getCourseAdmissions(student.username);
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length).toEqual(1);

        expect(response.returnValue[0].courseId).toEqual(courseId);
        expect(response.returnValue[0].enrollmentId).toEqual(enrollmentId);
        expect(response.returnValue[0].moduleId).toEqual(moduleId);

        courseAdmission = response.returnValue[0];
    });

    test("Drop admission", async () => {
        const result = await dropCourseAdmission(courseAdmission.admissionId, protoURL);

        expect(result).toBe(true);
    });

    test("Fetch course admissions", async () => {
        const response = await admissionsManagement.getCourseAdmissions(student.username);
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length).toEqual(0);
    });

    test("Delete student user and course", async () => {
        await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);

        userManagement = new UserManagement();
        const courseManagement = new CourseManagement();

        const success = await userManagement.forceDeleteUser(student.username);
        const success2 = await courseManagement.deleteCourse(courseId);

        expect(success.returnValue).toBe(true);
        expect(success2.returnValue).toBe(true);
    });
});
