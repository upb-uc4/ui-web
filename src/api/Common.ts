import { useStore } from "@/use/store/store";
import axios, { AxiosResponse, AxiosError } from "axios";
import { AxiosInstance } from "axios";

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
        let version = "unavailable";

        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + endpoint,
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });

        await instance
            .get(`/version`)
            .then((response: AxiosResponse) => {
                version = response.data.versionNumber;
            })
            .catch((error: AxiosError) => {});
        return version;
    }
}
