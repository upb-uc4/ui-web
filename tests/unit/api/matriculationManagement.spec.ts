import { Role } from "@/entities/Role";
import { Account } from "@/entities/Account";
import { CourseEntity } from "@/entities/CourseEntity";
import Course from "@/api/api_models/course_management/Course";
import { Language } from "@/entities/Language";
import { CourseType } from "@/entities/CourseType";
import UserManagement from "@/api/UserManagement";
import CourseManagement from "@/api/CourseManagement";
import { store } from "@/use/store/store";
import { MutationTypes } from "@/use/store/mutation-types";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import MatriculationManagement from "@/api/MatriculationManagement";
import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
import { readFileSync } from "fs";
import { getRandomizedUserAndAuthUser } from "../../helper/Users";
import Student from "@/api/api_models/user_management/Student";
import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";

var matriculationManagement: MatriculationManagement;
var userManagement: UserManagement;
const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };
const studentAuth = JSON.parse(readFileSync("tests/fixtures/logins/student.json", "utf-8")) as { username: string; password: string };
const pair = getRandomizedUserAndAuthUser(Role.STUDENT) as { student: Student; authUser: Account };
const student = pair.student;
const authUser = pair.authUser;

jest.useFakeTimers();

describe.skip("Matriculation management", () => {
    beforeAll(async () => {
        const success = await UserManagement.login(adminAuth);
        userManagement = new UserManagement();
        store.commit(MutationTypes.SET_LOGINDATA, adminAuth);
        store.commit(MutationTypes.SET_LOGGEDIN, true);
        store.commit(MutationTypes.SET_ROLE, "Admin");
        matriculationManagement = new MatriculationManagement();
        expect(success.returnValue).toBe(true);
    });

    test("Create student user", async () => {
        const success = await userManagement.createUser(authUser, student);
        expect(success.returnValue).toBe(true);
    });

    test("Get empty matriculation history", async () => {
        const response = await matriculationManagement.getMatriculationHistory(student.username);
        const data: MatriculationData = response.returnValue;
        expect(data.matriculationId).toBe(student.matriculationId);
        expect(data.matriculationStatus).toHaveLength(0);
    });

    test("'Create' matriculation history", async () => {
        const response = await matriculationManagement.updateMatriculationData(student.username, [
            { fieldOfStudy: FieldOfStudy.COMPUTER_SCIENCE, semesters: ["SS2020"] },
        ] as SubjectMatriculation[]);
        const data: boolean | MatriculationData = response.returnValue;

        expect(response.statusCode).toBe(201);
        expect((data as MatriculationData).matriculationStatus).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[0].fieldOfStudy).toBe(FieldOfStudy.COMPUTER_SCIENCE);
        expect((data as MatriculationData).matriculationStatus[0].semesters).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[0].semesters[0]).toBe("SS2020");
    });

    test("Update matriculation", async () => {
        const response = await matriculationManagement.updateMatriculationData(student.username, []);
        const data: boolean | MatriculationData = response.returnValue;

        expect(response.statusCode).toBe(200);
        expect(response.returnValue).toBe(true);
    });

    test("Update matriculation even more", async () => {
        const response = await matriculationManagement.updateMatriculationData(student.username, [
            { fieldOfStudy: FieldOfStudy.COMPUTER_SCIENCE, semesters: ["SS2021"] },
            { fieldOfStudy: FieldOfStudy.BUSINESS_INFORMATICS, semesters: ["SS2021"] },
        ] as SubjectMatriculation[]);
        const data: boolean | MatriculationData = response.returnValue;
        expect(response.statusCode).toBe(200);
        expect(response.returnValue).toBe(true);
    });

    test("Get matriculation history", async () => {
        const response = await matriculationManagement.getMatriculationHistory(student.username);
        const data: MatriculationData = response.returnValue;
        expect(response.statusCode).toBe(200);
        expect((data as MatriculationData).matriculationStatus).toHaveLength(2);
        expect((data as MatriculationData).matriculationStatus[0].fieldOfStudy).toBe(FieldOfStudy.COMPUTER_SCIENCE);
        expect((data as MatriculationData).matriculationStatus[0].semesters).toHaveLength(2);
        expect((data as MatriculationData).matriculationStatus[0].semesters[0]).toBe("SS2020");
        expect((data as MatriculationData).matriculationStatus[0].semesters[1]).toBe("SS2021");

        expect((data as MatriculationData).matriculationStatus[1].fieldOfStudy).toBe(FieldOfStudy.CHEMISTRY);
        expect((data as MatriculationData).matriculationStatus[1].semesters).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[1].semesters[1]).toBe("SS2022");
    });

    test("Delete student user", async () => {
        const success = await userManagement.deleteUser(student.username);
        expect(success.returnValue).toBe(true);
    });
});
