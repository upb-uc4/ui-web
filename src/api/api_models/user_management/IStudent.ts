import User from './User';
import { FieldOfStudy } from './FieldOfStudy';

export default interface Student extends User {
    immatriculationStatus: string,
    matriculationId: string,
    semesterCount: number,
    fieldsOfStudy: FieldOfStudy[]
}