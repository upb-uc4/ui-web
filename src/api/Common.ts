import { store } from "@/store/store";
import axios, { AxiosResponse, AxiosError } from "axios";
import { AxiosInstance } from "axios";
import ValidationError from "./api_models/errors/ValidationError";

export default class Common {
    _authHeader: { auth: { username: string; password: string } } = { auth: { username: "", password: "" } };
    _requestParameter: { auth: { username: string; password: string }; params: any };
    _axios: AxiosInstance;

    constructor(endpoint: string) {
        this._authHeader = { auth: store.state.loginData };
        this._requestParameter = { ...this._authHeader, params: {} };
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

    setAuthHeader(authHeader: { auth: { username: string; password: string } }) {
        this._authHeader = authHeader;
    }
}
