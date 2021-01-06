import Student from "@/api/api_models/user_management/Student";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import UserManagement from "@/api/UserManagement";
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { readFileSync } from "fs";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";
import { getRandomizedUserAndAuthUser } from "../../helper/Users";

var authenticationManagement: AuthenticationManagement;
var userManagement: UserManagement;
jest.setTimeout(30000);

const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };
const pair = getRandomizedUserAndAuthUser(Role.STUDENT) as { governmentId: string; student: Student; authUser: Account };
const student = pair.student;
const authUser = pair.authUser;
const student2 = getRandomizedUserAndAuthUser(Role.STUDENT) as { governmentId: string; student: Student; authUser: Account };
const governmentId = pair.governmentId;

beforeAll(async () => {
    const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
    userManagement = new UserManagement();
    authenticationManagement = new AuthenticationManagement();
    expect(success.returnValue.login).not.toEqual("");
});

test("Create user", async () => {
    const success = await userManagement.createUser(governmentId, authUser, student);
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 5000));
});

test("Login with new user", async () => {
    const auth = { username: authUser.username, password: authUser.password };
    const success = await MachineUserAuthenticationManagement._getRefreshToken(auth);
    userManagement = new UserManagement();
    expect(success.returnValue.login).not.toEqual("");
});

test("Change password", async () => {
    var auth = { username: authUser.username, password: authUser.password };
    authenticationManagement = new AuthenticationManagement();
    let success = await authenticationManagement.changeOwnPassword("testPassword");
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 10000));

    auth.password = "testPassword";

    let success2 = await MachineUserAuthenticationManagement._getRefreshToken(auth);
    expect(success2.returnValue.login).not.toEqual("");

    success = await authenticationManagement.changeOwnPassword("student");
    expect(success.returnValue).toBe(true);
});

test("Login as admin", async () => {
    const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
    authenticationManagement = new AuthenticationManagement();
    userManagement = new UserManagement();
    expect(success.returnValue.login).not.toEqual("");
});

test("Delete user", async () => {
    const success = await userManagement.forceDeleteUser(student.username);
    expect(success.returnValue).toBe(true);
});

test("Create user", async () => {
    const success = await userManagement.createUser(student2.governmentId, student2.authUser, student2.student);
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 5000));
});

test("Login with new user", async () => {
    const auth = { username: student2.authUser.username, password: student2.authUser.password };
    const success = await MachineUserAuthenticationManagement._getRefreshToken(auth);
    userManagement = new UserManagement();
    expect(success.returnValue.login).not.toEqual("");
});

test("Delete own user", async () => {
    const success = await userManagement.forceDeleteUser(student2.authUser.username);
    expect(success.returnValue).toBe(true);
});
