import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import { GetterTree } from "vuex";
import { State } from "./state";
import { useStore } from "./store";

//example code: https://dev.to/3vilarthas/vuex-typescript-m4j
export type Getters = {
    user(state: State): Promise<Student | Lecturer | Admin>;
    loggedIn(state: State): boolean;
};

export const getters: GetterTree<State, State> & Getters = {
    loggedIn: (state) => {
        return state.loggedIn;
    },
    user: async (state) => {
        if (state.user.username == undefined || state.user.username == "") {
            // get own user
            await AuthenticationManagement._getLoginToken();

            if (state.user.username == undefined || state.user.username == "") {
                // there was no refresh token
                let modal = state.modal;
                await modal();
            }
        }
        return state.user;
    },
    role: async (state) => {
        const store = useStore();
        return (await store.getters.user).role;
    },
};
