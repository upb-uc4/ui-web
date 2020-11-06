import Certificate from "@/api/api_models/certificate_management/Certificate";
import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";

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
};

export type State = typeof state;
