import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import Admin from "@/api/api_models/user_management/Admin";

export const state = {
    apiUrl: "",
    user: {} as Student | Lecturer | Admin,
    loggedIn: false,
    modal: {} as any,
};

export type State = typeof state;
