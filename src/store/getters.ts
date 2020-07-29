import { GetterTree } from "vuex";
import { State } from "./state";
import { Role } from "@/entities/Role";
import UserManagement from "@/api/UserManagement";
import { useStore } from "./store";
import GenericResponseHandler from "@/use/GenericResponseHandler";
import { MutationTypes } from "./mutation-types";
import { useRouter } from "vue-router";
import router from "@/router";

//example code: https://dev.to/3vilarthas/vuex-typescript-m4j
export type Getters = {
    doubledCounter(state: State): string;
    loginData(state: State): Promise<{ username: string; password: string }>;
    syncLoginData(state: State): { username: string; password: string };
    role(state: State): Promise<Role>;
    loggedIn(state: State): boolean;
};

export const getters: GetterTree<State, State> & Getters = {
    loggedIn: (state) => {
        return state.loggedIn;
    },
    loginData: async (state) => {
        if (state.loginData.username == "" && state.loginData.password == "") {
            let modal = state.modal;
            const success = await modal();
        }
        return state.loginData;
    },
    syncLoginData: (state) => {
        return state.loginData;
    },
    role: async (state) => {
        if (state.myRole == Role.NONE) {
            const store = useStore();
            const username = (await store.getters.loginData).username;
            if (username == "") {
                return Role.NONE;
            }
            const usermanagement = new UserManagement();
            const response = await usermanagement.getRole(username);
            const role: Role = new GenericResponseHandler().handleReponse(response);
            store.commit(MutationTypes.SET_ROLE, role);
        }
        return state.myRole;
    },

    doubledCounter: (state) => {
        return state.myId;
    },
};
