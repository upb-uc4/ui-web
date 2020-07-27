import { MutationTypes } from "./mutation-types";
import { State } from "./state";
import { MutationTree } from "vuex";
import { Role } from "@/entities/Role";

export type Mutations<S = State> = {
    [MutationTypes.SET_ID](state: S, payload: string): void;
    [MutationTypes.SET_ROLE](state: S, payload: string): void;
    [MutationTypes.SET_LOGINDATA](state: S, payload: { username: string; password: string }): void;
};

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_ID](state: State, payload: string) {
        state.myId = payload;
    },
    [MutationTypes.SET_ROLE](state: State, payload: Role) {
        state.myRole = payload;
    },
    [MutationTypes.SET_LOGINDATA](state: State, payload: { username: string; password: string }) {
        state.loginData = payload;
    },
};
