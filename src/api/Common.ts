import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export default class Common {
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

    static async getVersion(endpoint: string): Promise<string> {
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + endpoint,
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });

        return await instance
            .get(`/version`)
            .then((response: AxiosResponse) => {
                return response.data.versionNumber;
            })
            .catch((error: AxiosError) => {
                return "unavailable";
            });
    }
}
