import Certificate from "@/api/api_models/certificate_management/Certificate";
import EncryptedPrivateKey from "@/api/api_models/certificate_management/EncryptedPrivateKey";
import CertificateManagement from "@/api/CertificateManagement";
import { arrayBufferToBase64, createCSR, createKeyPair, deriveKeyFromPassword, wrapKey } from "@/use/crypto/certificates";
import { ActionContext, ActionTree } from "vuex";
import GenericResponseHandler from "../helpers/GenericResponseHandler";
import { ActionTypes } from "./action-types";
import { MutationTypes } from "./mutation-types";
import { Mutations } from "./mutations";
import { State } from "./state";
import { useStore } from "./store";

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

export interface Actions {
    [ActionTypes.CREATE_CERTIFICATE]({ commit }: AugmentedActionContext, payload: void): Promise<Certificate>;
}

export const actions: ActionTree<State, State> & Actions = {
    async [ActionTypes.CREATE_CERTIFICATE]({ commit }) {
        const certificateManagement = new CertificateManagement();
        const store = useStore();
        const keypair = await createKeyPair();

        const username = (await store.getters.user).username;
        const response = await certificateManagement.getEnrollmentId(username);

        const enrollmentId = response.returnValue.id;
        const csr = await createCSR(keypair, enrollmentId);

        const password = await store.state.encryptPrivateKeyModal();

        if (password == "") {
            commit(MutationTypes.SET_HAS_CERTIFICATE, false);
            return Promise.reject("No password provided");
        }

        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        const wrappingKey = await deriveKeyFromPassword(password);
        const wrappedKey = await wrapKey(keypair.privateKey, wrappingKey.key, iv);
        const wrappedKeyBase64 = arrayBufferToBase64(wrappedKey);
        const keyInfo: EncryptedPrivateKey = { key: wrappedKeyBase64, iv: arrayBufferToBase64(iv), salt: wrappingKey.salt };

        const csrResponse = await certificateManagement.sendCertificateSigningRequest(username, csr, keyInfo);
        const handler = new GenericResponseHandler("certificate");

        const certificate = handler.handleResponse(csrResponse);

        commit(MutationTypes.SET_CERTIFICATE, certificate);
        if (certificate.certificate != "") {
            commit(MutationTypes.SET_HAS_CERTIFICATE, true);
        }
        return certificate;
    },
};
