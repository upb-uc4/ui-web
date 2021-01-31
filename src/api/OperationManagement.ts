import { useStore } from "@/use/store/store";
import { AxiosError, AxiosResponse } from "axios";
import SignedProposalMessage from "./api_models/common/SignedProposalMessage";
import SignedTransactionMessage from "./api_models/common/SignedTransactionMessage";
import UnsignedProposalMessage from "./api_models/common/UnsignedProposalMessage";
import UnsignedTransactionMessage from "./api_models/common/UnsignedTransactionMessage";
import APIError from "./api_models/errors/APIError";
import Operation from "./api_models/operation_management/Operation";
import handleAuthenticationError from "./AuthenticationHelper";
import CommonHyperledger from "./CommonHyperledger";
import APIResponse from "./helpers/models/APIResponse";

export default class OperationManagement extends CommonHyperledger {
    protected static endpoint = "/operation-management";

    constructor() {
        super(OperationManagement.endpoint);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    async getOperations(
        selfInitiated?: boolean,
        selfActionRequired?: boolean,
        states?: String[],
        watchlistOnly?: boolean
    ): Promise<APIResponse<Operation[]>> {
        const requestParameter = { params: {} as any };
        if (selfInitiated !== undefined) requestParameter.params.selfInitiated = selfInitiated;
        if (selfActionRequired !== undefined) requestParameter.params.selfActionRequired = selfActionRequired;
        if (states !== undefined) requestParameter.params.states = states.reduce((a, b) => a + "," + b, "");
        if (watchlistOnly !== undefined) requestParameter.params.watchlistOnly = watchlistOnly;

        return await this._axios
            .get(`/operations`, requestParameter)
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
                            returnValue: [] as Operation[],
                            networkError: false,
                        })
                    ) {
                        return await this.getOperations(selfInitiated, selfActionRequired, states, watchlistOnly);
                    }
                    return {
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        returnValue: [] as Operation[],
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        error: {} as APIError,
                        returnValue: [] as Operation[],
                        networkError: true,
                    };
                }
            });
    }

    async getOperation(operationId: string): Promise<APIResponse<Operation>> {
        return await this._axios
            .get(`/operations/${operationId}`)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.data,
                    networkError: false,
                    error: {} as APIError,
                };
            })
            .catch(async (error: AxiosError) => {
                console.log(error);
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: {} as Operation,
                            networkError: false,
                        })
                    ) {
                        return await this.getOperation(operationId);
                    }
                    return {
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        returnValue: {} as Operation,
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        error: {} as APIError,
                        returnValue: {} as Operation,
                        networkError: true,
                    };
                }
            });
    }

    async unwatchOperation(operationId: string): Promise<APIResponse<boolean>> {
        return await this._axios
            .delete(`/operations/${operationId}`)
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
                        return await this.unwatchOperation(operationId);
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

    async getUnsignedApprovalProposal(operationId: string): Promise<APIResponse<UnsignedProposalMessage>> {
        return await this._axios
            .post(`/operations/${operationId}/unsigned_proposal_approve`)
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
                            returnValue: {} as UnsignedProposalMessage,
                            networkError: false,
                        })
                    ) {
                        return await this.getUnsignedApprovalProposal(operationId);
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

    async watchOperation(operationId: string): Promise<APIResponse<boolean>> {
        const username = (await useStore().getters.user).username;
        return await this._axios
            .post(`/watchlist/${username}`, { id: operationId })
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
                        return await this.watchOperation(operationId);
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

    async getUnsignedRejectionProposal(operationId: string, rejectMessage: string): Promise<APIResponse<UnsignedProposalMessage>> {
        return await this._axios
            .post(`/operations/${operationId}/unsigned_proposal_reject`, { rejectMessage })
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
                            returnValue: {} as UnsignedProposalMessage,
                            networkError: false,
                        })
                    ) {
                        return await this.getUnsignedRejectionProposal(operationId, rejectMessage);
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

    async submitSignedProposal(message: SignedProposalMessage): Promise<APIResponse<UnsignedTransactionMessage>> {
        return await this._axios
            .post(`/operations/signed_proposal`, message)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.data,
                    networkError: false,
                    error: {} as APIError,
                };
            })
            .catch(async (error: AxiosError) => {
                console.log(error);
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: {} as UnsignedTransactionMessage,
                            networkError: false,
                        })
                    ) {
                        return await this.submitSignedProposal(message);
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

    async submitSignedTransaction(message: SignedTransactionMessage): Promise<APIResponse<boolean>> {
        return await this._axios
            .post(`/operations/signed_transaction`, message)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: true,
                    networkError: false,
                    error: {} as APIError,
                };
            })
            .catch(async (error: AxiosError) => {
                console.log(error);
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: false,
                            networkError: false,
                        })
                    ) {
                        return await this.submitSignedTransaction(message);
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
}
