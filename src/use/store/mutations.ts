import { MutationTypes } from "./mutation-types";
import { State } from "./state";
import { MutationTree } from "vuex";
import { Role } from "@/entities/Role";
import Student from "@/api/api_models/user_management/Student";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Admin from "@/api/api_models/user_management/Admin";

export type Mutations<S = State> = {
    [MutationTypes.SET_USER](state: S, payload: Student | Lecturer | Admin): void;
    [MutationTypes.SET_ROLE](state: S, payload: string): void;
    [MutationTypes.SET_MODAL](state: S, payload: string): void;
    [MutationTypes.SET_LOGGEDIN](state: S, payload: boolean): void;
    [MutationTypes.SET_LOGINDATA](state: S, payload: { username: string; password: string }): void;
};

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_MODAL](state: State, payload: any) {
        state.modal = payload;
    },
    [MutationTypes.SET_LOGGEDIN](state: State, payload: boolean) {
        state.loggedIn = payload;
    },
    [MutationTypes.SET_ROLE](state: State, payload: Role) {
        state.myRole = payload;
    },
    [MutationTypes.SET_LOGINDATA](state: State, payload: { username: string; password: string }) {
        state.loginData = payload;
    },
    [MutationTypes.SET_USER](state: State, payload: Student | Lecturer | Admin) {
        state.user = payload;
    },
};