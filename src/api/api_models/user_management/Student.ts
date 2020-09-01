import User from "./User";

export default interface Student extends User {
    matriculationId: string;
    latestImmatriculation: string;
}
