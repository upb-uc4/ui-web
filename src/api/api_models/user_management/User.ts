import Address from "./Address";
import { Role } from "@/entities/Role";

export default interface User {
    username: string;
    role: Role;
    address: Address;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    phoneNumber: string;
}
