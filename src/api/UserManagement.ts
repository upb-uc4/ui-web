import Common from "./Common"
import { store } from '@/store/store';
import User_List from './api_models/user_management/User_List';
import { AxiosResponse, AxiosError } from 'axios';
import Student from './api_models/user_management/Student';
import Lecturer from './api_models/user_management/Lecturer';
import Admin from './api_models/user_management/Admin';
import { Role } from '@/entities/Role';
import { Account } from '@/entities/Account';

export default class UserManagement extends Common {

    constructor() {
       super("/user-management");
    }


    // users endpoint
    async getAllUsers(): Promise<User_List> {
        let userList: User_List = {} as User_List;

        await this._axios.get("/users", this._authHeader)
                    .then((response: AxiosResponse) => {
                        console.log(response)
                        userList = response.data;
                    })
                    .catch((error: AxiosError) => {
                        if (!error.response) {
                            return console.log("Network Error")
                        }
                    }).then(()=> {
                        return userList;
                    });

        return userList;
    }

    async deleteUser(username: string): Promise<boolean> {
        let success = false;

        await this._axios.delete(`/users/${username}`, this._authHeader)
                    .then((response: AxiosResponse) => {
                        console.log(response)
                        success = true;
                    })
                    .catch((error: AxiosError) => {
                        console.log(error)
                        if(!error.response) {
                            //network error
                        } 

                    });

        return success;
    }

    async getAllUsersByRole(role: Role): Promise<Student[] | Lecturer[] | Admin[]> {
        let endpoint = UserManagement._createEndpointByRole(role);
        let result: Student[] | Lecturer[] | Admin[] = [];

        await this._axios.get(endpoint, this._authHeader)
            .then((response: AxiosResponse) => {
                result = response.data
            })
            .catch((error: AxiosError) => {

            });
        
        return result;
    }

    /**
     * Authenticate against Lagom endpoint, return true if successful
     * @param loginData 
     */
    async login(loginData: {username: string, password: string}): Promise<boolean> {
        this._authHeader = {auth: loginData};
        const role: Role = await this.getRole(loginData.username);
        store.state.myRole = role;
        store.state.loginData = loginData;

        return role != Role.NONE;
    }

    async getRole(username: string): Promise<Role> {
        let result: Role = Role.NONE;

        await this._axios.get(`/users/${username}/role`, this._authHeader)
                    .then((response: AxiosResponse) => {
                        console.log(response)
                        result = response.data.role;
                    })
                    .catch((error: AxiosError) => {
                        if(!error.response) {
                            //network error
                        } 

                    });

        return result;       
    }

    async getSpecificUser(username: string): Promise<Student | Lecturer | Admin> {
        var result: Student | Lecturer | Admin = {} as Student | Lecturer | Admin;
        // get role 
        let role: Role = await this.getRole(username);
        let endpoint = UserManagement._createEndpointByRole(role);

        await this._axios.get(`${endpoint}/${username}`, this._authHeader)
                    .then((response: AxiosResponse) => {
                        console.log(response)
                        result = response.data;
                    })
                    .catch((error: AxiosError) => {
                        console.log(error)
                        if(!error.response) {
                            //network error
                        } 

                    });

        return result;
    }

    async createUser(authUser: Account, user: Student | Lecturer | Admin): Promise<boolean> {
        let endpoint = UserManagement._createEndpointByRole(user.role);
        let message = UserManagement._createMessage(user, authUser);

        let success = false;
        await this._axios.post(endpoint, message, this._authHeader)
            .then((reponse : AxiosResponse) => {
                success = true;
            }).catch((error: AxiosError) => {
                console.log(error)
            })     
        
        return success;
    }

    async updateUser(user: Student | Lecturer | Admin): Promise<boolean> {
        let endpoint = UserManagement._createEndpointByRole(user.role);
        let success = false;

        await this._axios.put(`${endpoint}/${user.username}`, user, this._authHeader)
            .then((reponse : AxiosResponse) => {
                success = true;
            }).catch((error: AxiosError) => {
                console.log(error)
            })      
        
        return success;       
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