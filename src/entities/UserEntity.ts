import User from "@/api/api_models/user_management/User";
import { Role } from "./Role";
import AddressEntity from "./AddressEntity";
import Address from "@/api/api_models/user_management/Address";

export default class UserEntity implements User {
    username = "";
    role = Role.NONE;
    address: Address = new AddressEntity();
    firstName = "";
    lastName = "";
    email = "";
    birthDate = "";
    phoneNumber = "";
}
