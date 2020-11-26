import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
import Student from "@/api/api_models/user_management/Student";
import MatriculationManagement from "@/api/MatriculationManagement";
import UserManagement from "@/api/UserManagement";
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { readFileSync } from "fs";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";
import { getRandomizedUserAndAuthUser } from "../../helper/Users";

var matriculationManagement: MatriculationManagement;
var userManagement: UserManagement;
const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };
const studentAuth = JSON.parse(readFileSync("tests/fixtures/logins/student.json", "utf-8")) as { username: string; password: string };
const pair = getRandomizedUserAndAuthUser(Role.STUDENT) as { governmentId: string; student: Student; authUser: Account };
const student = pair.student;
const authUser = pair.authUser;
const governmentId = pair.governmentId;
const EXAM_REG_1 = "Bachelor Computer Science v3";

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
        await new Promise((r) => setTimeout(r, 15000));
    });

    test("Get empty matriculation history", async () => {
        const response = await matriculationManagement.getMatriculationHistory(student.username);
        expect(response.statusCode).toEqual(404);
    });

    test("'Create' matriculation history", async () => {
        const response = await matriculationManagement.updateMatriculationData(student.username, [
            { fieldOfStudy: EXAM_REG_1, semesters: ["SS2020"] },
        ] as SubjectMatriculation[]);

        expect(response.statusCode).toBe(201);
        const filledResponse = await matriculationManagement.getMatriculationHistory(student.username);
        const data: boolean | MatriculationData = filledResponse.returnValue;
        expect((data as MatriculationData).matriculationStatus).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[0].fieldOfStudy).toBe(EXAM_REG_1);
        expect((data as MatriculationData).matriculationStatus[0].semesters).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[0].semesters[0]).toBe("SS2020");
    });

    test("Update matriculation", async () => {
        const response = await matriculationManagement.updateMatriculationData(student.username, [
            { fieldOfStudy: EXAM_REG_1, semesters: ["SS2021"] },
        ]);
        expect(response.statusCode).toBe(200);

        expect(response.returnValue).toBe(true);
        // wait for https://github.com/upb-uc4/lagom-core/issues/279 fix
        const filledResponse = await matriculationManagement.getMatriculationHistory(student.username);
        const data: boolean | MatriculationData = filledResponse.returnValue;
        expect((data as MatriculationData).matriculationStatus).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[0].fieldOfStudy).toBe(EXAM_REG_1);
        expect((data as MatriculationData).matriculationStatus[0].semesters).toHaveLength(2);
        expect((data as MatriculationData).matriculationStatus[0].semesters[0]).toBe("SS2020");
        expect((data as MatriculationData).matriculationStatus[0].semesters[1]).toBe("SS2021");
    });

    test("Update matriculation even more", async () => {
        const response = await matriculationManagement.updateMatriculationData(student.username, [
            { fieldOfStudy: EXAM_REG_1, semesters: ["SS2022"] },
            { fieldOfStudy: EXAM_REG_1, semesters: ["SS2019"] },
        ] as SubjectMatriculation[]);
        const data: boolean | MatriculationData = response.returnValue;
        expect(response.statusCode).toBe(200);
        expect(response.returnValue).toBe(true);
    });

    test("Get matriculation history", async () => {
        const response = await matriculationManagement.getMatriculationHistory(student.username);
        const data: MatriculationData = response.returnValue;
        expect(response.statusCode).toBe(200);
        expect((data as MatriculationData).matriculationStatus).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[0].fieldOfStudy).toBe(EXAM_REG_1);
        expect((data as MatriculationData).matriculationStatus[0].semesters).toHaveLength(4);
        expect((data as MatriculationData).matriculationStatus[0].semesters[0]).toBe("SS2020");
        expect((data as MatriculationData).matriculationStatus[0].semesters[1]).toBe("SS2021");
        expect((data as MatriculationData).matriculationStatus[0].semesters[0]).toBe("SS2022");
        expect((data as MatriculationData).matriculationStatus[0].semesters[1]).toBe("SS2019");
    });

    test("Delete student user", async () => {
        const success = await userManagement.forceDeleteUser(student.username);
        expect(success.returnValue).toBe(true);
    });
});
