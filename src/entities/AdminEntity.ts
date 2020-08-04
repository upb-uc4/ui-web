import { Role } from "./Role";
import AddressEntity from "./AddressEntity";
import Address from "@/api/api_models/user_management/Address";
import Admin from "@/api/api_models/user_management/Admin";

export default class AdminEntity implements Admin {
    username = "";
    role = Role.ADMIN;
    address: Address = new AddressEntity();
    firstName = "";
    lastName = "";
    picture = "";
    email = "";
    birthDate = "";

    constructor() {}
}
