import Student from "@/api/api_models/user_management/Student";
import CertificateManagement from "@/api/CertificateManagement";
import UserManagement from "@/api/UserManagement";
import AdmissionManagement from "@/api/AdmissionManagement";
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { readFileSync } from "fs";
import MachineUserAuthenticationManagement from "tests/helper/MachineUserAuthenticationManagement";
import { getRandomizedUserAndAuthUser } from "tests/helper/Users";
import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import { arrayBufferToBase64, createCSR, createKeyPair, deriveKeyFromPassword, wrapKey } from "@/use/crypto/certificates";
import CourseAdmission from "@/api/api_models/admission_management/CourseAdmission";
import CourseManagement from "@/api/CourseManagement";
import { getRandomizedCourse } from "tests/helper/Courses";
import { decodeProposal } from "@/api/helpers/ProtobuffDecoding";
import { validateCourseAdmissionProposal } from "@/api/helpers/ProposalValidator";
import { signProposal, verifyProposalSignature } from "@/use/crypto/signing";
import SignedProposalMessage from "@/api/api_models/common/SignedProposalMessage";

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
let unsignedProposal: UnsignedProposalMessage;
const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };
const pair = getRandomizedUserAndAuthUser(Role.STUDENT) as { student: Student; authUser: Account };
const student = pair.student;
const authUser = pair.authUser;
const course = getRandomizedCourse();
const protoURL = "public/hlf-proto.json";
let signature: string;

jest.setTimeout(30000);

describe("Admissions management", () => {
    beforeAll(async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
        userManagement = new UserManagement();

        expect(success.returnValue.login).not.toEqual("");
    });

    test("Create student user", async () => {
        const success = await userManagement.createUser(authUser, student);
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

    test("Immatriculate student", async () => {});

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

    test("Fetch Unsinged Proposal for adding admission", async () => {
        courseAdmission = { courseId, enrollmentId, moduleId, admissionId: "", timestamp: "" };

        const proposalResponse = await admissionsManagement.getUnsignedCourseAdmissionAddProposal(courseAdmission);

        expect(proposalResponse.statusCode).toEqual(200);
        console.log(proposalResponse);
        console.log(proposalResponse.returnValue);

        unsignedProposal = proposalResponse.returnValue;
    });

    test("Validate and sign Proposal", async () => {
        const proposal = await decodeProposal(unsignedProposal.unsignedProposal, protoURL);

        if (!proposal) fail();

        console.log(proposal);
        console.log(proposal.payload);
        console.log(proposal.payload.input);
        console.log(proposal.payload.input.input);
        console.log(proposal.payload.input.input.args);

        const validation = validateCourseAdmissionProposal(proposal, undefined, courseAdmission);
        expect(validation).toBe(true);

        signature = await signProposal(unsignedProposal.unsignedProposal, keypair.privateKey);

        expect(await verifyProposalSignature(unsignedProposal.unsignedProposal, signature, keypair.publicKey)).toBe(true);
    });

    test("Submit Signed Proposal", async () => {
        const signedProposalMessage: SignedProposalMessage = { signature, unsignedProposal: unsignedProposal.unsignedProposal };

        const response = await admissionsManagement.submitSignedAdmissionsProposal(signedProposalMessage);
        expect(response.statusCode).toBe(202);
        expect(response.returnValue).toBe(true);
    });

    test("Fetch course admissions", async () => {
        const response = await admissionsManagement.getCourseAdmissions(student.username);
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length).toEqual(1);

        expect(response.returnValue[0].courseId).toEqual(courseAdmission.courseId);
        expect(response.returnValue[0].enrollmentId).toEqual(courseAdmission.enrollmentId);
        expect(response.returnValue[0].moduleId).toEqual(courseAdmission.moduleId);

        courseAdmission = response.returnValue[0];
    });

    test("Fetch Unsinged Proposal for dropping admission", async () => {
        const proposalResponse = await admissionsManagement.getUnsignedCourseAdmissionDropProposal(courseAdmission.admissionId);

        expect(proposalResponse.statusCode).toEqual(200);
        console.log(proposalResponse);
        console.log(proposalResponse.returnValue);

        unsignedProposal = proposalResponse.returnValue;
    });

    test("Validate and sign Proposal", async () => {
        const proposal = await decodeProposal(unsignedProposal.unsignedProposal, protoURL);

        if (!proposal) fail();

        console.log(proposal);
        console.log(proposal.payload);
        console.log(proposal.payload.input);
        console.log(proposal.payload.input.input);
        console.log(proposal.payload.input.input.args);

        const validation = validateCourseAdmissionProposal(proposal, courseAdmission.admissionId, undefined);
        expect(validation).toBe(true);

        signature = await signProposal(unsignedProposal.unsignedProposal, keypair.privateKey);

        expect(await verifyProposalSignature(unsignedProposal.unsignedProposal, signature, keypair.publicKey)).toBe(true);
    });

    test("Submit Signed Proposal", async () => {
        const signedProposalMessage: SignedProposalMessage = { signature, unsignedProposal: unsignedProposal.unsignedProposal };

        const response = await admissionsManagement.submitSignedAdmissionsProposal(signedProposalMessage);
        expect(response.statusCode).toBe(202);
        expect(response.returnValue).toBe(true);
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

        const success = await userManagement.deleteUser(student.username);
        const success2 = await courseManagement.deleteCourse(course.courseId);

        expect(success.returnValue).toBe(true);
        expect(success2.returnValue).toBe(true);
    });
});
