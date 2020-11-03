import Certificate from "@/api/api_models/certificate_management/Certificate";
import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import CertificateManagement from "@/api/CertificateManagement";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import { GetterTree } from "vuex";
import { ActionTypes } from "./action-types";
import { MutationTypes } from "./mutation-types";
import { State } from "./state";
import { useStore } from "./store";

//example code: https://dev.to/3vilarthas/vuex-typescript-m4j
export type Getters = {
    user(state: State): Promise<Student | Lecturer | Admin>;
    loggedIn(state: State): boolean;
    privateKey(state: State): Promise<CryptoKey>;
    certificate(state: State): Promise<Certificate>;
    hasCertificate(state: State): Promise<boolean>;
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
            const certManagement = new CertificateManagement();

            const keyResponse = await certManagement.getEncryptedPrivateKey((await store.getters.user).username);
            const handler = new GenericResponseHandler();
            const encryptedPrivateKey = handler.handleResponse(keyResponse);

            if (encryptedPrivateKey.key != undefined && encryptedPrivateKey.key != "") {
                // we saved a key at lagom
                const privateKey: CryptoKey = await state.decryptPrivateKeyModal(encryptedPrivateKey);

                if (privateKey.type == undefined) {
                    Promise.reject("Could not decrypt private key");
                }

                store.commit(MutationTypes.SET_PRIVATE_KEY, privateKey);
            }
        }
        return state.privateKey;
    },
    certificate: async (state) => {
        if (state.certificate.certificate == undefined || state.certificate.certificate == "") {
            const store = useStore();
            const certManagement = new CertificateManagement();

            const certificateResponse = await certManagement.getCertificate((await store.getters.user).username);
            if (certificateResponse.statusCode == 404) {
                return await store.dispatch(ActionTypes.CREATE_CERTIFICATE, undefined).catch((reason) => {
                    store.commit(MutationTypes.SET_HAS_CERTIFICATE, false);
                    return { certificate: "" };
                });
            } else {
                store.commit(MutationTypes.SET_CERTIFICATE, certificateResponse.returnValue);
            }
        }
        return state.certificate;
    },
    hasCertificate: async (state) => {
        const store = useStore();
        const certManagement = new CertificateManagement();

        const certificateResponse = await certManagement.getCertificate((await store.getters.user).username);
        if (certificateResponse.statusCode == 404) {
            store.commit(MutationTypes.SET_HAS_CERTIFICATE, false);
        } else {
            store.commit(MutationTypes.SET_CERTIFICATE, certificateResponse.returnValue);
            store.commit(MutationTypes.SET_HAS_CERTIFICATE, true);
        }
        return state.hasCertificate;
    },
};
