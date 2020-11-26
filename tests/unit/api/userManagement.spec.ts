import Student from "@/api/api_models/user_management/Student";
import User_List from "@/api/api_models/user_management/User_List";
import UserManagement from "@/api/UserManagement";
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { store } from "@/use/store/store";
import { MutationTypes } from "@/use/store/mutation-types";
import { getRandomizedUserAndAuthUser } from "../../helper/Users";
import { readFileSync } from "fs";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";

var userManagement: UserManagement;
const pair = getRandomizedUserAndAuthUser(Role.STUDENT) as { governmentId: string; student: Student; authUser: Account };
const student = pair.student;
const authUser = pair.authUser;
const governmentId = pair.governmentId;

const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };
const studentAuth = JSON.parse(readFileSync("tests/fixtures/logins/student.json", "utf-8")) as { username: string; password: string };
const lecturerAuth = JSON.parse(readFileSync("tests/fixtures/logins/lecturer.json", "utf-8")) as {
    username: string;
    password: string;
};
const picture: File = new File([readFileSync("src/assets/blank_profile_picture.png")], "image.png", { type: "image/png" });
let dummySize = 0;
let dummyPic: File;

jest.setTimeout(30000);

beforeAll(async () => {
    const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
    userManagement = new UserManagement();
    expect(success.returnValue.login).not.toEqual("");
});

test("Create user", async () => {
    const success = await userManagement.createUser(governmentId, authUser, student);
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 1000));
});

test("Get specific user", async () => {
    var result = false;
    const user = await userManagement.getSpecificUser(student.username);
    result = user.returnValue.username == student.username;
    student.enrollmentIdSecret = user.returnValue.enrollmentIdSecret;
    expect(result).toBe(true);
});

test("Get lecturer user", async () => {
    var result = false;
    const user = await userManagement.getSpecificUser(lecturerAuth.username);
    result = user.returnValue.username == lecturerAuth.username;
    expect(result).toBe(true);
});

test("Get admin user", async () => {
    var result = false;
    const user = await userManagement.getSpecificUser(adminAuth.username);
    result = user.returnValue.username == adminAuth.username;
    expect(result).toBe(true);
});

test("Get student user", async () => {
    var result = false;
    const user = await userManagement.getSpecificUser(studentAuth.username);
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
    const users = await userManagement.getUsers();
    let result = true;
    result = result && (users.returnValue as User_List).students.length > 0;
    expect(result).toBe(true);
});

test("Get all students", async () => {
    const users = await userManagement.getUsers(Role.STUDENT);
    let result = (users.returnValue as Student[]).length > 0;
    expect(result).toBe(true);
});

test("Get users by usernames", async () => {
    const users = await userManagement.getUsers(undefined, [studentAuth.username, lecturerAuth.username]);
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(2);
});

test("Get lecturers by usernames", async () => {
    const users = await userManagement.getUsers(Role.LECTURER, [studentAuth.username, lecturerAuth.username]);
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(1);
});

test("Get empty list of lecturers by usernames", async () => {
    const users = await userManagement.getUsers(Role.LECTURER, []);
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(0);
});

test("Get students by usernames", async () => {
    const users = await userManagement.getUsers(Role.STUDENT, [studentAuth.username, lecturerAuth.username]);
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(1);
});

test("Get admins by usernames", async () => {
    const users = await userManagement.getUsers(Role.ADMIN, [studentAuth.username, lecturerAuth.username, adminAuth.username]);
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(1);
});

test("Get active student", async () => {
    const users = await userManagement.getUsers(undefined, [student.username], true);
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(1);
});

test("Update user", async () => {
    student.firstName = "Hans";
    const success = await userManagement.updateUser(student);
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 5000));
});

test("get dummy profile picture", async () => {
    const pic = (await userManagement.getProfilePicture(student.username)).returnValue;
    dummySize = pic.size;
    expect(dummySize).not.toEqual(picture.size);
    dummyPic = pic;
    expect(pic.size).not.toEqual(picture.size);
});

test("upload profile picture", async () => {
    const success = await userManagement.updateProfilePicture(student.username, picture);
    expect(success.returnValue).toBe(true);
});

test("get profile picture", async () => {
    const pic = (await userManagement.getProfilePicture(student.username)).returnValue;
    expect(pic.size).toBeLessThanOrEqual(picture.size);
    expect(pic.size).not.toEqual(dummySize);
    const thumb = (await userManagement.getThumbnail(student.username)).returnValue;
    expect(thumb.size).toBeGreaterThan(0);
    expect(pic.size).not.toEqual(dummyPic.size);
});

test("delete profile picture", async () => {
    const success = await userManagement.deleteProfilePicture(student.username);
    expect(success.returnValue).toBe(true);
});

test("get dummy profile picture", async () => {
    const pic = (await userManagement.getProfilePicture(student.username)).returnValue;
    expect(pic.size).toEqual(dummySize);
});

test("Delete user", async () => {
    const success = await userManagement.deleteUser(student.username);
    expect(success.returnValue).toBe(true);
});

test("Get active user", async () => {
    const resp = await userManagement.getUsers(undefined, [student.username], true);
    let result = Object.values(resp.returnValue).flat();
    expect(result).toHaveLength(0);
});

test("Force delete user", async () => {
    const success = await userManagement.forceDeleteUser(student.username);
    expect(success.returnValue).toBe(true);
});

test("Get user", async () => {
    const resp = await userManagement.getUsers(undefined, [student.username], undefined);
    let result = Object.values(resp.returnValue).flat();
    expect(result).toHaveLength(0);
});
