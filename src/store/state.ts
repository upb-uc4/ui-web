import { Role } from "@/entities/Role";

export const state = {
    apiUrl: "",
    myId: "",
    myRole: Role.NONE,
    loginData: {
        username: "",
        password: "",
    },
};

export type State = typeof state;
