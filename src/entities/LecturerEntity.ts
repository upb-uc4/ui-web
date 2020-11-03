import Address from "@/api/api_models/user_management/Address";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import AddressEntity from "./AddressEntity";
import { Role } from "./Role";

export default class LecturerEntity implements Lecturer {
    freeText = "";
    researchArea = "";
    username = "";
    role = Role.LECTURER;
    address: Address = new AddressEntity();
    firstName = "";
    lastName = "";
    email = "";
    birthDate = "";
    phoneNumber = "";

    constructor() {}
}
