import UserManagement from "@/api/UserManagement";
import { store } from "@/store/store";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import { MutationTypes } from "@/store/mutation-types";

var authenticationManagement: AuthenticationManagement;
const studentAuth = { username: "student", password: "student" };
jest.setTimeout(30000);

beforeAll(async () => {
    const success = await UserManagement.login(studentAuth);
    store.commit(MutationTypes.SET_LOGINDATA, studentAuth);
    store.commit(MutationTypes.SET_LOGGEDIN, true);
    store.commit(MutationTypes.SET_ROLE, "Student");
    authenticationManagement = new AuthenticationManagement();
    expect(success.returnValue).toBe(true);
});

test("Change password", async () => {
    let success = await authenticationManagement.changeOwnPassword("testPassword");
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 10000));

    studentAuth.password = "testPassword";

    authenticationManagement = new AuthenticationManagement();
    success = await authenticationManagement.changeOwnPassword("student");
    expect(success.returnValue).toBe(true);
});
