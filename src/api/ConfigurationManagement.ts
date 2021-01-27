import axios, { AxiosError, AxiosResponse } from "axios";
import Configuration from "./api_models/configuration_management/Configuration";
import HyperledgerNetworkVersion from "./api_models/configuration_management/HyperledgerVersion";
import APIError from "./api_models/errors/APIError";
import Common from "./Common";
import APIResponse from "./helpers/models/APIResponse";

export default class ConfigurationManagement extends Common {
    protected static endpoint = "/configuration-management";
    protected static serviceIdentifier = "configuration";

    constructor() {
        super(ConfigurationManagement.endpoint, ConfigurationManagement.serviceIdentifier);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    static async getHyperledgerNetworkVersion(): Promise<HyperledgerNetworkVersion> {
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + ConfigurationManagement.endpoint,
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });

        return await instance
            .get(`/version/hyperledger-network`)
            .then((response: AxiosResponse) => {
                return response.data as HyperledgerNetworkVersion;
            })
            .catch((error: AxiosError) => {
                return { networkVersion: "unavailable" } as HyperledgerNetworkVersion;
            });
    }

    async getConfiguration(): Promise<APIResponse<Configuration>> {
        return await this._axios
            .get(`/configuration`)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data as Configuration,
                    statusCode: response.status,
                    networkError: false,
                    error: {} as APIError,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    return {
                        returnValue: {} as Configuration,
                        statusCode: error.response.status,
                        networkError: false,
                        error: error.response.data as APIError,
                    };
                } else {
                    return {
                        returnValue: {} as Configuration,
                        statusCode: 0,
                        networkError: true,
                        error: {} as APIError,
                    };
                }
            });
    }

    /**
     *
     * @param date must be in format YYYY-MM-DD
     */
    async getSemester(date: string): Promise<APIResponse<string>> {
        const requestParameter = { params: {} as any };
        requestParameter.params.date = date;
        return await this._axios
            .get(`/semester`, requestParameter)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data.semester,
                    statusCode: response.status,
                    networkError: false,
                    error: {} as APIError,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    return {
                        returnValue: "",
                        statusCode: error.response.status,
                        networkError: false,
                        error: error.response.data as APIError,
                    };
                } else {
                    return {
                        returnValue: "",
                        statusCode: 0,
                        networkError: true,
                        error: {} as APIError,
                    };
                }
            });
    }

    async getCurrentSemester(): Promise<APIResponse<string>> {
        const today = new Date().toISOString().slice(0, 10);
        return await this.getSemester(today);
    }

    async getValidation(): Promise<APIResponse<any>> {
        return await this._axios
            .get(`/validation`)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data,
                    statusCode: response.status,
                    networkError: false,
                    error: {} as APIError,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    return {
                        returnValue: {},
                        statusCode: error.response.status,
                        networkError: false,
                        error: error.response.data as APIError,
                    };
                } else {
                    return {
                        returnValue: {},
                        statusCode: 0,
                        networkError: true,
                        error: {} as APIError,
                    };
                }
            });
    }
}
