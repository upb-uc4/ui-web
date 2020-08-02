import { useStore } from "@/store/store";
import axios, { AxiosResponse, AxiosError } from "axios";
import { AxiosInstance } from "axios";

export default class Common {
    _authHeader!: Promise<{ auth: { username: string; password: string } }>;
    _axios: AxiosInstance;

    constructor(endpoint: string) {
        this._authHeader = this._getLoginData();

        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + endpoint,
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });

        this._axios = instance;
    }

    static async getVersion(endpoint: string): Promise<String> {
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

    getAuthHeader() {
        return this._authHeader;
    }

    async _getLoginData() {
        const store = useStore();
        const auth = await store.getters.loginData;
        return { auth: auth };
    }
}
