import { Role } from "@/entities/Role";
import Address from "./Address";

export default interface User {
    username: string;
    role: Role;
    address: Address;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    phoneNumber: string;
    isActive: boolean;
}
