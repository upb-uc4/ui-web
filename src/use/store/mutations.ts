import { MutationTypes } from "./mutation-types";
import { State } from "./state";
import { MutationTree } from "vuex";
import Student from "@/api/api_models/user_management/Student";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Admin from "@/api/api_models/user_management/Admin";

export type Mutations<S = State> = {
    [MutationTypes.SET_USER](state: S, payload: Student | Lecturer | Admin): void;
    [MutationTypes.SET_MODAL](state: S, payload: string): void;
    [MutationTypes.SET_LOGGEDIN](state: S, payload: boolean): void;
    [MutationTypes.FORCE_CLOSE_BURGER_MENU](state: S, payload: boolean): void;
};

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_MODAL](state: State, payload: any) {
        state.modal = payload;
    },
    [MutationTypes.SET_LOGGEDIN](state: State, payload: boolean) {
        state.loggedIn = payload;
    },
    [MutationTypes.SET_USER](state: State, payload: Student | Lecturer | Admin) {
        state.user = payload;
    },
    [MutationTypes.FORCE_CLOSE_BURGER_MENU]() {
        //do nothing. Just force subscribers to act on it
    },
};
