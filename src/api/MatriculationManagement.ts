import { useStore } from "@/use/store/store";
import axios, { AxiosError, AxiosResponse } from "axios";
import APIError from "./api_models/errors/APIError";
import MatriculationData from "./api_models/matriculation_management/MatriculationData";
import SubjectMatriculation from "./api_models/matriculation_management/SubjectMatriculation";
import handleAuthenticationError from "./AuthenticationHelper";
import CommonHyperledger from "./CommonHyperledger";
import APIResponse from "./helpers/models/APIResponse";
import UnsignedProposalMessage from "./api_models/common/UnsignedProposalMessage";
import SignedProposalMessage from "./api_models/common/SignedProposalMessage";
import UnsignedTransactionMessage from "./api_models/common/UnsignedTransactionMessage";
import SignedTransactionMessage from "./api_models/common/SignedTransactionMessage";
import ServiceVersion from "@/api/helpers/models/ServiceVersion";

export default class MatriculationManagement extends CommonHyperledger {
    protected static endpoint = "/matriculation-management";

    constructor() {
        super(MatriculationManagement.endpoint);
    }

    /**
     * Fetch an unsigned proposal for matriculation
     * @param username username of student to matriculate
     * @param matriculation matriculation data
     */
    async getUnsignedMatriculationProposal(
        username: string,
        matriculation: SubjectMatriculation[]
    ): Promise<APIResponse<UnsignedProposalMessage>> {
        let payload = { matriculation: matriculation };

        return await this._axios
            .post(`/matriculation/${username}/unsigned_proposal`, payload)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.data as UnsignedProposalMessage,
                    networkError: false,
                    error: {} as APIError,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: {} as UnsignedProposalMessage,
                            networkError: false,
                        })
                    ) {
                        return await this.getUnsignedMatriculationProposal(username, matriculation);
                    }
                    return {
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        returnValue: {} as UnsignedProposalMessage,
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        error: {} as APIError,
                        returnValue: {} as UnsignedProposalMessage,
                        networkError: true,
                    };
                }
            });
    }

    async submitSignedMatriculationProposal(
        username: string,
        message: SignedProposalMessage
    ): Promise<APIResponse<UnsignedTransactionMessage>> {
        return await this._axios
            .post(`/matriculation/${username}/signed_proposal`, message)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.data,
                    networkError: false,
                    error: {} as APIError,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: {} as UnsignedTransactionMessage,
                            networkError: false,
                        })
                    ) {
                        return await this.submitSignedMatriculationProposal(username, message);
                    }
                    return {
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        returnValue: {} as UnsignedTransactionMessage,
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        error: {} as APIError,
                        returnValue: {} as UnsignedTransactionMessage,
                        networkError: true,
                    };
                }
            });
    }

    async submitSignedMatriculationTransaction(username: string, message: SignedTransactionMessage): Promise<APIResponse<boolean>> {
        return await this._axios
            .post(`/matriculation/${username}/signed_transaction`, message)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: true,
                    networkError: false,
                    error: {} as APIError,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: false,
                            networkError: false,
                        })
                    ) {
                        return await this.submitSignedMatriculationTransaction(username, message);
                    }
                    return {
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        returnValue: false,
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        error: {} as APIError,
                        returnValue: false,
                        networkError: true,
                    };
                }
            });
    }

    async getMatriculationHistory(username: string): Promise<APIResponse<MatriculationData>> {
        return await this._axios
            .get(`/history/${username}`)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data as MatriculationData,
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
                            returnValue: false,
                            networkError: false,
                        })
                    ) {
                        return await this.getMatriculationHistory(username);
                    }
                    return {
                        returnValue: {} as MatriculationData,
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        returnValue: {} as MatriculationData,
                        statusCode: 0,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    async getOwnMatriculationHistory(): Promise<APIResponse<MatriculationData>> {
        const store = useStore();
        const username = (await store.getters.user).username;
        return this.getMatriculationHistory(username);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    static getServiceVersion(): Promise<ServiceVersion> {
        return super.getServiceVersion().then(async (version: ServiceVersion) => {
            version.changelogURL = `https://github.com/upb-uc4/University-Credits-4.0/blob/matriculation-${version.version}/product_code/matriculation_service/CHANGELOG.md`;
            return version;
        });
    }
}
