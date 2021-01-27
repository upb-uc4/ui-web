import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import ServiceVersion from "@/api/helpers/models/ServiceVersion";

export default class Common {
    protected static endpoint = "";
    protected serviceIdentifier = "";
    _axios: AxiosInstance;

    constructor(endpoint: string, serviceIdentifier: string) {
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + endpoint,
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
            withCredentials: true,
        });

        this._axios = instance;
        this.serviceIdentifier = serviceIdentifier;
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

    getServiceVersion(): Promise<ServiceVersion> {
        return this._axios.get(`/version`).then((response: AxiosResponse) => {
            if (response.data.serviceVersion) {
                const serviceVersion: ServiceVersion = {
                    version: response.data.serviceVersion,
                    changelogURL: `https://github.com/upb-uc4/University-Credits-4.0/blob/${this.serviceIdentifier}-${response.data.serviceVersion}/product_code/${this.serviceIdentifier}_service/CHANGELOG.md`,
                };
                return serviceVersion;
            } else {
                throw new Error("Endpoint Broken");
            }
        });
    }
}
