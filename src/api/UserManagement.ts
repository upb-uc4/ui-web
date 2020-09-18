import Common from "./Common";
import { useStore } from "@/use/store/store";
import User_List from "./api_models/user_management/User_List";
import { AxiosResponse, AxiosError } from "axios";
import Student from "./api_models/user_management/Student";
import Lecturer from "./api_models/user_management/Lecturer";
import Admin from "./api_models/user_management/Admin";
import { Role } from "@/entities/Role";
import { Account } from "@/entities/Account";
import APIResponse from "./helpers/models/APIResponse";
import APIError from "./api_models/errors/APIError";
import handleAuthenticationError from "./AuthenticationHelper";

export default class UserManagement extends Common {
    constructor() {
        super("/user-management");
    }

    static async getVersion(): Promise<string> {
        return super.getVersion("/user-management");
    }

    async getAllUsers(): Promise<APIResponse<User_List>> {
        return await this._axios
            .get("/users")
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data,
                    statusCode: response.status,
                    networkError: false,
                    error: {} as APIError,
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
                        return await this.getAllUsers();
                    }
                    return {
                        returnValue: {} as User_List,
                        statusCode: error.response.status,
                        networkError: false,
                        error: error.response.data as APIError,
                    };
                } else {
                    return {
                        returnValue: {} as User_List,
                        statusCode: 0,
                        networkError: true,
                        error: {} as APIError,
                    };
                }
            });
    }

    async getUsers(...usernames: string[]): Promise<APIResponse<User_List>> {
        let resp = await this._getByUsername(usernames, "/users");
        return resp as APIResponse<User_List>;
    }

    async getStudents(...usernames: string[]): Promise<APIResponse<Student[]>> {
        let resp = await this._getByUsername(usernames, "/students");
        return resp as APIResponse<Student[]>;
    }

    async getLecturers(...usernames: string[]): Promise<APIResponse<Lecturer[]>> {
        let resp = await this._getByUsername(usernames, "/lecturers");
        return resp as APIResponse<Lecturer[]>;
    }

    async getAdmins(...usernames: string[]): Promise<APIResponse<Admin[]>> {
        let resp = await this._getByUsername(usernames, "/admins");
        return resp as APIResponse<Admin[]>;
    }

    async _getByUsername(usernames: string[], endpoint: string): Promise<APIResponse<User_List | Student[] | Lecturer[] | Admin[]>> {
        const requestParameter = { params: {} as any };
        requestParameter.params.usernames = usernames.reduce((a, b) => a + "," + b, "");

        return await this._axios
            .get(endpoint, requestParameter)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data,
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
                            returnValue: {} as User_List,
                            networkError: false,
                        })
                    ) {
                        return await this._getByUsername(usernames, endpoint);
                    }
                    return {
                        returnValue: {} as User_List,
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        returnValue: {} as User_List,
                        statusCode: 0,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    async deleteUser(username: string): Promise<APIResponse<boolean>> {
        return await this._axios
            .delete(`/users/${username}`)
            .then((response: AxiosResponse) => {
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
                        return await this.deleteUser(username);
                    }
                    return {
                        returnValue: false,
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        returnValue: false,
                        statusCode: 0,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    async getAllUsersByRole(role: Role): Promise<APIResponse<Student[] | Lecturer[] | Admin[]>> {
        let endpoint = UserManagement._createEndpointByRole(role);
        return await this._axios
            .get(endpoint)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data,
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
                        return await this.getAllUsersByRole(role);
                    }
                    return {
                        returnValue: [],
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        returnValue: [],
                        statusCode: 0,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    async getRole(username: string): Promise<APIResponse<Role>> {
        return await this._axios
            .get(`/users/${username}/role`)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.data.role,
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
                        return await this.getRole(username);
                    }
                    return {
                        statusCode: error.response.status,
                        returnValue: Role.NONE,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        returnValue: Role.NONE,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    async getSpecificUser(username: string): Promise<APIResponse<Student | Lecturer | Admin>> {
        return await this._axios
            .get(`/users/${username}`)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.data,
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
                        return await this.getSpecificUser(username);
                    }
                    return {
                        statusCode: error.response.status,
                        returnValue: {} as Lecturer,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        returnValue: {} as Lecturer,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    async getOwnUser(): Promise<APIResponse<Student | Lecturer | Admin>> {
        const store = useStore();
        const username = (await store.getters.user).username;
        return await this.getSpecificUser(username);
    }

    async createUser(authUser: Account, user: Student | Lecturer | Admin): Promise<APIResponse<boolean>> {
        let message = UserManagement._createMessage(user, authUser);

        return await this._axios
            .post("/users", message)
            .then((reponse: AxiosResponse) => {
                return {
                    statusCode: reponse.status,
                    returnValue: true,
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
                        return await this.createUser(authUser, user);
                    }
                    return {
                        statusCode: error.response.status,
                        returnValue: false,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        returnValue: true,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    async updateUser(user: Student | Lecturer | Admin): Promise<APIResponse<boolean>> {
        return await this._axios
            .put(`/users/${user.username}`, user)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: true,
                    statusCode: response.status,
                    error: {} as APIError,
                    networkError: false,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    return {
                        returnValue: false,
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        returnValue: false,
                        statusCode: 0,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    static _createMessage(user: Student | Lecturer | Admin, authUser: Account) {
        let message;
        switch (user.role) {
            case Role.STUDENT: {
                message = {
                    authUser: authUser,
                    student: user as Student,
                };
                break;
            }
            case Role.LECTURER: {
                message = {
                    authUser: authUser,
                    lecturer: user as Lecturer,
                };
                break;
            }
            case Role.ADMIN: {
                message = {
                    authUser: authUser,
                    admin: user as Admin,
                };
                break;
            }
            case Role.NONE: {
                new Error("Endpoint undefined");
            }
        }
        return message;
    }

    static _createEndpointByRole(role: Role): string {
        let endpoint = "";
        switch (role) {
            case Role.STUDENT: {
                endpoint += "/students";
                break;
            }
            case Role.LECTURER: {
                endpoint += "/lecturers";
                break;
            }
            case Role.ADMIN: {
                endpoint += "/admins";
                break;
            }
            case Role.NONE: {
                new Error("Endpoint undefined");
            }
        }
        return endpoint;
    }
}
