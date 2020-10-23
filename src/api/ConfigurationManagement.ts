import Common from "./Common";
import APIResponse from "./helpers/models/APIResponse";
import APIError from "./api_models/errors/APIError";
import axios, { AxiosResponse, AxiosError } from "axios";
import handleAuthenticationError from "./AuthenticationHelper";
import Configuration from "./api_models/configuration_management/Configuration";
import HyperledgerVersion from "./api_models/configuration_management/HyperledgerVersion";

export default class ConfigurationManagement extends Common {
    constructor() {
        super("/configuration-management");
    }

    static async getVersion(): Promise<string> {
        return super.getVersion("/configuration-management");
    }

    static async getHyperledgerVersion(): Promise<HyperledgerVersion> {
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + "/configuration-management",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });

        return await instance
            .get(`/version/hyperledger`)
            .then((response: AxiosResponse) => {
                return response.data as HyperledgerVersion;
            })
            .catch((error: AxiosError) => {
                return { apiVersion: "unavailable", chaincodeVersion: "unavailable", networkVersion: "unavailable" } as HyperledgerVersion;
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
