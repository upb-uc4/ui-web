import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";

let examinationRegulationManagement: ExaminationRegulationManagement;
let someName = "";

jest.setTimeout(15000);

describe("Examination Regulation Management", () => {
    beforeAll(async () => {
        examinationRegulationManagement = new ExaminationRegulationManagement();
    });

    test("Get examination regulations", async () => {
        const response = await examinationRegulationManagement.getExaminationRegulation();
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length > 0).toBe(true);
        someName = response.returnValue[0].name;
    });

    test("Get part of examination regulations", async () => {
        const response = await examinationRegulationManagement.getExaminationRegulation([name]);
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length == 1).toBe(true);
        expect(response.returnValue[0].name).toEqual(someName);
    });

    test("Get all examination regulation names", async () => {
        const response = await examinationRegulationManagement.getExaminationRegulationNames();
        expect(response.statusCode).toBe(200);
        expect(response.returnValue.length > 0).toBe(true);
    });
});
