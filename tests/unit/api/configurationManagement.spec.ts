import { readFileSync } from "fs";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";
import ConfigurationManagement from "@/api/ConfigurationManagement";
import { getRandomizedCourse } from "../../helper/Courses";
import ValidationBag from "@/use/helpers/ValidationBag";
import { Role } from "@/entities/Role";
import { getRandomizedUserAndAuthUser } from "../../helper/Users";
import Student from "@/api/api_models/user_management/Student";

var configurationManagement: ConfigurationManagement;
const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };

jest.useFakeTimers();

describe("Configuration management", () => {
    beforeAll(async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);

        configurationManagement = new ConfigurationManagement();
        expect(success.returnValue.login).not.toEqual("");
    });

    test("Fetch configuration", async () => {
        const response = await configurationManagement.getConfiguration();
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.courseTypes).not.toHaveLength(0);
    });

    test("Fetch validation", async () => {
        const response = await configurationManagement.getValidation();
        expect(response.statusCode).toBe(200);

        const course = getRandomizedCourse();
        const student = (<unknown>getRandomizedUserAndAuthUser(Role.STUDENT)) as { student: Student; authUser: Account };
        let validationBag = new ValidationBag({});

        expect(validationBag.validate(course, "course")).toBe(true);

        validationBag = new ValidationBag(response.returnValue);

        expect(validationBag.validate(course, "course")).toBe(true);

        course.maxParticipants = -500;

        expect(validationBag.validate(course, "course")).toBe(false);

        expect(validationBag.validate(student.student, "student")).toBe(true);

        student.student.address.city = "";
        expect(validationBag.validate(student.student, "student")).toBe(false);
    });

    test("Fetch semester", async () => {
        const response = await configurationManagement.getCurrentSemester();
        expect(response.statusCode).toBe(200);
        expect(response.returnValue).not.toEqual("");

        const response2 = await configurationManagement.getSemester("2015-10-19");
        expect(response2.statusCode).toBe(200);
        expect(response2.returnValue).not.toEqual("");
    });
});
