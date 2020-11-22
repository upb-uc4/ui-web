import Certificate from "@/api/api_models/certificate_management/Certificate";
import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import { MutationTree } from "vuex";
import { MutationTypes } from "./mutation-types";
import defaultState, { State } from "./state";

export type Mutations<S = State> = {
    [MutationTypes.SET_USER](state: S, payload: Student | Lecturer | Admin): void;
    [MutationTypes.SET_MODAL](state: S, payload: any): void;
    [MutationTypes.SET_DECRYPT_PRIVATE_KEY_MODAL](state: S, payload: any): void;
    [MutationTypes.SET_ENCRYPT_PRIVATE_KEY_MODAL](state: S, payload: any): void;
    [MutationTypes.SET_LOGGEDIN](state: S, payload: boolean): void;
    [MutationTypes.SET_CERTIFICATE](state: S, payload: Certificate): void;
    [MutationTypes.SET_PRIVATE_KEY](state: S, payload: CryptoKey): void;
    [MutationTypes.FORCE_CLOSE_BURGER_MENU](state: S, payload: boolean): void;
    [MutationTypes.FORCE_UPDATE_PROFILE_PICTURE](state: S, payload: boolean): void;
    [MutationTypes.SET_HAS_CERTIFICATE](state: S, payload: boolean): void;
    [MutationTypes.RESET_STATE](state: S, payload: boolean): void;
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
    [MutationTypes.FORCE_UPDATE_PROFILE_PICTURE]() {
        //force update
    },
    [MutationTypes.FORCE_CLOSE_BURGER_MENU]() {
        //do nothing. Just force subscribers to act on it
    },
    [MutationTypes.SET_HAS_CERTIFICATE](state: State, payload: boolean) {
        state.hasCertificate = payload;
    },
    [MutationTypes.RESET_STATE](state: State) {
        Object.assign(state, defaultState);
    },
};
