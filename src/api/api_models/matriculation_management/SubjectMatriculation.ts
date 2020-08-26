import { FieldOfStudy } from "../user_management/FieldOfStudy";

export default interface SubjectMatriculation {
    fieldOfStudy: FieldOfStudy;
    semesters: string[];
}
