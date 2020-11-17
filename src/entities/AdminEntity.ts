import Address from "@/api/api_models/user_management/Address";
import Admin from "@/api/api_models/user_management/Admin";
import AddressEntity from "./AddressEntity";
import { Role } from "./Role";

export default class AdminEntity implements Admin {
    username = "";
    role = Role.ADMIN;
    address: Address = new AddressEntity();
    firstName = "";
    lastName = "";
    email = "";
    birthDate = "";
    phoneNumber = "";
    is_Active = true;

    constructor() {}
}
