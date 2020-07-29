import { Role } from "@/entities/Role";
import { Ref, ref } from "vue";

export const state = {
    apiUrl: "",
    myId: "",
    myRole: Role.NONE,
    loggedIn: false,
    loginData: {
        username: "",
        password: "",
    },
    modal: {} as any,
};

export type State = typeof state;
