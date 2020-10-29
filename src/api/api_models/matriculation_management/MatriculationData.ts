import SubjectMatriculation from "./SubjectMatriculation";

export default interface MatriculationData {
    enrollmentId: string;
    matriculationStatus: SubjectMatriculation[];
}
