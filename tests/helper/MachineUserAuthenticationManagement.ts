import Common from "@/api/Common";
import APIResponse from "@/api/helpers/models/APIResponse";
import { useStore } from "@/use/store/store";
import { Role } from "@/entities/Role";
import APIError from "@/api/api_models/errors/APIError";
import { AxiosResponse, AxiosError } from "axios";
import ValidationError from "@/api/api_models/errors/ValidationError";
import { Account } from "@/entities/Account";
import { MutationTypes } from "@/use/store/mutation-types";
import UserManagement from "@/api/UserManagement";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import axios from "axios";
import handleAuthenticationError from "@/api/AuthenticationHelper";
import User from "@/api/api_models/user_management/User";
import AuthenticationManagement from "@/api/AuthenticationManagement";

export default class MachineUserAuthenticationManagement extends Common {
    constructor() {
        super("/authentication-management");
    }

    static async getVersion(): Promise<string> {
        return super.getVersion("/authentication-management");
    }

    static async _getLoginToken(refreshToken: string): Promise<APIResponse<{ username: string; login: string }>> {
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + "/authentication-management",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": `Bearer ${refreshToken}`,
            },
        });

        let result: APIResponse<{ username: string; login: string }> = {
            error: {} as APIError,
            networkError: false,
            returnValue: { username: "", login: "" },
            statusCode: 0,
        };

        await instance
            .get(`/refresh/machine`)
            .then((response: AxiosResponse) => {
                result.statusCode = response.status;
                result.returnValue = response.data.login;
                result.returnValue.username = response.data.username;
                result.returnValue.login = response.data.login;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
            });

        if (result.returnValue) {
            axios.defaults.headers.common = { Authorization: `Bearer ${result.returnValue.login}` };
            const store = useStore();

            store.commit(MutationTypes.SET_LOGGEDIN, true);

            const userManagement = new UserManagement();
            const handler = new GenericResponseHandler();
            const response = await userManagement.getSpecificUser(result.returnValue.username);
            if (response.statusCode == 200) {
                const user = handler.handleResponse(response);
                store.commit(MutationTypes.SET_USER, user);
            }
        }

        return result;
    }

    static async _getRefreshToken(loginData: {
        username: string;
        password: string;
    }): Promise<APIResponse<{ login: string; refresh: string }>> {
        const authHeader = { auth: loginData };
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + "/authentication-management",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });

        let result: APIResponse<{ login: string; refresh: string }> = {
            error: {} as APIError,
            networkError: false,
            returnValue: { login: "", refresh: "" },
            statusCode: 0,
        };

        let loginToken = "";
        let refreshToken = "";

        await instance
            .get(`/login/machine`, authHeader)
            .then((response: AxiosResponse) => {
                result.statusCode = response.status;
                result.returnValue.login = response.data.login;
                result.returnValue.refresh = response.data.login;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
            });

        if (result.returnValue) {
            axios.defaults.headers.common = { Authorization: `Bearer ${result.returnValue.login}` };
            const store = useStore();
            store.commit(MutationTypes.SET_LOGGEDIN, true);

            const userManagement = new UserManagement();
            const handler = new GenericResponseHandler();
            const response = await userManagement.getSpecificUser(loginData.username);
            if (response.statusCode == 200) {
                const user = handler.handleResponse(response);
                store.commit(MutationTypes.SET_USER, user);
            }
        }

        return result;
    }

    static setVueEnvVariable() {
        console.log(Cypress.env("NODE_ENV"));
        switch (Cypress.env("NODE_ENV")) {
            case "production":
                process.env.VUE_APP_API_BASE_URL = "https://uc4.cs.uni-paderborn.de/api/production";
                break;
            case "development":
                process.env.VUE_APP_API_BASE_URL = "https://uc4.cs.uni-paderborn.de/api/develop/";
                break;
            case "experimental":
                process.env.VUE_APP_API_BASE_URL = "https://uc4.cs.uni-paderborn.de/api/experimental/";
                break;
            default:
                process.env.VUE_APP_API_BASE_URL = "https://uc4.cs.uni-paderborn.de/api/develop/";
                break;
        }
    }
}
