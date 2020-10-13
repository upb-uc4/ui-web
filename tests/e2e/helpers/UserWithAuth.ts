import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";

export interface UserWithAuth {
    userInfo: Admin | Lecturer | Student;
    auth: Account;
}
