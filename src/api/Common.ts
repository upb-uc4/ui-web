import { useStore } from "@/store/store";
import axios from "axios";
import { AxiosInstance } from "axios";

export default class Common {
    _authHeader: { auth: { username: string; password: string } } = { auth: { username: "", password: "" } };
    _requestParameter: { auth: { username: string; password: string }; params: any };
    _axios: AxiosInstance;

    constructor(endpoint: string) {
        const store = useStore();
        this._authHeader = { auth: store.getters.loginData };
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

    getAuthHeader() {
        return this._authHeader;
    }

    setAuthHeader(authHeader: { auth: { username: string; password: string } }) {
        this._authHeader = authHeader;
    }
}
