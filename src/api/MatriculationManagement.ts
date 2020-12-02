import { useStore } from "@/use/store/store";
import { AxiosError, AxiosResponse } from "axios";
import APIError from "./api_models/errors/APIError";
import MatriculationData from "./api_models/matriculation_management/MatriculationData";
import SubjectMatriculation from "./api_models/matriculation_management/SubjectMatriculation";
import handleAuthenticationError from "./AuthenticationHelper";
import CommonHyperledger from "./CommonHyperledger";
import APIResponse from "./helpers/models/APIResponse";

export default class MatriculationManagement extends CommonHyperledger {
    protected static endpoint = "/matriculation-management";

    constructor() {
        super(MatriculationManagement.endpoint);
    }

    async updateMatriculationData(
        username: string,
        matriculation: SubjectMatriculation[]
    ): Promise<APIResponse<boolean | MatriculationData>> {
        let payload = { matriculation: matriculation };

        return await this._axios
            .put(`/${username}`, payload)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.status == 201 ? (response.data as MatriculationData) : true,
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
                        return await this.updateMatriculationData(username, matriculation);
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
}
