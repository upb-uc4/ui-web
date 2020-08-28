import UserManagement from "@/api/UserManagement";
import { Role } from "@/entities/Role";
import { store } from "@/store/store";
import { MutationTypes } from "@/store/mutation-types";
import { getRandomizedUserAndAuthUser } from "../../helper/Users";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { readFileSync } from "fs";

var userManagement: UserManagement;
const pair = getRandomizedUserAndAuthUser(Role.STUDENT) as { student: Student; authUser: Account };
const student = pair.student;
const authUser = pair.authUser;

const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };
const studentAuth = JSON.parse(readFileSync("tests/fixtures/logins/student.json", "utf-8")) as { username: string; password: string };
const lecturerAuth = JSON.parse(readFileSync("tests/fixtures/logins/lecturer.json", "utf-8")) as {
    username: string;
    password: string;
};

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
    await new Promise((r) => setTimeout(r, 5000));
});

test("Get specific user", async () => {
    var result = false;
    const user = await userManagement.getSpecificUser(student.username);
    result = user.returnValue.username == student.username;
    expect(result).toBe(true);
});

test("Get lecturer user", async () => {
    var result = false;
    const user = await userManagement.getLecturer(lecturerAuth.username);
    result = user.returnValue.username == lecturerAuth.username;
    expect(result).toBe(true);
});

test("Get admin user", async () => {
    var result = false;
    const user = await userManagement.getAdmin(adminAuth.username);
    result = user.returnValue.username == adminAuth.username;
    expect(result).toBe(true);
});

test("Get student user", async () => {
    var result = false;
    const user = await userManagement.getStudent(studentAuth.username);
    result = user.returnValue.username == studentAuth.username;
    expect(result).toBe(true);
});

test("Get own user", async () => {
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

test("Get users by usernames", async () => {
    const users = await userManagement.getUsers(studentAuth.username, lecturerAuth.username);
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(2);
});

test("Get lecturers by usernames", async () => {
    const users = await userManagement.getLecturers(studentAuth.username, lecturerAuth.username);
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(1);
});

test("Get empty list of lecturers by usernames", async () => {
    const users = await userManagement.getLecturers();
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(0);
});

test("Get students by usernames", async () => {
    const users = await userManagement.getStudents(studentAuth.username, lecturerAuth.username);
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(1);
});

test("Get admins by usernames", async () => {
    const users = await userManagement.getAdmins(studentAuth.username, lecturerAuth.username, adminAuth.username);
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(1);
});

test("Update user", async () => {
    student.firstName = "Hans";
    const success = await userManagement.updateUser(student);
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 5000));
});

test("Delete user", async () => {
    const success = await userManagement.deleteUser(student.username);
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 5000));
});
