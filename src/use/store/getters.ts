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
import CertificateManagement from "@/api/CertificateManagement";
import EncryptedPrivateKey from "@/api/api_models/certificate_management/EncryptedPrivateKey";
import { unwrapKey, base64ToArrayBuffer, deriveKeyFromPassword, privateKeyToPemString } from "@/use/crypto/certificates";
import Certificate from "@/api/api_models/certificate_management/Certificate";
import { ActionTypes } from "./action-types";

//example code: https://dev.to/3vilarthas/vuex-typescript-m4j
export type Getters = {
    user(state: State): Promise<Student | Lecturer | Admin>;
    loggedIn(state: State): boolean;
    privateKey(state: State): Promise<CryptoKey>;
    certificate(state: State): Promise<Certificate>;
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
                return await store.dispatch(ActionTypes.CREATE_CERTIFICATE, undefined);
            } else {
                store.commit(MutationTypes.SET_CERTIFICATE, certificateResponse.returnValue);
            }
        }
        return state.certificate;
    },
};
