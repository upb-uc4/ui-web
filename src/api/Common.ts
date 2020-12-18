import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import ServiceVersion from "@/api/helpers/models/ServiceVersion";

export default class Common {
    protected static endpoint = "";
    _axios: AxiosInstance;

    constructor(endpoint: string) {
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + endpoint,
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
            withCredentials: true,
        });

        this._axios = instance;
    }

    static async getVersion(): Promise<string> {
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + this.endpoint,
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });

        return await instance
            .get(`/version`)
            .then((response: AxiosResponse) => {
                return response.data.serviceVersion ? response.data.serviceVersion : "endpoint broken";
            })
            .catch((error: AxiosError) => {
                return "unavailable";
            });
    }

    //todo replace getVersion
    static getServiceVersion(): Promise<ServiceVersion> {
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + this.endpoint,
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });

        //do not catch here but let caller handle errors
        return instance.get(`/version`).then((response: AxiosResponse) => {
            if (response.data.serviceVersion) {
                return {
                    version: response.data.serviceVersion,
                };
            } else {
                throw new Error("Endpoint Broken");
            }
        });
    }
}
