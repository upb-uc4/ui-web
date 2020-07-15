import User from "@/api/api_models/user_management/User"
import { Role } from './Role';
import AddressEntity from './AddressEntity';
import Address from '@/api/api_models/user_management/Address';

export default class UserEntity implements User {
    username = "";
    role = Role.NONE;
    address : Address = new AddressEntity();
    firstName = "";
    lastName = "";
    picture = "https://cdn3.iconfinder.com/data/icons/faticons/32/user-01-512.png";
    email = "";
    birthDate = "";
}