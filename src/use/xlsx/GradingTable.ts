import AdmissionManagement from "@/api/AdmissionManagement";
import ExamResult from "@/api/api_models/exam_result_management/ExamResult";
import * as xlsx from "xlsx";
import GenericResponseHandler from "../helpers/GenericResponseHandler";

export async function createGradingTable(examIds?: string[]): Promise<xlsx.WorkBook> {
    const admissionManagement = new AdmissionManagement();

    const response = await admissionManagement.getExamAdmissions(undefined, examIds);
    const handler = new GenericResponseHandler("exam admissions");
    const admissions = handler.handleResponse(response);

    const results = admissions.map((a) => {
        return {
            enrollmentId: a.enrollmentId,
            examId: a.examId,
            grade: "",
        } as ExamResult;
    });

    return buildGradingTable(results);
}

export async function buildGradingTable(examResults: ExamResult[]) {
    const workbook = xlsx.utils.book_new();
    const examIds = new Set(examResults.map((e) => e.examId));

    for (let ex of examIds) {
        const results = examResults.filter((e) => e.examId === ex);

        const sheet = xlsx.utils.json_to_sheet(results);

        xlsx.utils.book_append_sheet(workbook, sheet, "exam_" + ex.substring(0, 5));
    }

    return workbook;
}

export function readGradingTableFile(data: any): ExamResult[] {
    return readGradingTable(xlsx.read(data, { type: "buffer" }));
}

export function readGradingTable(workbook: xlsx.WorkBook): ExamResult[] {
    const results = [];

    for (let sheetName of workbook.SheetNames) {
        results.push(...xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]));
    }

    return results as ExamResult[];
}
