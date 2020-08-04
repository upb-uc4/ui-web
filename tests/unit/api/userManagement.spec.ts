import UserManagement from "@/api/UserManagement";
import { Role } from "@/entities/Role";
import { Account } from "@/entities/Account";
import Student from "@/api/api_models/user_management/Student";
import Address from "@/api/api_models/user_management/Address";
import User from "@/api/api_models/user_management/User";
import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
import { store } from "@/store/store";
import { MutationTypes } from "@/store/mutation-types";
import GenericResponseHandler from "@/use/GenericResponseHandler";
import { authUser, address, user, student } from "./testData";

var userManagement: UserManagement;
const adminAuth = { username: "admin", password: "admin" };
jest.setTimeout(30000);

beforeAll(async () => {
    const success = await UserManagement.login(adminAuth);
    store.commit(MutationTypes.SET_LOGINDATA, adminAuth);
    store.commit(MutationTypes.SET_LOGGEDIN, true);
    store.commit(MutationTypes.SET_ROLE, "Admin");
    userManagement = new UserManagement();
    expect(success.returnValue).toBe(true);
});

test("Create user", async () => {
    const success = await userManagement.createUser(authUser, student);
    expect(success.returnValue).toBe(true);
});

test("Get specific user", async () => {
    await new Promise((r) => setTimeout(r, 10000));
    var result = false;
    const user = await userManagement.getSpecificUser(student.username);
    result = user.returnValue.username == student.username;
    expect(result).toBe(true);
});

test("Get own user", async () => {
    await new Promise((r) => setTimeout(r, 10000));
    var result = false;
    const user = await userManagement.getOwnUser();
    result = user.returnValue.username == adminAuth.username;
    expect(result).toBe(true);
});

test("Get all users", async () => {
    const users = await userManagement.getAllUsers();
    let result = true;
    result = result && users.returnValue.students.length > 0;
    expect(result).toBe(true);
});

test("Get all students", async () => {
    const users = await userManagement.getAllUsersByRole(Role.STUDENT);
    let result = users.returnValue.length > 0;
    expect(result).toBe(true);
});

test("Update user", async () => {
    await new Promise((r) => setTimeout(r, 5000));
    student.firstName = "Hans";
    const success = await userManagement.updateUser(student);
    expect(success.returnValue).toBe(true);
});

test("Delete user", async () => {
    await new Promise((r) => setTimeout(r, 5000));
    const success = await userManagement.deleteUser(student.username);
    expect(success.returnValue).toBe(true);
});
