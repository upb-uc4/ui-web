import Certificate from "@/api/api_models/certificate_management/Certificate";
import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import CertificateManagement from "@/api/CertificateManagement";
import { useToast } from "@/toast";
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
    privateKey(state: State): () => Promise<CryptoKey>;
    certificate(state: State): () => Promise<Certificate>;
    hasCertificate(state: State): Promise<boolean>;
    treatedOperations(state: State): any;
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
    privateKey: (state) => async () => {
        if (!("type" in state.privateKey)) {
            const store = useStore();
            const certManagement = new CertificateManagement();

            const keyResponse = await certManagement.getEncryptedPrivateKey((await store.getters.user).username);

            const handler = new GenericResponseHandler("certificate");
            const encryptedPrivateKey = handler.handleResponse(keyResponse);

            if (encryptedPrivateKey.key != undefined && encryptedPrivateKey.key != "") {
                // we saved a key at lagom
                const privateKey: CryptoKey = await state.decryptPrivateKeyModal(encryptedPrivateKey);

                if (privateKey.type == undefined) {
                    return Promise.reject("Could not decrypt private key");
                }

                store.commit(MutationTypes.SET_PRIVATE_KEY, privateKey);
            } else {
                // no key saved at lagom
                if (state.certificate.certificate) {
                    const toast = useToast();
                    toast.error(
                        "Something went wrong. this user does not have an encrypted private key saved but has a certificate. Please report this."
                    );
                } else {
                    // create certificate
                    const certificate = await store.dispatch(ActionTypes.CREATE_CERTIFICATE, undefined).catch((reason) => {
                        store.commit(MutationTypes.SET_HAS_CERTIFICATE, false);
                        return undefined;
                    });

                    if (!certificate) return Promise.reject("Could not create certificate.");

                    const keyResponse = await certManagement.getEncryptedPrivateKey((await store.getters.user).username);
                    const encryptedPrivateKey = handler.handleResponse(keyResponse);
                    const privateKey: CryptoKey = await state.decryptPrivateKeyModal(encryptedPrivateKey);

                    store.commit(MutationTypes.SET_PRIVATE_KEY, privateKey);
                }
            }
        }
        return state.privateKey;
    },
    certificate: (state) => async () => {
        if (state.certificate.certificate == undefined || state.certificate.certificate == "") {
            const store = useStore();
            const certManagement = new CertificateManagement();

            const certificateResponse = await certManagement.getCertificate((await store.getters.user).username);
            if (certificateResponse.statusCode == 404) {
                return await store.dispatch(ActionTypes.CREATE_CERTIFICATE, undefined).catch((reason) => {
                    store.commit(MutationTypes.SET_HAS_CERTIFICATE, false);
                    return Promise.reject("Could not create certificate.");
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
    treatedOperations: (state) => {
        return state.treatedOperations;
    },
};
