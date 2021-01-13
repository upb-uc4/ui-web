import APIResponse from "./helpers/models/APIResponse";
import { AxiosResponse, AxiosError } from "axios";
import APIError from "./api_models/errors/APIError";
import Certificate from "./api_models/certificate_management/Certificate";
import EnrollmentId from "./api_models/certificate_management/EnrollmentId";
import EncryptedPrivateKey from "./api_models/certificate_management/EncryptedPrivateKey";
import handleAuthenticationError from "./AuthenticationHelper";
import CommonHyperledger from "./CommonHyperledger";
import ServiceVersion from "@/api/helpers/models/ServiceVersion";
import { useStore } from "@/use/store/store";

export default class CertificateManagement extends CommonHyperledger {
    protected static endpoint = "/certificate-management";

    constructor() {
        super(CertificateManagement.endpoint);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    static getServiceVersion(): Promise<ServiceVersion> {
        return super.getServiceVersion().then(async (version: ServiceVersion) => {
            //todo inject the hyperledger version in the promise
            version.changelogURL = `https://github.com/upb-uc4/University-Credits-4.0/blob/certificate-${version.version}/product_code/certificate_service/CHANGELOG.md`;
            return version;
        });
    }

    async getCertificate(username: string): Promise<APIResponse<Certificate>> {
        return await this._axios
            .get(`/certificates/${username}/certificate`)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data as Certificate,
                    statusCode: response.status,
                    error: {} as APIError,
                    networkError: false,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: {} as Certificate,
                            networkError: false,
                        })
                    ) {
                        return await this.getCertificate(username);
                    }
                    return {
                        returnValue: {} as Certificate,
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        returnValue: {} as Certificate,
                        statusCode: 0,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    async getOwnEnrollmentId(): Promise<APIResponse<EnrollmentId>> {
        const username = (await useStore().getters.user).username;
        return this.getEnrollmentId(username);
    }

    async getEnrollmentId(username: string): Promise<APIResponse<EnrollmentId>> {
        return await this._axios
            .get(`/certificates/${username}/enrollmentId`)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data as EnrollmentId,
                    statusCode: response.status,
                    error: {} as APIError,
                    networkError: false,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: {} as EnrollmentId,
                            networkError: false,
                        })
                    ) {
                        return await this.getEnrollmentId(username);
                    }
                    return {
                        returnValue: {} as EnrollmentId,
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        returnValue: {} as EnrollmentId,
                        statusCode: 0,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    async getEncryptedPrivateKey(username: string): Promise<APIResponse<EncryptedPrivateKey>> {
        return await this._axios
            .get(`/certificates/${username}/privateKey`)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data as EncryptedPrivateKey,
                    statusCode: response.status,
                    error: {} as APIError,
                    networkError: false,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: {} as EncryptedPrivateKey,
                            networkError: false,
                        })
                    ) {
                        return await this.getEncryptedPrivateKey(username);
                    }
                    return {
                        returnValue: {} as EncryptedPrivateKey,
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        returnValue: {} as EncryptedPrivateKey,
                        statusCode: 0,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    async sendCertificateSigningRequest(
        username: string,
        csr: string,
        encryptedPrivateKey?: EncryptedPrivateKey
    ): Promise<APIResponse<Certificate>> {
        let encPrivKey = encryptedPrivateKey != undefined ? encryptedPrivateKey : { iv: "", salt: "", key: "" };

        return await this._axios
            .post(`/certificates/${username}`, { certificateSigningRequest: csr, encryptedPrivateKey: encPrivKey })
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data as Certificate,
                    statusCode: response.status,
                    error: {} as APIError,
                    networkError: false,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: {} as Certificate,
                            networkError: false,
                        })
                    ) {
                        return await this.sendCertificateSigningRequest(username, csr, encryptedPrivateKey);
                    }
                    return {
                        returnValue: {} as Certificate,
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        returnValue: {} as Certificate,
                        statusCode: 0,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }
}
