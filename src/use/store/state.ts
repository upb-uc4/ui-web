import Certificate from "@/api/api_models/certificate_management/Certificate";
import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import Configuration from "@/api/api_models/configuration_management/Configuration";

export const state = {
    apiUrl: "",
    user: {} as Student | Lecturer | Admin,
    loggedIn: false,
    modal: {} as any,
    privateKey: {} as CryptoKey,
    decryptPrivateKeyModal: {} as any,
    encryptPrivateKeyModal: {} as any,
    certificate: {} as Certificate,
    hasCertificate: false,
    validation: {},
    configuration: {} as Configuration,
    treatedOperations: {
        approved: [] as string[],
        rejected: [] as string[],
    } as any,
};

export type State = typeof state;

export default {
    apiUrl: "",
    user: {} as Student | Lecturer | Admin,
    loggedIn: false,
    modal: {} as any,
    privateKey: {} as CryptoKey,
    decryptPrivateKeyModal: {} as any,
    encryptPrivateKeyModal: {} as any,
    certificate: {} as Certificate,
    hasCertificate: false,
    treatedOperations: {
        approved: [] as string[],
        rejected: [] as string[],
    } as any,
};
