import { store } from '@/store/store';
import axios from 'axios';
import { AxiosInstance } from "axios"

export default class Common {
    _authHeader: {auth: {username: string, password: string} }= {auth: {username: "",password: ""} }
    _requestParameter: {auth: {username: string, password: string}, params: any};
    _axios: AxiosInstance;

    constructor(endpoint: string) {

        this._authHeader = {auth: store.state.loginData };
        this._requestParameter = {...this._authHeader, params: {}}
        const instance = axios.create({
            baseURL: "http://localhost:9000" + endpoint,
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8"
            }
        });

        this._axios =  instance;
    }

    getAuthHeader() {
        return this._authHeader;
    }

    setAuthHeader(authHeader: {auth: {username: string, password: string} }) {
        this._authHeader = authHeader;
    }

}