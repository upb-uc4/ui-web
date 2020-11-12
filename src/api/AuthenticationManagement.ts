import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import { MutationTypes } from "@/use/store/mutation-types";
import { useStore } from "@/use/store/store";
import axios, { AxiosError, AxiosResponse } from "axios";
import APIError from "./api_models/errors/APIError";
import User from "./api_models/user_management/User";
import handleAuthenticationError from "./AuthenticationHelper";
import Common from "./Common";
import APIResponse from "./helpers/models/APIResponse";
import UserManagement from "./UserManagement";

export default class AuthenticationManagement extends Common {
    constructor() {
        super("/authentication-management");
    }

    static async getVersion(): Promise<string> {
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

        return await this._axios
            .put(`/users/${username}`, acc)
            .then((response: AxiosResponse) => {
                store.commit(MutationTypes.SET_LOGGEDIN, true);
                return {
                    returnValue: true,
                    statusCode: response.status,
                    error: {} as APIError,
                    networkError: false,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: false,
                            networkError: false,
                        })
                    ) {
                        return await this.changeOwnPassword(password);
                    }
                    return {
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        returnValue: false,
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        error: {} as APIError,
                        returnValue: false,
                        networkError: true,
                    };
                }
            });
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

        return await instance
            .get(`/refresh`)
            .then(async (response: AxiosResponse) => {
                const store = useStore();

                store.commit(MutationTypes.SET_LOGGEDIN, true);
                const userManagement = new UserManagement();
                const handler = new GenericResponseHandler();
                const userResponse = await userManagement.getSpecificUser(response.data.username);
                if (response.status == 200) {
                    const user = handler.handleResponse(userResponse);
                    store.commit(MutationTypes.SET_USER, user);
                }
                return {
                    error: {} as APIError,
                    statusCode: response.status,
                    returnValue: true,
                    networkError: false,
                };
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    return {
                        error: error.response.data as APIError,
                        statusCode: error.response.status,
                        returnValue: true,
                        networkError: false,
                    };
                } else {
                    return {
                        error: {} as APIError,
                        statusCode: 0,
                        returnValue: true,
                        networkError: true,
                    };
                }
            });
    }

    async logout(): Promise<APIResponse<boolean>> {
        let result: APIResponse<boolean> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };

        return await this._axios
            .get(`/logout`)
            .then((response: AxiosResponse) => {
                const store = useStore();
                store.commit(MutationTypes.SET_LOGGEDIN, false);
                store.commit(MutationTypes.SET_USER, {} as User);
                return {
                    error: {} as APIError,
                    networkError: false,
                    statusCode: response.status,
                    returnValue: true,
                };
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    return {
                        error: error.response.data as APIError,
                        networkError: false,
                        statusCode: error.response.status,
                        returnValue: false,
                    };
                } else {
                    return {
                        error: {} as APIError,
                        networkError: true,
                        statusCode: 0,
                        returnValue: false,
                    };
                }
            });
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

        return await instance
            .get(`/login`, authHeader)
            .then(async (response: AxiosResponse) => {
                const store = useStore();
                store.commit(MutationTypes.SET_LOGGEDIN, true);

                const userManagement = new UserManagement();
                const handler = new GenericResponseHandler();
                const userResponse = await userManagement.getSpecificUser(loginData.username);
                if (response.status == 200) {
                    const user = handler.handleResponse(userResponse);
                    store.commit(MutationTypes.SET_USER, user);
                }
                return {
                    statusCode: response.status,
                    returnValue: true,
                    networkError: false,
                    error: {} as APIError,
                };
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    return {
                        statusCode: error.response.status,
                        returnValue: false,
                        networkError: false,
                        error: error.response.data as APIError,
                    };
                } else {
                    return {
                        statusCode: 0,
                        returnValue: false,
                        networkError: true,
                        error: {} as APIError,
                    };
                }
            });
    }
}
