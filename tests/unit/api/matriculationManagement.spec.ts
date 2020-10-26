import { Role } from "@/entities/Role";
import { Account } from "@/entities/Account";
import UserManagement from "@/api/UserManagement";
import MatriculationManagement from "@/api/MatriculationManagement";
import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
import { readFileSync } from "fs";
import { getRandomizedUserAndAuthUser } from "../../helper/Users";
import Student from "@/api/api_models/user_management/Student";
import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";

var matriculationManagement: MatriculationManagement;
var userManagement: UserManagement;
const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };
const studentAuth = JSON.parse(readFileSync("tests/fixtures/logins/student.json", "utf-8")) as { username: string; password: string };
const pair = getRandomizedUserAndAuthUser(Role.STUDENT) as { student: Student; authUser: Account };
const student = pair.student;
const authUser = pair.authUser;

enum FieldOfStudy {
    COMPUTER_SCIENCE = "Computer Science",
    EDUCATION = "Education",
    BUSINESS_INFORMATICS = "Business Informatics",
}

jest.useFakeTimers();

describe("Matriculation management", () => {
    beforeAll(async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
        userManagement = new UserManagement();

        matriculationManagement = new MatriculationManagement();
        expect(success.returnValue.login).not.toEqual("");
    });

    test("Create student user", async () => {
        const success = await userManagement.createUser(authUser, student);
        expect(success.returnValue).toBe(true);
    });

    test("Get empty matriculation history", async () => {
        const response = await matriculationManagement.getMatriculationHistory(student.username);
        expect(response.statusCode).toEqual(404);
    });

    test("'Create' matriculation history", async () => {
        const response = await matriculationManagement.updateMatriculationData(student.username, [
            { fieldOfStudy: FieldOfStudy.COMPUTER_SCIENCE, semesters: ["SS2020"] },
        ] as SubjectMatriculation[]);

        expect(response.statusCode).toBe(201);
        // wait for https://github.com/upb-uc4/lagom-core/issues/279 fix
        const filledResponse = await matriculationManagement.getMatriculationHistory(student.username);
        const data: boolean | MatriculationData = filledResponse.returnValue;
        expect((data as MatriculationData).matriculationStatus).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[0].fieldOfStudy).toBe(FieldOfStudy.COMPUTER_SCIENCE);
        expect((data as MatriculationData).matriculationStatus[0].semesters).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[0].semesters[0]).toBe("SS2020");
    });

    test("Update matriculation", async () => {
        const response = await matriculationManagement.updateMatriculationData(student.username, [
            { fieldOfStudy: FieldOfStudy.EDUCATION, semesters: ["SS2020"] },
        ]);
        expect(response.statusCode).toBe(200);

        expect(response.returnValue).toBe(true);
        // wait for https://github.com/upb-uc4/lagom-core/issues/279 fix
        const filledResponse = await matriculationManagement.getMatriculationHistory(student.username);
        const data: boolean | MatriculationData = filledResponse.returnValue;
        expect((data as MatriculationData).matriculationStatus).toHaveLength(2);
        expect((data as MatriculationData).matriculationStatus[0].fieldOfStudy).toBe(FieldOfStudy.COMPUTER_SCIENCE);
        expect((data as MatriculationData).matriculationStatus[0].semesters).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[0].semesters[0]).toBe("SS2020");

        expect((data as MatriculationData).matriculationStatus[1].fieldOfStudy).toBe(FieldOfStudy.EDUCATION);
        expect((data as MatriculationData).matriculationStatus[1].semesters).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[1].semesters[0]).toBe("SS2020");
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
        expect((data as MatriculationData).matriculationStatus).toHaveLength(3);
        expect((data as MatriculationData).matriculationStatus[0].fieldOfStudy).toBe(FieldOfStudy.COMPUTER_SCIENCE);
        expect((data as MatriculationData).matriculationStatus[0].semesters).toHaveLength(2);
        expect((data as MatriculationData).matriculationStatus[0].semesters[0]).toBe("SS2020");
        expect((data as MatriculationData).matriculationStatus[0].semesters[1]).toBe("SS2021");

        expect((data as MatriculationData).matriculationStatus[1].fieldOfStudy).toBe(FieldOfStudy.EDUCATION);
        expect((data as MatriculationData).matriculationStatus[1].semesters).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[1].semesters[0]).toBe("SS2020");

        expect((data as MatriculationData).matriculationStatus[2].fieldOfStudy).toBe(FieldOfStudy.BUSINESS_INFORMATICS);
        expect((data as MatriculationData).matriculationStatus[2].semesters).toHaveLength(1);
        expect((data as MatriculationData).matriculationStatus[2].semesters[0]).toBe("SS2021");
    });

    test("Delete student user", async () => {
        const success = await userManagement.deleteUser(student.username);
        expect(success.returnValue).toBe(true);
    });
});
