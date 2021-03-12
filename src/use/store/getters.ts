import Certificate from "@/api/api_models/certificate_management/Certificate";
import Configuration from "@/api/api_models/configuration_management/Configuration";
import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import CertificateAuthority from "@/api/CertificateAuthority";
import CertificateManagement from "@/api/CertificateManagement";
import ConfigurationManagement from "@/api/ConfigurationManagement";
import { Role } from "@/entities/Role";
import { useToast } from "@/toast";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import CertificatePKI from "pkijs/src/Certificate";
import * as pvutils from "pvutils";
import { GetterTree } from "vuex";
import { ActionTypes } from "./action-types";
import { MutationTypes } from "./mutation-types";
import { processedOperations, State } from "./state";
import { store, useStore } from "./store";
import * as asn1js from "asn1js";
import { validateCertificate } from "../crypto/certificateValidation";

//example code: https://dev.to/3vilarthas/vuex-typescript-m4j
export type Getters = {
    user(state: State): Promise<Student | Lecturer | Admin>;
    loggedIn(state: State): boolean;
    role(state: State): Promise<Role>;
    validation(state: State): Promise<any>;
    configuration(state: State): Promise<Configuration>;
    privateKey(state: State): () => Promise<CryptoKey>;
    certificate(state: State): () => Promise<Certificate>;
    hasCertificate(state: State): Promise<boolean>;
    processedOperations(state: State): processedOperations;
    getCACertificates(state: State): () => Promise<CertificatePKI[]>;
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
    validation: async (state) => {
        if (isEmpty(state.validation)) {
            const response = await new ConfigurationManagement().getValidation();
            const handler = new GenericResponseHandler("validation");
            const validation = handler.handleResponse(response);
            if (Object.keys(validation).length !== 0) {
                store.commit(MutationTypes.SET_VALIDATION, validation);
            } else {
                Promise.reject("Validation not loaded.");
            }
        }
        return state.validation;
    },
    configuration: async (state) => {
        if (state.configuration.courseTypes == undefined) {
            const response = await new ConfigurationManagement().getConfiguration();
            const handler = new GenericResponseHandler("configuration");
            const config = handler.handleResponse(response);
            if (Object.keys(config).length !== 0) {
                store.commit(MutationTypes.SET_CONFIGURATION, config);
            } else {
                Promise.reject("Configuration not loaded.");
            }
        }
        return state.configuration;
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
                const ownCertificate = certificateResponse.returnValue;

                const ownCertPem = ownCertificate.certificate.replace(/(-----(BEGIN|END) CERTIFICATE-----|\r|\n)/g, "");
                const berUser = pvutils.stringToArrayBuffer(pvutils.fromBase64(ownCertPem));
                const asn1User = asn1js.fromBER(berUser);
                const cert = new CertificatePKI({ schema: asn1User.result });

                const valid = await validateCertificate(cert);
                if (!valid) {
                    return Promise.reject("Invalid remote certificate signature.");
                }

                store.commit(MutationTypes.SET_CERTIFICATE, ownCertificate);
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
    processedOperations: (state) => {
        return state.processedOperations;
    },
    getCACertificates: (state) => async () => {
        if (state.caCerts.length == 0) {
            const caManagement = new CertificateAuthority();
            const certs = await caManagement.getAllCACertificates();
            const caCerts = certs.map((certPem) => {
                const cert = certPem.replace(/(-----(BEGIN|END) CERTIFICATE-----|\r|\n)/g, "");
                const berCA = pvutils.stringToArrayBuffer(pvutils.fromBase64(cert));
                const asn1CA = asn1js.fromBER(berCA);
                const caCert = new CertificatePKI({ schema: asn1CA.result });
                return caCert;
            });

            store.commit(MutationTypes.ADD_CA_CERTIFICATES, caCerts);
        }

        return state.caCerts;
    },
};

let isEmpty = (obj: any) => {
    if (typeof obj === "object" && obj != null) {
        return Object.keys(obj).length >= 1 ? false : true;
    }
    return true;
};
