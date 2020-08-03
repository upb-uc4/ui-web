import Common from "./Common";
import { useStore } from "@/store/store";
import User_List from "./api_models/user_management/User_List";
import { AxiosResponse, AxiosError } from "axios";
import Student from "./api_models/user_management/Student";
import Lecturer from "./api_models/user_management/Lecturer";
import Admin from "./api_models/user_management/Admin";
import { Role } from "@/entities/Role";
import { Account } from "@/entities/Account";
import APIResponse from "./helpers/models/APIResponse";
import APIError from "./api_models/errors/APIError";
import ValidationError from "./api_models/errors/ValidationError";
import { MutationTypes } from "@/store/mutation-types";
import axios from "axios";
import GenericResponseHandler from "@/use/GenericResponseHandler";

export default class UserManagement extends Common {
    constructor() {
        super("/user-management");
    }

    static async getVersion(): Promise<String> {
        return super.getVersion("/user-management");
    }

    async getAllUsers(): Promise<APIResponse<User_List>> {
        let result: APIResponse<User_List> = {
            error: {} as APIError,
            networkError: false,
            returnValue: {} as User_List,
            statusCode: 0,
        };

        await this._axios
            .get("/users", await this._authHeader)
            .then((response: AxiosResponse) => {
                result.returnValue = response.data;
                result.statusCode = response.status;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
            });

        return result;
    }

    async deleteUser(username: string): Promise<APIResponse<boolean>> {
        let result: APIResponse<boolean> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };

        await this._axios
            .delete(`/users/${username}`, await this._authHeader)
            .then((response: AxiosResponse) => {
                result.returnValue = true;
                result.statusCode = response.status;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
            });

        return result;
    }

    async getAllUsersByRole(role: Role): Promise<APIResponse<Student[] | Lecturer[] | Admin[]>> {
        let endpoint = UserManagement._createEndpointByRole(role);
        let result: APIResponse<Student[] | Lecturer[] | Admin[]> = {
            error: {} as APIError,
            networkError: false,
            returnValue: [],
            statusCode: 0,
        };

        await this._axios
            .get(endpoint, await this._authHeader)
            .then((response: AxiosResponse) => {
                result.returnValue = response.data;
                result.statusCode = response.status;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
            });

        return result;
    }

    /**
     * Authenticate against Lagom endpoint, return true if successful
     * @param loginData
     */
    static async login(loginData: { username: string; password: string }): Promise<APIResponse<boolean>> {
        const authHeader = { auth: loginData };
        const instance = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL + "/user-management",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
            },
        });

        let intermediateResult: APIResponse<Role> = {
            error: {} as APIError,
            networkError: false,
            returnValue: Role.NONE,
            statusCode: 0,
        };

        await instance
            .get(`/role/${loginData.username}`, authHeader)
            .then((response: AxiosResponse) => {
                intermediateResult.statusCode = response.status;
                intermediateResult.returnValue = response.data.role;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    intermediateResult.statusCode = error.response.status;
                } else {
                    intermediateResult.networkError = true;
                }
            });

        let result: APIResponse<boolean> = {
            error: intermediateResult.error,
            returnValue: intermediateResult.returnValue != Role.NONE,
            networkError: intermediateResult.networkError,
            statusCode: intermediateResult.statusCode,
        };

        const store = useStore();

        if (result.returnValue) {
            store.commit(MutationTypes.SET_LOGINDATA, loginData);
            store.commit(MutationTypes.SET_LOGGEDIN, true);
            const userManagement = new UserManagement();
            const handler = new GenericResponseHandler();
            const response = await userManagement.getOwnUser();
            const user = handler.handleReponse(response);
            store.commit(MutationTypes.SET_USER, user);
            // set role after user, because the navbar is loaded as soon as the role is set.
            store.commit(MutationTypes.SET_ROLE, intermediateResult.returnValue);
        }

        return result;
    }

    async getRole(username: string): Promise<APIResponse<Role>> {
        let result: APIResponse<Role> = {
            error: {} as APIError,
            networkError: false,
            returnValue: Role.NONE,
            statusCode: 0,
        };
        await this._axios
            .get(`/role/${username}`, await this._authHeader)
            .then((response: AxiosResponse) => {
                result.statusCode = response.status;
                result.returnValue = response.data.role;
                
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
                
            });
        return result;
    }

    async getSpecificUser(username: string): Promise<APIResponse<Student | Lecturer | Admin>> {
        let result: APIResponse<Student | Lecturer | Admin> = {
            error: {} as APIError,
            networkError: false,
            returnValue: {} as Admin,
            statusCode: 0,
        };

        // get role
        let role: APIResponse<Role> = await this.getRole(username);

        if (role.networkError) {
            result.networkError = true;
            return result;
        } else if (role.statusCode !== 200) {
            result.statusCode = role.statusCode;
            result.error = role.error;
            return result;
        }

        //successfully received role

        let endpoint = UserManagement._createEndpointByRole(role.returnValue);

        await this._axios
            .get(`${endpoint}/${username}`, await this._authHeader)
            .then((response: AxiosResponse) => {
                result.statusCode = response.status;
                result.returnValue = response.data;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
            });

        return result;
    }

    async getOwnUser(): Promise<APIResponse<Student | Lecturer | Admin>> {
        const store = useStore();
        const username = (await store.getters.loginData).username;
        return await this.getSpecificUser(username);
    }

    async createUser(authUser: Account, user: Student | Lecturer | Admin): Promise<APIResponse<boolean>> {
        let endpoint = UserManagement._createEndpointByRole(user.role);
        let message = UserManagement._createMessage(user, authUser);

        let result: APIResponse<boolean> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };

        await this._axios
            .post(endpoint, message, await this._authHeader)
            .then((reponse: AxiosResponse) => {
                result.statusCode = reponse.status;
                result.returnValue = true;
                
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    result.error = error.response.data as ValidationError;
                } else {
                    result.networkError = true;
                }
                
            });

        return result;
    }

    async updateUser(user: Student | Lecturer | Admin): Promise<APIResponse<boolean>> {
        let endpoint = UserManagement._createEndpointByRole(user.role);

        let result: APIResponse<boolean> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };

        await this._axios
            .put(`${endpoint}/${user.username}`, user, await this._authHeader)
            .then((response: AxiosResponse) => {
                result.returnValue = true;
                result.statusCode = response.status;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    result.error = error.response.data as ValidationError;
                } else {
                    result.networkError = true;
                }
            });

        return result;
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
