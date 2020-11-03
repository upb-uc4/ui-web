import AuthenticationManagement from "@/api/AuthenticationManagement";
import CourseManagement from "@/api/CourseManagement";
import MatriculationManagement from "@/api/MatriculationManagement";
import UserManagement from "@/api/UserManagement";

jest.useFakeTimers();

test("course service version", async () => {
    const version = await CourseManagement.getVersion();

    expect(version).not.toEqual("unavailable");
});

test("authentication service version", async () => {
    const version = await AuthenticationManagement.getVersion();

    expect(version).not.toEqual("unavailable");
});

test("user service version", async () => {
    const version = await UserManagement.getVersion();

    expect(version).not.toEqual("unavailable");
});

test.skip("matriculation service version", async () => {
    const version = await MatriculationManagement.getVersion();

    expect(version).not.toEqual("unavailable");
});
