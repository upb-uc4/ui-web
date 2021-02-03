import { AdmissionTypes } from "./AdmissionTypes";

export default interface CourseAdmission {
    enrollmentId: string;
    courseId: string;
    moduleId: string;
    admissionId: string;
    timestamp: string;
    type: AdmissionTypes.COURSE;
}
