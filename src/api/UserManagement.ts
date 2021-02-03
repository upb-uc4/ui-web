import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { useStore } from "@/use/store/store";
import { AxiosError, AxiosResponse } from "axios";
import APIError from "./api_models/errors/APIError";
import Admin from "./api_models/user_management/Admin";
import Lecturer from "./api_models/user_management/Lecturer";
import Student from "./api_models/user_management/Student";
import User_List from "./api_models/user_management/User_List";
import handleAuthenticationError from "./AuthenticationHelper";
import Common from "./Common";
import APIResponse from "./helpers/models/APIResponse";

export default class UserManagement extends Common {
    protected static endpoint = "/user-management";
    protected static serviceIdentifier = "examreg";

    constructor() {
        super(UserManagement.endpoint, UserManagement.serviceIdentifier);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    async getUsers(
        role?: Role,
        usernames?: string[],
        is_active?: boolean
    ): Promise<APIResponse<User_List | Student[] | Lecturer[] | Admin[]>> {
        const requestParameter = { params: {} as any };
        let endpoint = "/users";

        if (usernames !== undefined) requestParameter.params.usernames = usernames.reduce((a, b) => a + "," + b);
        if (is_active !== undefined) requestParameter.params.is_active = is_active;
        if (role !== undefined) endpoint = UserManagement._createEndpointByRole(role);

        return await this._axios
            .get(endpoint, requestParameter)
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
                        return await this.getUsers(role, usernames, is_active);
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

    async forceDeleteUser(username: string): Promise<APIResponse<boolean>> {
        return await this._axios
            .delete(`/users/${username}/force`)
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
                        return await this.forceDeleteUser(username);
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

    async createUser(governmentId: string, authUser: Account, user: Student | Lecturer | Admin): Promise<APIResponse<boolean>> {
        return await this._axios
            .post("/users", { governmentId, authUser, user })
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
                        return await this.createUser(governmentId, authUser, user);
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

    static _createEndpointByRole(role: Role): string {
        let endpoint = "";
        switch (role) {
            case Role.STUDENT: {
                endpoint = "/students";
                break;
            }
            case Role.LECTURER: {
                endpoint = "/lecturers";
                break;
            }
            case Role.ADMIN: {
                endpoint = "/admins";
                break;
            }
            default: {
                endpoint = "/users";
                break;
            }
        }
        return endpoint;
    }

    async deleteProfilePicture(username: string): Promise<APIResponse<boolean>> {
        return await this._axios
            .delete(`/users/${username}/image`)
            .then((response: AxiosResponse) => {
                return {
                    error: {} as APIError,
                    networkError: false,
                    statusCode: response.status,
                    returnValue: true,
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
                        return await this.deleteProfilePicture(username);
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

    async getProfilePicture(username: string): Promise<APIResponse<File>> {
        return await this._axios
            .get(`/users/${username}/image`, {
                responseType: "arraybuffer",
            })
            .then((response: AxiosResponse) => {
                let blob: Blob = new Blob([response.data], { type: response.headers["content-type"] });
                const file: File = new File([blob], "image.png", { type: response.headers["content-type"] });
                return {
                    error: {} as APIError,
                    networkError: false,
                    statusCode: response.status,
                    returnValue: file,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: {} as File,
                            networkError: false,
                        })
                    ) {
                        return await this.getProfilePicture(username);
                    }
                    return {
                        returnValue: {} as File,
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        returnValue: {} as File,
                        statusCode: 0,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    async getThumbnail(username: string): Promise<APIResponse<File>> {
        return await this._axios
            .get(`/users/${username}/thumbnail`, {
                responseType: "arraybuffer",
            })
            .then((response: AxiosResponse) => {
                let blob: Blob = new Blob([response.data], { type: response.headers["content-type"] });
                const file: File = new File([blob], "image.png", { type: response.headers["content-type"] });
                return {
                    error: {} as APIError,
                    networkError: false,
                    statusCode: response.status,
                    returnValue: file,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: {} as File,
                            networkError: false,
                        })
                    ) {
                        return await this.getProfilePicture(username);
                    }
                    return {
                        returnValue: {} as File,
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        returnValue: {} as File,
                        statusCode: 0,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    async updateProfilePicture(username: string, picture: File): Promise<APIResponse<boolean>> {
        return await this._axios
            .put(`/users/${username}/image`, picture, {
                headers: {
                    "content-type": picture.type,
                },
            })
            .then((response: AxiosResponse) => {
                return {
                    error: {} as APIError,
                    networkError: false,
                    statusCode: response.status,
                    returnValue: true,
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
                        return await this.updateProfilePicture(username, picture);
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
}
