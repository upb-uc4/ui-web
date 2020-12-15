import Student from "@/api/api_models/user_management/Student";
import UserManagement from "@/api/UserManagement";
import ReportManagement from "@/api/ReportManagement";
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { readFileSync } from "fs";
import MachineUserAuthenticationManagement from "tests/helper/MachineUserAuthenticationManagement";
import { getRandomizedUserAndAuthUser } from "tests/helper/Users";

jest.setTimeout(180000); // 3 minutes

describe("Report Management Tests", () => {
    const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };
    const student = getRandomizedUserAndAuthUser(Role.STUDENT) as { governmentId: string; authUser: Account; student: Student };

    beforeAll(async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
        expect(success.returnValue.login).not.toEqual("");

        const userManagement = new UserManagement();
        const success2 = await userManagement.createUser(student.governmentId, student.authUser, student.student);
        expect(success2.returnValue).toBe(true);

        await new Promise((r) => setTimeout(r, 25000));

        const loginSuccess = await MachineUserAuthenticationManagement._getRefreshToken({
            username: student.authUser.username,
            password: student.authUser.password,
        });

        expect(loginSuccess.statusCode).toBe(200);
    });

    test("Prepare data archive", async () => {
        const reportManagement = new ReportManagement();

        const response = await reportManagement.getArchive(student.authUser.username);
        expect(response.statusCode).toBe(202);
        expect(response.returnValue).not.toEqual("");
        expect(response.returnValue).not.toEqual(undefined);
    });

    test("Retrieve data archive", async () => {
        await new Promise((r) => setTimeout(r, 175000));
        const reportManagement = new ReportManagement();

        const response = await reportManagement.getArchive(student.authUser.username);
        expect(response.statusCode).toBe(200);
    });
});
