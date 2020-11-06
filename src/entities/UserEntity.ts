import Address from "@/api/api_models/user_management/Address";
import User from "@/api/api_models/user_management/User";
import AddressEntity from "./AddressEntity";
import { Role } from "./Role";

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
