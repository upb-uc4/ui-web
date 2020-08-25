import { useStore } from "@/store/store";
import { MutationTypes } from "@/store/mutation-types";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Admin from "@/api/api_models/user_management/Admin";
import Student from "@/api/api_models/user_management/Student";
import { Role } from "@/entities/Role";

export function logout() {
    const store = useStore();
    store.commit(MutationTypes.SET_LOGINDATA, { username: "", password: "" });
    store.commit(MutationTypes.SET_USER, {} as Student | Lecturer | Admin);
    store.commit(MutationTypes.SET_ROLE, Role.NONE);
    store.commit(MutationTypes.SET_LOGGEDIN, false);
}
