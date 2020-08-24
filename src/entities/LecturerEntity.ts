import Lecturer from "@/api/api_models/user_management/Lecturer";
import { Role } from "./Role";
import AddressEntity from "./AddressEntity";
import Address from "@/api/api_models/user_management/Address";

export default class LecturerEntity implements Lecturer {
    freeText = "";
    researchArea = "";
    username = "";
    role = Role.LECTURER;
    address: Address = new AddressEntity();
    firstName = "";
    lastName = "";
    picture = "";
    email = "";
    birthDate = "";
    phoneNumber = "";

    constructor() {}
}
