import UserManagement from "@/api/UserManagement";
import CourseManagement from "@/api/CourseManagement";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import MatriculationManagement from "@/api/MatriculationManagement";
import CertificateManagement from "@/api/CertificateManagement";

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

test("matriculation service version", async () => {
    const version = await MatriculationManagement.getVersion();

    expect(version).not.toEqual("unavailable");
});

test("certificate service version", async () => {
    const version = await CertificateManagement.getVersion();

    expect(version).not.toEqual("unavailable");
});
