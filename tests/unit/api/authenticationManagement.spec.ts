import UserManagement from "@/api/UserManagement";
import { store } from "@/use/store/store";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import { MutationTypes } from "@/use/store/mutation-types";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { getRandomizedUserAndAuthUser } from "../../helper/Users";
import { readFileSync } from "fs";

var authenticationManagement: AuthenticationManagement;
var userManagement: UserManagement;
jest.setTimeout(30000);

const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };
const pair = getRandomizedUserAndAuthUser(Role.STUDENT) as { student: Student; authUser: Account };
const student = pair.student;
const authUser = pair.authUser;

beforeAll(async () => {
    const success = await UserManagement.login(adminAuth);
    store.commit(MutationTypes.SET_LOGINDATA, adminAuth);
    store.commit(MutationTypes.SET_LOGGEDIN, true);
    store.commit(MutationTypes.SET_ROLE, "Admin");
    authenticationManagement = new AuthenticationManagement();
    userManagement = new UserManagement();
    expect(success.returnValue).toBe(true);
});

test("Create user", async () => {
    const success = await userManagement.createUser(authUser, student);
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 5000));
});

test("Login with new user", async () => {
    const auth = { username: authUser.username, password: authUser.password };
    const success = await UserManagement.login(auth);
    store.commit(MutationTypes.SET_LOGINDATA, auth);
    store.commit(MutationTypes.SET_LOGGEDIN, true);
    store.commit(MutationTypes.SET_ROLE, "Student");
    authenticationManagement = new AuthenticationManagement();
    userManagement = new UserManagement();
    expect(success.returnValue).toBe(true);
});

test("Change password", async () => {
    var auth = { username: authUser.username, password: authUser.password };

    let success = await authenticationManagement.changeOwnPassword("testPassword");
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 10000));

    auth.password = "testPassword";

    authenticationManagement = new AuthenticationManagement();
    success = await authenticationManagement.changeOwnPassword("student");
    expect(success.returnValue).toBe(true);
});

test("Login as admin", async () => {
    const success = await UserManagement.login(adminAuth);
    store.commit(MutationTypes.SET_LOGINDATA, adminAuth);
    store.commit(MutationTypes.SET_LOGGEDIN, true);
    store.commit(MutationTypes.SET_ROLE, "Admin");
    authenticationManagement = new AuthenticationManagement();
    userManagement = new UserManagement();
    expect(success.returnValue).toBe(true);
});

test("Delete user", async () => {
    const success = await userManagement.deleteUser(student.username);
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 5000));
});
