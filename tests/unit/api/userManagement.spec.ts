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

var userManagement: UserManagement;
const adminAuth = { username: "admin", password: "admin" };
jest.setTimeout(30000);

var authUser: Account = {
    username: "testUser",
    password: "testUser",
    role: Role.STUDENT,
};

var address: Address = {
    street: "Sandy Street",
    houseNumber: "5c",
    zipCode: "42069",
    city: "Mos Eisley",
    country: "Germany",
};

var user: User = {
    username: "testUser",
    role: Role.STUDENT,
    address: address,
    firstName: "Luke",
    lastName: "Skywalker",
    picture: "string",
    email: "luke@skywalker.com",
    birthDate: "1950-12-24",
};

var student: Student = {
    ...user,
    immatriculationStatus: "Is still a Jedi Knight",
    matriculationId: "1234567",
    semesterCount: 69,
    fieldsOfStudy: [FieldOfStudy.COMPUTER_SCIENCE],
};

beforeAll(async () => {
    const success = await UserManagement.login(adminAuth);
    store.commit(MutationTypes.SET_LOGINDATA, adminAuth);
    store.commit(MutationTypes.SET_LOGGEDIN, true);
    store.commit(MutationTypes.SET_ROLE, "Admin");
    userManagement = new UserManagement();
    expect(success.returnValue).toBe(true);

    // randomize user primary key to support concurrent testing
    const random = Math.floor(Math.random() * 500);
    authUser.username = authUser.username += random;
    user.username = authUser.username;
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
    const user = await userManagement.getLecturer("lecturer");
    result = user.returnValue.username == "lecturer";
    expect(result).toBe(true);
});

test("Get admin user", async () => {
    var result = false;
    const user = await userManagement.getAdmin("admin");
    result = user.returnValue.username == "admin";
    expect(result).toBe(true);
});

test("Get student user", async () => {
    var result = false;
    const user = await userManagement.getStudent("student");
    result = user.returnValue.username == "student";
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
    const users = await userManagement.getUsers("student", "lecturer");
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(2);
});

test("Get lecturers by usernames", async () => {
    const users = await userManagement.getLecturers("student", "lecturer");
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(1);
});

test("Get students by usernames", async () => {
    const users = await userManagement.getStudents("student", "lecturer");
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(1);
});

test("Get admins by usernames", async () => {
    const users = await userManagement.getAdmins("student", "lecturer", "admin");
    let result = Object.values(users.returnValue).flat();
    expect(result).toHaveLength(1);
});

test("Update user", async () => {
    student.immatriculationStatus = "Is a Jedi Master";
    const success = await userManagement.updateUser(student);
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 5000));
});

test("Delete user", async () => {
    const success = await userManagement.deleteUser(student.username);
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 5000));
});
