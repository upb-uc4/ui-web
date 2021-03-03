import ExamResult from "@/api/api_models/exam_result_management/ExamResult";
import { buildGradingTable, readGradingTable, readGradingTableFile } from "@/use/xlsx/GradingTable";
import { existsSync, mkdirSync, readFileSync, unlinkSync } from "fs";
import * as xlsx from "xlsx";

describe("Test Grading table", () => {
    test("Create table", async () => {
        const ex: ExamResult[] = [
            {
                enrollmentId: "enrollmentId1",
                examId: "exam1",
                grade: "1.0",
            },
            {
                enrollmentId: "enrollmentId2",
                examId: "exam1",
                grade: "1.3",
            },
            {
                enrollmentId: "enrollmentId3",
                examId: "exam1",
                grade: "1.7",
            },
            {
                enrollmentId: "enrollmentId4",
                examId: "exam1",
                grade: "2.0",
            },
            {
                enrollmentId: "enrollmentId5",
                examId: "exam1",
                grade: "2.3",
            },
            {
                enrollmentId: "enrollmentId6",
                examId: "exam2",
                grade: "5.0",
            },
            {
                enrollmentId: "enrollmentId7",
                examId: "exam2",
                grade: "1.3",
            },
            {
                enrollmentId: "enrollmentId8",
                examId: "exam2",
                grade: "2.7",
            },
            {
                enrollmentId: "enrollmentId9",
                examId: "exam2",
                grade: "2.0",
            },
            {
                enrollmentId: "enrollmentId10",
                examId: "exam2",
                grade: "2.3",
            },
        ];

        const wb = await buildGradingTable(ex);
        if (!existsSync("tmp")) mkdirSync("tmp");
        xlsx.writeFile(wb, "tmp/testFile.xlsx");

        const res = readGradingTable(wb);
        expect(res).toEqual(ex);

        const resFile = readGradingTableFile(readFileSync("tmp/testFile.xlsx"));
        expect(resFile).toEqual(ex);

        if (existsSync("tmp/testFile.xlsx")) unlinkSync("tmp/testFile.xlsx");
    });
});
