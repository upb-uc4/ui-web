import Common from "./Common";
import APIResponse from "./helpers/models/APIResponse";
import { useStore } from "@/use/store/store";
import { Role } from "@/entities/Role";
import APIError from "./api_models/errors/APIError";
import { AxiosResponse, AxiosError } from "axios";
import ValidationError from "./api_models/errors/ValidationError";
import { Account } from "@/entities/Account";
import { MutationTypes } from "@/use/store/mutation-types";
import UserManagement from "./UserManagement";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import axios from "axios";
import handleAuthenticationError from "./AuthenticationHelper";
import User from "./api_models/user_management/User";

export default class AuthenticationManagement extends Common {
    constructor() {
        super("/authentication-management");
    }

    static async getVersion(): Promise<String> {
        return super.getVersion("/authentication-management");
    }

    async changeOwnPassword(password: string): Promise<APIResponse<boolean>> {
        const store = useStore();
        const user = await store.getters.user;
        const username = user.username;
        const role = user.role;
        const acc: Account = {
            username: username,
            password: password,
            role: role as Role,
        };

        let result: APIResponse<boolean> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };
        var reloginSuccess = false;

        await this._axios
            .put(`/users/${username}`, acc)
            .then((response: AxiosResponse) => {
                result.returnValue = true;
                result.statusCode = response.status;
                console.log(response);
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    result.error = error.response.data as ValidationError;
                    reloginSuccess = await handleAuthenticationError(result);
                } else {
                    result.networkError = true;
                }
            });

        if (result.statusCode == 401 && reloginSuccess) {
            return await this.changeOwnPassword(password);
        }

        if (result.returnValue) {
            const store = useStore();
            store.commit(MutationTypes.SET_LOGGEDIN, true);
        }

        return result;
    }

    /**
     * Authenticate against Lagom endpoint, return true if successful
     * @param loginData
     */
    static async login(loginData?: { username: string; password: string }): Promise<APIResponse<boolean>> {
        if (loginData !== undefined) {
            return await this._getRefreshToken(loginData);
        } else {
            return await this._getLoginToken();
        }
    }

    static async _getLoginToken(): Promise<APIResponse<boolean>> {
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + "/authentication-management",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
            withCredentials: true,
        });

        let result: APIResponse<boolean> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };

        let username: string = "";

        await instance
            .get(`/refresh`)
            .then((response: AxiosResponse) => {
                result.statusCode = response.status;
                result.returnValue = true;
                username = response.data.username;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
            });

        if (result.returnValue) {
            const store = useStore();

            store.commit(MutationTypes.SET_LOGGEDIN, true);

            const userManagement = new UserManagement();
            const handler = new GenericResponseHandler();
            const response = await userManagement.getSpecificUser(username);
            if (response.statusCode == 200) {
                const user = handler.handleResponse(response);
                store.commit(MutationTypes.SET_USER, user);
            }
        }

        return result;
    }

    async logout(): Promise<APIResponse<boolean>> {
        let result: APIResponse<boolean> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };

        await this._axios
            .get(`/logout`)
            .then((response: AxiosResponse) => {
                result.statusCode = response.status;
                result.returnValue = true;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
            });

        if (result.returnValue) {
            const store = useStore();
            store.commit(MutationTypes.SET_LOGGEDIN, false);
            store.commit(MutationTypes.SET_USER, {} as User);
        }

        return result;
    }

    static async _getRefreshToken(loginData: { username: string; password: string }): Promise<APIResponse<boolean>> {
        const authHeader = { auth: loginData };
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + "/authentication-management",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });

        let result: APIResponse<boolean> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };

        await instance
            .get(`/login`, authHeader)
            .then((response: AxiosResponse) => {
                result.statusCode = response.status;
                result.returnValue = true;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
            });

        if (result.returnValue) {
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
}
