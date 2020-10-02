import { Role } from "@/entities/Role";
import { Ref, ref } from "vue";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import Admin from "@/api/api_models/user_management/Admin";
import Certificate from "@/api/api_models/certificate_management/Certificate";

export const state = {
    apiUrl: "",
    user: {} as Student | Lecturer | Admin,
    loggedIn: false,
    modal: {} as any,
    privateKey: {} as CryptoKey,
    decryptPrivateKeyModal: {} as any,
    encryptPrivateKeyModal: {} as any,
    certificate: {} as Certificate,
};

export type State = typeof state;
