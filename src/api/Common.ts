import axios, { AxiosResponse, AxiosError } from "axios";
import { useStore } from "@/store/store";
import { AxiosInstance } from "axios";
import ValidationError from "./api_models/errors/ValidationError";

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

    async getVersion(): Promise<String> {
        let version = "unavailable";

        await this._axios
            .get(`/version`)
            .then((response: AxiosResponse) => {
                version = response.data.version;
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
