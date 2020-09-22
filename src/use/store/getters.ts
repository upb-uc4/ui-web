import { GetterTree } from "vuex";
import { State, state } from "./state";
import { Role } from "@/entities/Role";
import UserManagement from "@/api/UserManagement";
import { useStore } from "./store";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import { MutationTypes } from "./mutation-types";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Admin from "@/api/api_models/user_management/Admin";
import Student from "@/api/api_models/user_management/Student";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import { getCrypto } from "pkijs/src/common";
//import CertificateManagement from '@/api/CertificateManagement.ts';

//example code: https://dev.to/3vilarthas/vuex-typescript-m4j
export type Getters = {
    user(state: State): Promise<Student | Lecturer | Admin>;
    loggedIn(state: State): boolean;
    privateKey(state: State): Promise<CryptoKey>;
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
    privateKey: async (state) => {
        if (!("type" in state.privateKey)) {
            const store = useStore();
            const crypto = getCrypto();

            if (crypto == null) {
                return Promise.reject("No WebCrypto extension found");
            }

            //const certManagement = new CertificateManagement();

            //const encryptedKey = certManagement.getEncryptedPrivateKey((await store.getters.user).username);

            //crypto.importKey()
        }
        return state.privateKey;
    },
};
