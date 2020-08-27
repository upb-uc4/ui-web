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
import { student, authUser } from "./testData";
import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";

var matriculationManagement: MatriculationManagement;
var userManagement: UserManagement;
const adminAuth = { username: "admin", password: "admin" };
const studentAuth = { username: "student", password: "student" };
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
        const response = await matriculationManagement.updateMatriculationData(student.username, FieldOfStudy.COMPUTER_SCIENCE, "SS2020");
        const data: boolean | MatriculationData = response.returnValue;

        expect(response.statusCode).toBe(201);
        expect((data as MatriculationData).matriculationStatus).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[0].fieldOfStudy).toBe(FieldOfStudy.COMPUTER_SCIENCE);
        expect((data as MatriculationData).matriculationStatus[0].semesters).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[0].semesters[0]).toBe("SS2020");
    });

    test("Update matriculation", async () => {
        const response = await matriculationManagement.updateMatriculationData(student.username, FieldOfStudy.COMPUTER_SCIENCE, "SS2021");
        const data: boolean | MatriculationData = response.returnValue;

        expect(response.statusCode).toBe(200);
        expect(response.returnValue).toBe(true);
    });

    test("Update matriculation even more", async () => {
        const response = await matriculationManagement.updateMatriculationData(student.username, FieldOfStudy.CHEMISTRY, "SS2022");
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
