import UserManagement from "@/api/UserManagement";
import CourseManagement from "@/api/CourseManagement";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import MatriculationManagement from "@/api/MatriculationManagement";
import ConfigurationManagement from "@/api/ConfigurationManagement";

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

test("configuration management and hyperledger version", async () => {
    const version = await ConfigurationManagement.getVersion();

    expect(version).not.toEqual("unavailable");

    const hlVersions = await ConfigurationManagement.getHyperledgerVersion();
    expect(hlVersions.apiVersion).not.toEqual("unavailable");
    expect(hlVersions.chaincodeVersion).not.toEqual("unavailable");
    expect(hlVersions.networkVersion).not.toEqual("unavailable");
});
