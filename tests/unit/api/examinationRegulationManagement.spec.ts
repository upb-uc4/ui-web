import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
import { readFileSync } from "fs";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";

let examinationRegulationManagement: ExaminationRegulationManagement;
let someName = "";
let someModuleId = "";

const adminAuth = JSON.parse(readFileSync("tests/fixtures/logins/admin.json", "utf-8")) as { username: string; password: string };
const examReg = JSON.parse(readFileSync("tests/fixtures/examinationRegulation.json", "utf-8")) as ExaminationRegulation;

jest.setTimeout(30000);

describe("Examination Regulation Management", () => {
    beforeAll(async () => {
        examinationRegulationManagement = new ExaminationRegulationManagement();
        examReg.name += new Date().toISOString();
    });

    test("Get examination regulations", async () => {
        const response = await examinationRegulationManagement.getExaminationRegulation();
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length > 0).toBe(true);
        someName = response.returnValue[0].name;
    });

    test("Get part of examination regulations", async () => {
        const response = await examinationRegulationManagement.getExaminationRegulation([someName]);
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length == 1).toBe(true);
        expect(response.returnValue[0].name).toEqual(someName);
    });

    test("Get all examination regulation names", async () => {
        const response = await examinationRegulationManagement.getExaminationRegulationNames();
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length > 0).toBe(true);
    });

    test("Get all modules", async () => {
        const response = await examinationRegulationManagement.getModules();
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length > 0).toBe(true);
        someModuleId = response.returnValue[0].id;
    });

    test("Get specific module", async () => {
        const response = await examinationRegulationManagement.getModules([someModuleId]);
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length == 1).toBe(true);
        expect(response.returnValue[0].id).toEqual(someModuleId);
    });

    test("Login as admin", async () => {
        const success = await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);
        examinationRegulationManagement = new ExaminationRegulationManagement();
    });

    test("Create new examination regulation", async () => {
        const response = await examinationRegulationManagement.createExaminationRegulation(examReg);
        expect(response.statusCode).toBe(201);
        expect(response.returnValue).toBe(true);
        await new Promise((r) => setTimeout(r, 15000));
    });

    test("Fetch new examination regulation", async () => {
        const response = await examinationRegulationManagement.getExaminationRegulation([examReg.name]);
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length).toBe(1);
    });

    test("Delete examination regulation", async () => {
        const response = await examinationRegulationManagement.deleteExaminationRegulation(examReg.name);
        expect(response.statusCode).toBe(200);
        expect(response.returnValue).toBe(true);
    });

    test("Fetch deleted examination regulation", async () => {
        const response = await examinationRegulationManagement.getExaminationRegulation([examReg.name]);
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length).toBe(1);
        expect(response.returnValue[0].active).toBe(false);
    });
});
