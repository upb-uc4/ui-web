import { AdmissionTypes } from "./AdmissionTypes";

export default interface ExamAdmission {
    enrollmentId: string;
    admissionId: string;
    timestamp: string;
    examId: string;
    type: AdmissionTypes.EXAM;
}
