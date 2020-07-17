import User from "./User";

export default interface Lecturer extends User {
    freeText: string;
    researchArea: string;
}
