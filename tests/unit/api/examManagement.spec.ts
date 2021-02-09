import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import CertificateManagement from "@/api/CertificateManagement";
import CourseManagement from "@/api/CourseManagement";
import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
import UserManagement from "@/api/UserManagement";
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { arrayBufferToBase64, createCSR, createKeyPair, deriveKeyFromPassword, wrapKey } from "@/use/crypto/certificates";
import { readFileSync } from "fs";
import { getRandomizedCourse } from "../../helper/Courses";
import resetState from "../../helper/ResetState";
import { getRandomizedUserAndAuthUser } from "../../helper/Users";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";
import Exam from "@/api/api_models/exam_management/Exam"
import executeTransaction from "@/api/contracts/ChaincodeUtility";
import {CreateExamTransaction} from "@/api/contracts/exam/transactions/CreateExamTransaction"
import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
import ConfigurationManagement from "@/api/ConfigurationManagement";
import {GeneralMatriculationTransactionWrapper} from "@/api/contracts/matriculation/transactions/GeneralMatriculationTransactionWrapper"
import OperationManagement from "@/api/OperationManagement";
import { ApproveOperationTransaction } from "@/api/contracts/operation/transactions/ApproveOperation";
import Operation from "@/api/api_models/operation_management/Operation";
import MatriculationManagement from "@/api/MatriculationManagement";
import CourseAdmission from "@/api/api_models/admission_management/CourseAdmission";
import { AdmissionTypes } from "@/api/api_models/admission_management/AdmissionTypes";
import { AddAdmissionTransaction } from "@/api/contracts/admission/transactions/AddAdmission";
import AdmissionManagement from "@/api/AdmissionManagement";
import ExamAdmission from "@/api/api_models/admission_management/ExamAdmission";
import ExamManagement from "@/api/ExamManagement";
import { DropAdmissionTransaction } from "@/api/contracts/admission/transactions/DropAdmission";
import ExamResult from "@/api/api_models/exam_result_management/ExamResult"
import {AddExamTransaction} from "@/api/contracts/exam_result/transactions/AddExamResultTransaction"
import ExamResultManagement from "@/api/ExamResultManagement";

const student = getRandomizedUserAndAuthUser(Role.STUDENT) as { governmentId: string; authUser: Account; student: Student };
const admin = getRandomizedUserAndAuthUser(Role.ADMIN) as { governmentId: string; authUser: Account; admin: Admin };
const lecturer = getRandomizedUserAndAuthUser(Role.LECTURER) as { governmentId: string; authUser: Account; lecturer: Lecturer };

const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };
const examReg = JSON.parse(readFileSync("tests/fixtures/examinationRegulation.json", "utf-8")) as ExaminationRegulation;
const course = getRandomizedCourse();

let keypair = {} as CryptoKeyPair;
const iv = window.crypto.getRandomValues(new Uint8Array(12));
let certManagement: CertificateManagement;
const protoURL = "public/hlf-proto.json";
const encryptionPassword = "My-Super-Password";
let exam: Exam;

let enrollmentIdStudent = "";
let enrollmenIdLecturer = "";
let enrollmentIdAdmin = "";

let operationMatriculation: Operation;
let examOperation: Operation;
let successfulExamAdmission: ExamAdmission;
let successfulCourseAdmission: CourseAdmission;

const admittableUntil = new Date(new Date().getTime() + 120000).toISOString() // two minutes from now
const droppableUntil = new Date(new Date().getTime() + 180000).toISOString() // three minutes from now
const date = new Date(new Date().getTime() + 240000).toISOString() // four minutes from now

jest.setTimeout(60000);

describe("Exam Management", () => {
    beforeAll(async () => {
        resetState(encryptionPassword);

        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
        keypair = await createKeyPair();
        expect(success.returnValue.login).not.toEqual("");

        const userManagement = new UserManagement();
        const success2 = await userManagement.createUser(student.governmentId, student.authUser, student.student);
        expect(success2.returnValue).toBe(true);

        const success3 = await userManagement.createUser(lecturer.governmentId, lecturer.authUser, lecturer.lecturer);
        expect(success3.returnValue).toBe(true);

        const success4 = await userManagement.createUser(admin.governmentId, admin.authUser, admin.admin);
        expect(success4.returnValue).toBe(true);

        await new Promise((r) => setTimeout(r, 25000));
    });

    test("Login as admin", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(admin.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();
    });

    test("Create exam regs", async () => {
        examReg.name += new Date().toISOString();

        const examRegManagement = new ExaminationRegulationManagement();
        const response = await examRegManagement.createExaminationRegulation(examReg);
        expect(response.returnValue).toBe(201);
    });

    test("Create course", async () => {
        course.lecturerId = lecturer.lecturer.username;
        course.moduleIds = [examReg.modules[0].id];
        const courseManagement = new CourseManagement();

        const success = await courseManagement.createCourse(course);
        expect(success.returnValue).toBe(true);
        await new Promise((r) => setTimeout(r, 5000));

        const courses = await courseManagement.getCourses(course.courseName);
        course.courseId = courses.returnValue[0].courseId;
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

    test("Login as student", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(student.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();

        const response = await certManagement.getEnrollmentId([student.authUser.username]);

        expect(response.statusCode).toEqual(200);
        enrollmentIdStudent = response.returnValue[0].enrollmentId;

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

    test("Matriculate student", async () => {
        const semester = (await new ConfigurationManagement().getCurrentSemester()).returnValue;
        const matriculation: SubjectMatriculation[] = [
            {
                fieldOfStudy: examReg.name,
                semesters: [semester],
            },
        ]

        const success = await executeTransaction(new GeneralMatriculationTransactionWrapper(student.authUser.username, matriculation), protoURL);
        expect(success).toBe(true);
        
        operationMatriculation = (await new OperationManagement().getOperations(true)).returnValue[0];
    })

    test("Login as admin", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(admin.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();
    });

    test("Approve matriculation operation", async () => {
        const response = await executeTransaction(new ApproveOperationTransaction(operationMatriculation), protoURL);
        expect(response).toBe(true);

        const matriculationHistory = await new MatriculationManagement().getMatriculationHistory(student.authUser.username);
        expect(matriculationHistory.returnValue.matriculationStatus.length).not.toEqual(0);
    })

    test("Login as lecturer", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(lecturer.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();

        const response = await certManagement.getEnrollmentId([lecturer.authUser.username]);

        expect(response.statusCode).toEqual(200);
        enrollmenIdLecturer = response.returnValue[0].enrollmentId;

        expect(enrollmenIdLecturer).not.toEqual("");
    })

    test("Create and send certificate signing request", async () => {
        keypair = await createKeyPair();
        const csr = await createCSR(keypair, enrollmenIdLecturer);
        const wrappingKeyObject = await deriveKeyFromPassword(encryptionPassword);
        const encryptedPrivateKey = await wrapKey(keypair.privateKey, wrappingKeyObject.key, iv);

        const base64EncryptedPrivateKey = arrayBufferToBase64(encryptedPrivateKey);
        const base64iv = arrayBufferToBase64(iv);

        const response = await certManagement.sendCertificateSigningRequest(lecturer.authUser.username, csr, {
            iv: base64iv,
            key: base64EncryptedPrivateKey,
            salt: wrappingKeyObject.salt,
        });

        expect(response.statusCode).toBe(201);
        expect(response.returnValue.certificate).not.toBe(undefined);
        expect(response.returnValue.certificate).not.toEqual("");
        await new Promise((r) => setTimeout(r, 3000));
    });

    test("Create exam", async () => {
        const configurationManagement = new ConfigurationManagement();

        const examType = (await configurationManagement.getConfiguration()).returnValue.examTypes[0];

        exam = {
            courseId: course.courseId,
            ects: 5,
            moduleId: examReg.modules[0].id,
            type: examType,
            examId: "",
            lecturerEnrollmentId: enrollmenIdLecturer,
            date,
            admittableUntil,
            droppableUntil,
        };

        const success = await executeTransaction(new CreateExamTransaction(exam), protoURL);
        expect(success).toBe(true);

        examOperation = (await new OperationManagement().getOperations()).returnValue[0];
    });

    test("Login as admin", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(admin.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();
    });

    test("Approve exam creation", async () => {
        const success = await executeTransaction(new ApproveOperationTransaction(examOperation), protoURL);
        expect(success).toEqual(true);
    })

    test("Get exams", async () => {
        const response = await new ExamManagement().getExams();
        expect(response.statusCode).toEqual(200);
        expect(response.returnValue.length).toBeGreaterThan(0);

        const response2 = await new ExamManagement().getExams(undefined, [course.courseId]);
        expect(response2.statusCode).toEqual(200);
        expect(response2.returnValue.length).toEqual(1);
        exam.examId = response2.returnValue[0].examId;

        const response3 = await new ExamManagement().getExams(undefined, undefined, [enrollmenIdLecturer]);

    })

    test("Login as student", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(student.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();
    });

    test("Enroll in Exam", async () => {
        const examAdmission: ExamAdmission = {
            admissionId: "",
            timestamp: "",
            type: AdmissionTypes.EXAM,
            enrollmentId: "",
            examId: exam.examId,
        };

        const success = await executeTransaction(new AddAdmissionTransaction(enrollmentIdStudent, examAdmission), protoURL);
        expect(success).toEqual(false);

        const admissions = await new AdmissionManagement().getExamAdmissions();
        expect(admissions.statusCode).toEqual(200);
        expect(admissions.returnValue.length).toEqual(0);
    });

    test("Enroll in Course", async () => {
        const courseAdmission: CourseAdmission = {
            admissionId: "",
            courseId: course.courseId,
            enrollmentId: "",
            moduleId: examReg.modules[0].id,
            timestamp: "",
            type: AdmissionTypes.COURSE,
        };

        const success = await executeTransaction(new AddAdmissionTransaction(enrollmentIdStudent, courseAdmission), protoURL);
        expect(success).toEqual(true);

        const admissions = await new AdmissionManagement().getCourseAdmissions();
        expect(admissions.statusCode).toEqual(200);
        expect(admissions.returnValue.length).toEqual(1);
        successfulCourseAdmission = admissions.returnValue[0];
    });

    test("Enroll in Exam", async () => {
        const examAdmission: ExamAdmission = {
            admissionId: "",
            timestamp: "",
            type: AdmissionTypes.EXAM,
            enrollmentId: "",
            examId: exam.examId,
        };

        const success = await executeTransaction(new AddAdmissionTransaction(enrollmentIdStudent, examAdmission), protoURL);
        expect(success).toEqual(true);

        const admissions = await new AdmissionManagement().getExamAdmissions();
        expect(admissions.statusCode).toEqual(200);
        expect(admissions.returnValue.length).toEqual(1);
        successfulExamAdmission = admissions.returnValue[0];
    });

    test("Drop Exam", async () => {
        const success = await executeTransaction(new DropAdmissionTransaction(successfulExamAdmission.admissionId), protoURL);
        expect(success).toEqual(true);

        const admissions = await new AdmissionManagement().getExamAdmissions();
        expect(admissions.statusCode).toEqual(200);
        expect(admissions.returnValue.length).toEqual(0);
    });

    test("Enroll in Exam", async () => {
        const examAdmission: ExamAdmission = {
            admissionId: "",
            timestamp: "",
            type: AdmissionTypes.EXAM,
            enrollmentId: "",
            examId: exam.examId,
        };

        const success = await executeTransaction(new AddAdmissionTransaction(enrollmentIdStudent, examAdmission),protoURL);
        expect(success).toEqual(true);

        const admissions = await new AdmissionManagement().getExamAdmissions();
        expect(admissions.statusCode).toEqual(200);
        expect(admissions.returnValue.length).toEqual(1);
        successfulExamAdmission = admissions.returnValue[0];
    });

    test("Drop course", async () => {
        const success = await executeTransaction(new DropAdmissionTransaction(successfulCourseAdmission.admissionId),protoURL);
        expect(success).toEqual(false);

        const admissions = await new AdmissionManagement().getCourseAdmissions();
        expect(admissions.statusCode).toEqual(200);
        expect(admissions.returnValue.length).toEqual(1);
    })

    test("Drop Exam", async () => {
        const success = await executeTransaction(new DropAdmissionTransaction(successfulExamAdmission.admissionId),protoURL);
        expect(success).toEqual(true);

        const admissions = await new AdmissionManagement().getExamAdmissions();
        expect(admissions.statusCode).toEqual(200);
        expect(admissions.returnValue.length).toEqual(0);
    });

    test("Drop course", async () => {
        const success = await executeTransaction(new DropAdmissionTransaction(successfulCourseAdmission.admissionId),protoURL);
        expect(success).toEqual(true);

        const admissions = await new AdmissionManagement().getCourseAdmissions();
        expect(admissions.statusCode).toEqual(200);
        expect(admissions.returnValue.length).toEqual(0);
    });

    test("Enroll in Course", async () => {
        const courseAdmission: CourseAdmission = {
            admissionId: "",
            courseId: course.courseId,
            enrollmentId: "",
            moduleId: examReg.modules[0].id,
            timestamp: "",
            type: AdmissionTypes.COURSE,
        };

        const success = await executeTransaction(new AddAdmissionTransaction(enrollmentIdStudent, courseAdmission), protoURL);
        expect(success).toEqual(true);

        const admissions = await new AdmissionManagement().getCourseAdmissions();
        expect(admissions.statusCode).toEqual(200);
        expect(admissions.returnValue.length).toEqual(1);
        successfulCourseAdmission = admissions.returnValue[0];
    });

    test("Enroll in Exam", async () => {
        const examAdmission: ExamAdmission = {
            admissionId: "",
            timestamp: "",
            type: AdmissionTypes.EXAM,
            enrollmentId: "",
            examId: exam.examId,
        };

        const success = await executeTransaction(new AddAdmissionTransaction(enrollmentIdStudent, examAdmission),protoURL );
        expect(success).toEqual(true);

        const admissions = await new AdmissionManagement().getExamAdmissions();
        expect(admissions.statusCode).toEqual(200);
        expect(admissions.returnValue.length).toEqual(1);
        successfulExamAdmission = admissions.returnValue[0];
    });

    test("Login as lecturer", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(lecturer.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();
    })

    test("Grade exam", async () => {
        const admissionManagement = new AdmissionManagement();
        const response = await admissionManagement.getExamAdmissions(undefined, [exam.examId]);
        
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length).toBe(1);

        const configurationManagement = new ConfigurationManagement();
        const grade = (await configurationManagement.getConfiguration()).returnValue.grades[0];

        const examResults: ExamResult[] = [
            {
                enrollmentId: response.returnValue[0].enrollmentId,
                examId: exam.examId,
                grade,
            }
        ]

        if (new Date() < new Date(date)) {
            const success = await executeTransaction(new AddExamTransaction(examResults), protoURL);

            expect(success).toBe(false);

            const delta = new Date(date).getTime() - new Date().getTime();
            await new Promise((r) => setTimeout(r, delta));
        }

        const success = await executeTransaction(new AddExamTransaction(examResults), protoURL);

        expect(success).toBe(true);

        const examResultManagement = new ExamResultManagement();

        const response2 = await examResultManagement.getExamResults(undefined, [exam.examId]);
        expect(response2.statusCode).toBe(200);
        expect(response2.returnValue.length).toBe(1);

        expect(response2.returnValue[0].enrollmentId).toBe(examResults[0].enrollmentId);
        expect(response2.returnValue[0].examId).toBe(examResults[0].examId);
        expect(response2.returnValue[0].grade).toBe(examResults[0].grade);
    })

    test("Login as student", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(student.authUser);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();
    });

    test("Get exam grade", async () => {
        const examResultManagement = new ExamResultManagement();
        const response2 = await examResultManagement.getExamResults(undefined, [exam.examId]);
        expect(response2.statusCode).toBe(200);
        expect(response2.returnValue.length).toBe(1);

        expect(response2.returnValue[0].enrollmentId).toBe(enrollmentIdStudent);
        expect(response2.returnValue[0].examId).toBe(exam.examId);

        const configurationManagement = new ConfigurationManagement();
        const grade = (await configurationManagement.getConfiguration()).returnValue.grades[0];

        expect(response2.returnValue[0].grade).toEqual(grade);
    })

    test("Login as admin", async () => {
        resetState(encryptionPassword);
        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
        expect(success.returnValue.login).not.toEqual("");
        certManagement = new CertificateManagement();
    });

    test("Cleanup", async () => {
        const userManagement = new UserManagement();
        const s1 = (await userManagement.forceDeleteUser(admin.authUser.username)).returnValue;
        const s2 = (await userManagement.forceDeleteUser(lecturer.authUser.username)).returnValue;
        const s3 = (await userManagement.forceDeleteUser(student.authUser.username)).returnValue;

        const s4 = (await new CourseManagement().deleteCourse(course.courseId)).returnValue;
        const s5 = (await new ExaminationRegulationManagement().deleteExaminationRegulation(examReg.name)).returnValue;

        expect(s1 && s2 && s3 && s4 && s5).toBe(true);
    });
});
