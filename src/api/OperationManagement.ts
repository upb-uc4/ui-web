import { AxiosError, AxiosResponse } from "axios";
import UnsignedProposalMessage from "./api_models/common/UnsignedProposalMessage";
import APIError from "./api_models/errors/APIError";
import Operation from "./api_models/operation_management/Operation";
import handleAuthenticationError from "./AuthenticationHelper";
import CommonHyperledger from "./CommonHyperledger";
import APIResponse from "./helpers/models/APIResponse";

export default class OperationManagement extends CommonHyperledger {
    protected static endpoint = "/operation-management";
    protected static serviceIdentifier = "operation";

    constructor() {
        super(OperationManagement.endpoint, OperationManagement.serviceIdentifier);
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
}
