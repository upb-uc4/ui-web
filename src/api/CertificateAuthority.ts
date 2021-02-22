import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import ServiceVersion from "@/api/helpers/models/ServiceVersion";
import APIResponse from "./helpers/models/APIResponse";
import APIError from "./api_models/errors/APIError";

export default class CertificateAuthority {
    _axios: AxiosInstance;

    constructor() {
        const instance = axios.create({
            baseURL: process.env.VUE_APP_CA_BASE_URL,
            headers: {
                Accept: "*/*",
            },
            withCredentials: false,
        });
        delete instance.defaults.headers.common.Authorization;

        this._axios = instance;
    }

    async getAllCACertificates(): Promise<string[]> {
        const caNames = ["org0", "org1", "org2", "tls"];
        const promises = [];
        for (let caName of caNames) {
            promises.push(this.getCertificate(caName));
        }

        const responses = await Promise.all(promises);
        const values = responses
            .map((e) => {
                return e.returnValue;
            })
            .filter((e) => e != "");

        return values;
    }

    async getCertificate(caName: string): Promise<APIResponse<string>> {
        return await this._axios
            .get(`/ca/${caName}-cert.pem`)
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
}
