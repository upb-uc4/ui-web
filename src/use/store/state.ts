import { Role } from "@/entities/Role";
import { Ref, ref } from "vue";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import Admin from "@/api/api_models/user_management/Admin";

export const state = {
    apiUrl: "",
    user: {} as Student | Lecturer | Admin,
    myRole: Role.NONE,
    loggedIn: false,
    loginData: {
        username: "",
        password: "",
    },
    modal: {} as any,
    privateKey: {} as CryptoKey,
};

export type State = typeof state;
