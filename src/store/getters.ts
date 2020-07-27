import { GetterTree } from "vuex";
import { State } from "./state";
import { Role } from "@/entities/Role";
import UserManagement from "@/api/UserManagement";
import { useStore } from "./store";
import GenericResponseHandler from "@/use/GenericResponseHandler";

//example code: https://dev.to/3vilarthas/vuex-typescript-m4j
export type Getters = {
    doubledCounter(state: State): string;
    loginData(state: State): { username: string; password: string };
    role(state: State): Promise<Role>;
};

export const getters: GetterTree<State, State> & Getters = {
    loginData: (state) => {
        if (state.loginData.username == "" && state.loginData.password == "") {
            state.loginData.username = "admin";
            state.loginData.password = "admin";
        }

        return state.loginData;
    },

    role: async (state) => {
        if (state.myRole == Role.NONE) {
            const usermanagement = new UserManagement();
            const store = useStore();
            state.myRole = new GenericResponseHandler().handleReponse(await usermanagement.getRole(store.getters.loginData.username));
        }

        return state.myRole;
    },

    doubledCounter: (state) => {
        return state.myId;
    },
};
