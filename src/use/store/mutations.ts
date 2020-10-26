import { MutationTypes } from "./mutation-types";
import { State } from "./state";
import { MutationTree } from "vuex";
import Student from "@/api/api_models/user_management/Student";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Admin from "@/api/api_models/user_management/Admin";
import Configuration from "@/api/api_models/configuration_management/Configuration";

export type Mutations<S = State> = {
    [MutationTypes.SET_USER](state: S, payload: Student | Lecturer | Admin): void;
    [MutationTypes.SET_MODAL](state: S, payload: string): void;
    [MutationTypes.SET_LOGGEDIN](state: S, payload: boolean): void;
    [MutationTypes.FORCE_CLOSE_BURGER_MENU](state: S, payload: boolean): void;
    [MutationTypes.FORCE_UPDATE_PROFILE_PICTURE](state: S, payload: boolean): void;
    [MutationTypes.SET_CONFIGURATION](state: S, payload: Configuration): void;
    [MutationTypes.SET_VALIDATION](state: S, payload: any): void;
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
    [MutationTypes.FORCE_UPDATE_PROFILE_PICTURE]() {
        //force update
    },
    [MutationTypes.FORCE_CLOSE_BURGER_MENU]() {
        //do nothing. Just force subscribers to act on it
    },
    [MutationTypes.SET_CONFIGURATION](state: State, payload: Configuration) {
        state.configuration = payload;
    },
    [MutationTypes.SET_VALIDATION](state: State, payload: any) {
        state.validation = payload;
    },
};
