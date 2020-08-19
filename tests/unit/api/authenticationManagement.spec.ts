import UserManagement from "@/api/UserManagement";
import { store } from "@/store/store";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import { MutationTypes } from "@/store/mutation-types";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
import { Role } from "@/entities/Role";
import User from "@/api/api_models/user_management/User";
import Address from "@/api/api_models/user_management/Address";

var authenticationManagement: AuthenticationManagement;
var userManagement: UserManagement;
const adminAuth = { username: "admin", password: "admin" };

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

jest.setTimeout(30000);

beforeAll(async () => {
    const success = await UserManagement.login(adminAuth);
    store.commit(MutationTypes.SET_LOGINDATA, adminAuth);
    store.commit(MutationTypes.SET_LOGGEDIN, true);
    store.commit(MutationTypes.SET_ROLE, "Admin");
    authenticationManagement = new AuthenticationManagement();
    userManagement = new UserManagement();
    expect(success.returnValue).toBe(true);
    const random = Math.floor(Math.random() * 500);
    authUser.username = authUser.username += random;
    student.username = authUser.username;
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
