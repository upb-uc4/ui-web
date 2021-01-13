import UserManagement from "@/api/UserManagement";
import CourseManagement from "@/api/CourseManagement";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import MatriculationManagement from "@/api/MatriculationManagement";
import CertificateManagement from "@/api/CertificateManagement";
import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
import OperationManagement from "@/api/OperationManagement";
import GroupManagement from "@/api/GroupManagement";

jest.useFakeTimers();
jest.setTimeout(30000);

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

    const hyperledgerVersion = await MatriculationManagement.getHyperledgerVersion();
    expect(hyperledgerVersion.chaincodeVersion).not.toBe(undefined);
    expect(hyperledgerVersion.hlfApiVersion).not.toBe(undefined);
});

test("certificate service version", async () => {
    const version = await CertificateManagement.getVersion();

    expect(version).not.toEqual("unavailable");

    const hyperledgerVersion = await CertificateManagement.getHyperledgerVersion();
    expect(hyperledgerVersion.chaincodeVersion).not.toBe(undefined);
    expect(hyperledgerVersion.hlfApiVersion).not.toBe(undefined);
});

test("exam regulations service version", async () => {
    const version = await ExaminationRegulationManagement.getVersion();

    expect(version).not.toEqual("unavailable");

    const hyperledgerVersion = await ExaminationRegulationManagement.getHyperledgerVersion();
    expect(hyperledgerVersion.chaincodeVersion).not.toBe(undefined);
    expect(hyperledgerVersion.hlfApiVersion).not.toBe(undefined);
});

test("operation service version", async () => {
    const version = await OperationManagement.getVersion();

    expect(version).not.toEqual("unavailable");

    const hyperledgerVersion = await OperationManagement.getHyperledgerVersion();
    expect(hyperledgerVersion.chaincodeVersion).not.toBe(undefined);
    expect(hyperledgerVersion.hlfApiVersion).not.toBe(undefined);
});

test("group service version", async () => {
    const version = await GroupManagement.getVersion();

    expect(version).not.toEqual("unavailable");

    const hyperledgerVersion = await GroupManagement.getHyperledgerVersion();
    expect(hyperledgerVersion.chaincodeVersion).not.toBe(undefined);
    expect(hyperledgerVersion.hlfApiVersion).not.toBe(undefined);
});
