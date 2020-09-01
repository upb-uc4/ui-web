import SubjectMatriculation from "./SubjectMatriculation";

export default interface MatriculationData {
    matriculationId: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    matriculationStatus: SubjectMatriculation[];
}
