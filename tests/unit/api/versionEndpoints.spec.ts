import CourseManagement from "@/api/CourseManagement";
import { Role } from "@/entities/Role";
import { Account } from "@/entities/Account";
import { CourseEntity } from "@/entities/CourseEntity";
import Course from "@/api/api_models/course_management/Course";
import { Language } from "@/entities/Language";
import { CourseType } from "@/entities/CourseType";
import UserManagement from "@/api/UserManagement";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import HyperledgerManagement from "@/api/HyperledgerManagement";
import HyperledgerCourseManagement from "@/api/HyperledgerCourseManagement";

jest.useFakeTimers();

test("course service version", async () => {
    const courseManagement = new CourseManagement();
    const version = await courseManagement.getVersion();

    expect(version).not.toEqual("unavailable");
});

test("authentication service version", async () => {
    const authenticationManagement = new AuthenticationManagement();
    const version = await authenticationManagement.getVersion();

    expect(version).not.toEqual("unavailable");
});

test("user service version", async () => {
    const userManagement = new UserManagement();
    const version = await userManagement.getVersion();

    expect(version).not.toEqual("unavailable");
});

test("hyperledger management service version", async () => {
    const hyperledgerManagement = new HyperledgerManagement();
    const version = await hyperledgerManagement.getVersion();

    expect(version).not.toEqual("unavailable");
});

test("hyperledger course management service version", async () => {
    const hyperledgerCourseManagement = new HyperledgerCourseManagement();
    const version = await hyperledgerCourseManagement.getVersion();

    expect(version).not.toEqual("unavailable");
});
