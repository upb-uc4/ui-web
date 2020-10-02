import { ActionTree, ActionContext } from "vuex";
import { State } from "./state";
import { Mutations } from "./mutations";
import { ActionTypes } from "./action-types";
import { MutationTypes } from "./mutation-types";
import Certificate from "@/api/api_models/certificate_management/Certificate";
import { wrapKey, deriveKeyFromPassword, createCSR, createKeyPair, arrayBufferToBase64 } from "@/use/crypto/certificates";
import CertificateManagement from "@/api/CertificateManagement";
import { useStore } from "./store";
import EncryptedPrivateKey from "@/api/api_models/certificate_management/EncryptedPrivateKey";
import GenericResponseHandler from "../helpers/GenericResponseHandler";

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
            return Promise.reject("No password provided");
        }

        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        const wrappingKey = await deriveKeyFromPassword(password);

        const wrappedKey = await wrapKey(keypair.privateKey, wrappingKey.key, iv);
        const wrappedKeyBase64 = arrayBufferToBase64(wrappedKey);

        const keyInfo: EncryptedPrivateKey = { key: wrappedKeyBase64, iv: arrayBufferToBase64(iv), salt: wrappingKey.salt };

        const csrResponse = await certificateManagement.sendCertificateSigningRequest(username, csr, keyInfo);
        const handler = new GenericResponseHandler();

        const certificate = handler.handleResponse(csrResponse);

        commit(MutationTypes.SET_CERTIFICATE, certificate);
        return certificate;
    },
};
