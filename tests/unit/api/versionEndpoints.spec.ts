import UserManagement from "@/api/UserManagement";
import CourseManagement from "@/api/CourseManagement";
import { Role } from "@/entities/Role";
import { Account } from "@/entities/Account";
import { CourseEntity } from "@/entities/CourseEntity";
import Course from "@/api/api_models/course_management/Course";
import { Language } from "@/entities/Language";
import { CourseType } from "@/entities/CourseType";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import HyperledgerManagement from "@/api/HyperledgerManagement";
import HyperledgerCourseManagement from "@/api/HyperledgerCourseManagement";

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

test("hyperledger management service version", async () => {
    const version = await HyperledgerManagement.getVersion();

    expect(version).not.toEqual("unavailable");
});

test("hyperledger course management service version", async () => {
    const version = await HyperledgerCourseManagement.getVersion();

    expect(version).not.toEqual("unavailable");
});
