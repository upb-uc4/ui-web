import { MutationTypes } from "./mutation-types";
import { State } from "./state";
import { MutationTree } from "vuex";
import Student from "@/api/api_models/user_management/Student";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Admin from "@/api/api_models/user_management/Admin";
import Certificate from "@/api/api_models/certificate_management/Certificate";

export type Mutations<S = State> = {
    [MutationTypes.SET_USER](state: S, payload: Student | Lecturer | Admin): void;
    [MutationTypes.SET_MODAL](state: S, payload: any): void;
    [MutationTypes.SET_DECRYPT_PRIVATE_KEY_MODAL](state: S, payload: any): void;
    [MutationTypes.SET_ENCRYPT_PRIVATE_KEY_MODAL](state: S, payload: any): void;
    [MutationTypes.SET_LOGGEDIN](state: S, payload: boolean): void;
    [MutationTypes.SET_CERTIFICATE](state: S, payload: Certificate): void;
    [MutationTypes.SET_PRIVATE_KEY](state: S, payload: CryptoKey): void;
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
    [MutationTypes.SET_DECRYPT_PRIVATE_KEY_MODAL](state: State, payload: any) {
        state.decryptPrivateKeyModal = payload;
    },
    [MutationTypes.SET_ENCRYPT_PRIVATE_KEY_MODAL](state: State, payload: any) {
        state.encryptPrivateKeyModal = payload;
    },
    [MutationTypes.SET_CERTIFICATE](state: State, payload: Certificate) {
        state.certificate = payload;
    },
    [MutationTypes.SET_PRIVATE_KEY](state: State, payload: CryptoKey) {
        state.privateKey = payload;
    },
};
