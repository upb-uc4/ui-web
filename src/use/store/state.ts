import Certificate from "@/api/api_models/certificate_management/Certificate";
import Configuration from "@/api/api_models/configuration_management/Configuration";
import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import PKICertificate from "pkijs/src/Certificate";

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
    processedOperations: {
        approved: [] as string[],
        rejected: [] as string[],
    } as processedOperations,
    caCerts: [] as PKICertificate[],
};

export type State = typeof state;

export interface processedOperations {
    approved: string[];
    rejected: string[];
}

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
    processedOperations: {
        approved: [] as string[],
        rejected: [] as string[],
    } as any,
    caCerts: [],
};
