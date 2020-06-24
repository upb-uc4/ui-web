import Common from "./Common"
import { store } from '@/store/store';
import { Role } from '@/entities/Role';
import { Account } from "@/entities/Account"

export default class Authentication_Management extends Common {

    constructor() {
       super("/authentication-management");
    }

    async getRole(username: string): Promise<Role> {
        var role = Role.NONE;

        await this._axios.get(`/users/${username}/role`, this._authHeader)
                    .then((response: any) => {
                        console.log(response)
                        role = response.data.role;
                    })
                    .catch((error: any) => {
                        if (!error.reponse) {
                            return console.log("Network Error")
                        }
                        if (error.response.status == "401") {
                            console.log(error)
                        } else if (error.response.status == "403") {
                            console.log(error)
                        }
                    }).then(()=> {
                        return role;
                    });

        return role;
    }

    async getOwnRole(): Promise<Role> {
        const username: string = store.state.loginData.username
        const role = await this.getRole(username);
        return role;
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

    async createAccount(account: Account): Promise<boolean> {
        let success = false;
        await this._axios.post("/users", account, this._authHeader)
                    .then((response: any) => {
                        console.log(response)
                        success = true;
                    })
                    .catch((error: any) => {
                        if (error.response.status == "401") {
                            console.log(error)
                        } else if (error.response.status == "403") {
                            console.log(error)
                        }
                    });        
        return success;
    }

    async deleteAccount(username: string): Promise<boolean> {
        let success = false;
        await this._axios.delete(`/users/${username}`, this._authHeader)
                    .then((response: any) => {
                        console.log(response)
                        success = true;
                    })
                    .catch((error: any) => {
                        if (error.response.status == "401") {
                            console.log(error)
                        } else if (error.response.status == "403") {
                            console.log(error)
                        }
                    });    
        return success;
    }
}