import Student from "@/api/api_models/user_management/Student";
import { Role } from "./Role";
import AddressEntity from "./AddressEntity";
import Address from "@/api/api_models/user_management/Address";
import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";

export default class StudentEntity implements Student {
    matriculationId = "";
    latestImmatriculation = "";
    username = "";
    role = Role.STUDENT;
    address: Address = new AddressEntity();
    firstName = "";
    lastName = "";
    picture = "";
    email = "";
    birthDate = "";
    phoneNumber = "";
    constructor() {}
}
