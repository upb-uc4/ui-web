import Student from "@/api/api_models/user_management/Student";
import { Role } from "./Role";
import AddressEntity from "./AddressEntity";
import Address from "@/api/api_models/user_management/Address";

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
    constructor() {}
}
