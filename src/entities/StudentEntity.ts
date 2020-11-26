import Address from "@/api/api_models/user_management/Address";
import Student from "@/api/api_models/user_management/Student";
import AddressEntity from "./AddressEntity";
import { Role } from "./Role";

export default class StudentEntity implements Student {
    matriculationId = "";
    latestImmatriculation = "";
    username = "";
    role = Role.STUDENT;
    address: Address = new AddressEntity();
    firstName = "";
    lastName = "";
    email = "";
    birthDate = "";
    phoneNumber = "";
    enrollmentIdSecret = "";
    isActive = true;
    constructor() {}
}
