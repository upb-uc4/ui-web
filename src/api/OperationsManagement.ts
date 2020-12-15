import { AxiosError, AxiosResponse } from "axios";
import APIError from "./api_models/errors/APIError";
import Operation from "./api_models/operations_management/Operation";
import handleAuthenticationError from "./AuthenticationHelper";
import CommonHyperledger from "./CommonHyperledger";
import APIResponse from "./helpers/models/APIResponse";

export default class OperationsManagement extends CommonHyperledger {
    protected static endpoint = "/operations-management";

    constructor() {
        super(OperationsManagement.endpoint);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    async getOperations(
        username?: string,
        onlyOwn?: boolean,
        onlyWorkable?: boolean,
        archived?: boolean
    ): Promise<APIResponse<Operation[]>> {
        const requestParameter = { params: {} as any };
        if (username) requestParameter.params.username = username;
        if (onlyOwn !== undefined) requestParameter.params.onlyOwn = onlyOwn;
        if (onlyWorkable !== undefined) requestParameter.params.onlyWorkable = onlyWorkable;
        if (archived !== undefined) requestParameter.params.archived = archived;

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
                        return await this.getOperations(username);
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

    async archiveOperation(operationId: string): Promise<APIResponse<boolean>> {
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
                        return await this.archiveOperation(operationId);
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
