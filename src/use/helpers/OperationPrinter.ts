import AdmissionManagement from "@/api/AdmissionManagement";
import CourseAdmission from "@/api/api_models/admission_management/CourseAdmission";
import Exam from "@/api/api_models/exam_management/Exam";
import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
import Operation from "@/api/api_models/operation_management/Operation";
import CourseManagement from "@/api/CourseManagement";
import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
import { UC4Identifier } from "@/api/helpers/UC4Identifier";
import { Role } from "@/entities/Role";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import { useStore } from "../store/store";
import { dateFormatOptions } from "./DateFormatOptions";

export async function printOperation(operation: Operation): Promise<string[]> {
    const contractName = operation.transactionInfo.contractName;

    switch (contractName) {
        case UC4Identifier.CONTRACT_MATRICULATION:
            return printMatriculationOperation(operation);
        case UC4Identifier.CONTRACT_ADMISSION:
            return await printAdmissionOperation(operation);
        case UC4Identifier.CONTRACT_EXAM:
            return await printExamOperation(operation);
        default:
            return [];
    }
}

async function printExamOperation(operation: Operation): Promise<string[]> {
    const paramsArray: string[] = JSON.parse(operation.transactionInfo.parameters);
    const exam: Exam = <Exam>JSON.parse(paramsArray[0]);
    const retArray = [] as string[];
    const courseName = new GenericResponseHandler("course").handleResponse(await new CourseManagement().getCourse(exam.courseId))
        .courseName;
    retArray.push(`Course: ${courseName}`);
    retArray.push(`Module: ${exam.moduleId}`);
    retArray.push(`Date: ${new Date(exam.date).toLocaleString("en-Gb", dateFormatOptions)}`);
    retArray.push(`ECTS: ${exam.ects}`);
    return retArray;
}

async function printAdmissionOperation(operation: Operation): Promise<string[]> {
    const transactionName = operation.transactionInfo.transactionName;

    if (transactionName === UC4Identifier.TRANSACTION_ADD_ADMISSION) {
        const paramsArray: string[] = JSON.parse(operation.transactionInfo.parameters);
        const admission: CourseAdmission = <CourseAdmission>JSON.parse(paramsArray[0]);

        const examregManagement = new ExaminationRegulationManagement();

        const response = await examregManagement.getModules([admission.moduleId]);
        const handler = new GenericResponseHandler("module");
        const moduleName = handler.handleResponse(response);
        const str = admission.courseId + " " + admission.moduleId + ": " + moduleName;

        return [str];
    } else if (transactionName === UC4Identifier.TRANSACTION_DROP_ADMISSION) {
        const paramsArray: string[] = JSON.parse(operation.transactionInfo.parameters);
        const admissionId = paramsArray[0];

        const admissionManagement = new AdmissionManagement();

        const store = useStore();
        let admissions: CourseAdmission[] = [];
        if ((await store.getters.user).role != Role.ADMIN) {
            const response = await admissionManagement.getCourseAdmissions((await store.getters.user).username);
            const handler = new GenericResponseHandler("admissions");
            admissions = handler.handleResponse(response);
        } else {
            const response = await admissionManagement.getCourseAdmissions();
            const handler = new GenericResponseHandler("admissions");
            admissions = handler.handleResponse(response);
        }

        const admission = admissions.find((e) => e.admissionId === admissionId);

        if (!admission) return [admissionId];

        const examregManagement = new ExaminationRegulationManagement();

        const response2 = await examregManagement.getModules([admission.moduleId]);
        const handler2 = new GenericResponseHandler("module");
        const moduleName = handler2.handleResponse(response2);

        const str = admission.courseId.substring(0, 4) + " " + admission.moduleId + ": " + moduleName;

        return [str];
    }

    return [];
}

function printMatriculationOperation(operation: Operation): string[] {
    const transactionName = operation.transactionInfo.transactionName;

    if (transactionName === UC4Identifier.TRANSACTION_ADD_ENTRIES_MATRICULATION) {
        const paramsArray: string[] = JSON.parse(operation.transactionInfo.parameters);
        const subjectMatriculation: SubjectMatriculation[] = <SubjectMatriculation[]>JSON.parse(paramsArray[1]);

        return printSubjectMatriculation(subjectMatriculation);
    } else if (
        transactionName === UC4Identifier.TRANSACTION_ADD_MATRICULATION ||
        transactionName === UC4Identifier.TRANSACTION_UPDATE_MATRICULATION
    ) {
        const paramsArray: string[] = JSON.parse(operation.transactionInfo.parameters);
        const matriculationData: MatriculationData = <MatriculationData>JSON.parse(paramsArray[0]);

        return printSubjectMatriculation(matriculationData.matriculationStatus);
    }

    return [];
}

function printSubjectMatriculation(data: SubjectMatriculation[]): string[] {
    const result: string[] = [];
    data.forEach((matr) => {
        result.push(matr.fieldOfStudy + " " + matr.semesters.reduce((a, b) => a + ", " + b));
    });

    return result;
}

export function printOperationTitle(operation: Operation): string {
    switch (operation.transactionInfo.transactionName) {
        case UC4Identifier.TRANSACTION_ADD_ENTRIES_MATRICULATION:
        case UC4Identifier.TRANSACTION_ADD_MATRICULATION:
        case UC4Identifier.TRANSACTION_UPDATE_MATRICULATION:
            var matrEntry = printMatriculationOperation(operation)[0].split(" ");
            return "Update Matriculation " + matrEntry[matrEntry.length - 1];
        case UC4Identifier.TRANSACTION_DROP_ADMISSION:
            return "Drop Course";
        case UC4Identifier.TRANSACTION_ADD_ADMISSION:
            return "Course Admission";
        case UC4Identifier.TRANSACTION_ADD_EXAM:
            return "Exam Creation";
        default:
            return "";
    }
}

export function getOperationBadgeIdentifier(operation: Operation): string {
    switch (operation.transactionInfo.contractName) {
        case UC4Identifier.CONTRACT_MATRICULATION:
            return "Matriculation";
        case UC4Identifier.CONTRACT_ADMISSION:
            return "Course Admission";
        case UC4Identifier.CONTRACT_EXAM:
            return "Exam";
        default:
            return "";
    }
}
