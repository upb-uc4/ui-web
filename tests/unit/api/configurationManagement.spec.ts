import { readFileSync } from "fs";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";
import ConfigurationManagement from "@/api/ConfigurationManagement";
import { getRandomizedCourse } from "../../helper/Courses";
import ValidationBag from "@/use/helpers/ValidationBag";
import lodash from "lodash";

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
        expect(response.returnValue.fieldsOfStudy).not.toHaveLength(0);
    });

    test("Fetch validation", async () => {
        const response = await configurationManagement.getValidation();
        expect(response.statusCode).toBe(200);

        const course = getRandomizedCourse();
        const validationBag = new ValidationBag({});

        expect(validationBag.validate(course)).toBe(true);
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
