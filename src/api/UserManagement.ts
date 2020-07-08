import Common from "./Common"
import { store } from '@/store/store';
import User_List from './api_models/user_management/User_List';
import { AxiosResponse, AxiosError } from 'axios';
import Student from './api_models/user_management/Student';
import Lecturer from './api_models/user_management/Lecturer';
import Admin from './api_models/user_management/Admin';
import { Role } from '@/entities/Role';
import { Account } from '@/entities/Account';
import APIResponse from './helpers/models/APIResponse';
import APIError from './api_models/errors/APIError';
import ValidationError from "./api_models/errors/ValidationError"

export default class UserManagement extends Common {

    constructor() {
       super("/user-management");
    }

    async getAllUsers(): Promise<APIResponse<User_List>> {
        let result: APIResponse<User_List> = {
            error: {} as APIError,
            networkError: false,
            returnValue: {} as User_List,
            statusCode: 0,
        };

        await this._axios.get("/users", this._authHeader)
            .then((response: AxiosResponse) => {
                result.returnValue = response.data;
                result.statusCode = response.status
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

        await this._axios.delete(`/users/${username}`, this._authHeader)
            .then((response: AxiosResponse) => {
                result.returnValue = true;
                result.statusCode = response.status;
            })
            .catch((error: AxiosError) => {
                console.log(error)
                if(error.response) {
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

        await this._axios.get(endpoint, this._authHeader)
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
    async login(loginData: {username: string, password: string}): Promise<APIResponse<boolean>> {
        this._authHeader = {auth: loginData};
        const response: APIResponse<Role> = await this.getRole(loginData.username);

        let result: APIResponse<boolean> = {
            error: response.error,
            returnValue: response.returnValue != Role.NONE,
            networkError: response.networkError,
            statusCode: response.statusCode,
        } 

        store.state.myRole = response.returnValue;
        store.state.loginData = loginData;

        return result;
    }

    async getRole(username: string): Promise<APIResponse<Role>> {
        let result: APIResponse<Role> = {
            error: {} as APIError,
            networkError: false,
            returnValue: Role.NONE,
            statusCode: 0,
        };

        await this._axios.get(`/users/${username}/role`, this._authHeader)
            .then((response: AxiosResponse) => {
                console.log(response)
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
            result.error = role.error
            return result;
        }

        //successfully received role

        let endpoint = UserManagement._createEndpointByRole(role.returnValue);

        await this._axios.get(`${endpoint}/${username}`, this._authHeader)
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
       const username = store.state.loginData.username;
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

        await this._axios.post(endpoint, message, this._authHeader)
            .then((reponse : AxiosResponse) => {
                result.statusCode = reponse.status;
                result.returnValue = true;
            }).catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    result.error = error.response.data as ValidationError;
                } else {
                    result.networkError = true;
                }
                console.log(error)
            })     
        
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

        await this._axios.put(`${endpoint}/${user.username}`, user, this._authHeader)
            .then((response : AxiosResponse) => {
                result.returnValue = true;
                result.statusCode = response.status;
            }).catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    result.error = error.response.data as ValidationError;
                } else {
                    result.networkError = true;
                }
                console.log(error)
            })      
        
        return result;       
    }

    static _createMessage(user: Student | Lecturer | Admin, authUser: Account) {
        let message;
        switch(user.role){
            case Role.STUDENT: {
                message = {
                    authUser: authUser,
                    student: user as Student
                }
                break;
            }
            case Role.LECTURER: {
                message = {
                    authUser: authUser,
                    lecturer: user as Lecturer
                }
                break;
            }
            case Role.ADMIN: {
                message = {
                    authUser: authUser,
                    admin: user as Admin
                }
                break;
            }
            case Role.NONE: {
                new Error("Endpoint undefined")
            }
        }
        return message;
    }

    static _createEndpointByRole(role: Role) : string {
        let endpoint = "/users";
        switch(role){
            case Role.STUDENT: {
                endpoint += "/students"
                break;
            }
            case Role.LECTURER: {
                endpoint += "/lecturers"
                break;
            }
            case Role.ADMIN: {
                endpoint += "/admins"
                break;
            }
            case Role.NONE: {
                new Error("Endpoint undefined")
            }
        }
        return endpoint;
    }
}