import Common from "./Common";
import APIResponse from "./helpers/models/APIResponse";
import { useStore } from "@/store/store";
import { Role } from "@/entities/Role";
import APIError from "./api_models/errors/APIError";
import { AxiosResponse, AxiosError } from "axios";
import ValidationError from "./api_models/errors/ValidationError";
import { Account } from "@/entities/Account";
import { MutationTypes } from "@/store/mutation-types";
import UserManagement from "./UserManagement";
import GenericResponseHandler from "@/use/GenericResponseHandler";

export default class AuthenticationManagement extends Common {
    constructor() {
        super("/authentication-management");
    }

    static async getVersion(): Promise<String> {
        return super.getVersion("/authentication-management");
    }

    async changeOwnPassword(password: string): Promise<APIResponse<boolean>> {
        const store = useStore();
        const username = (await store.getters.loginData).username;
        const role = await store.getters.role;
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

        await this._axios
            .put(`/users/${username}`, acc, await this._authHeader)
            .then((response: AxiosResponse) => {
                result.returnValue = true;
                result.statusCode = response.status;
                console.log(response);
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    result.error = error.response.data as ValidationError;
                } else {
                    result.networkError = true;
                }
            });

        if (result.returnValue) {
            const store = useStore();
            store.commit(MutationTypes.SET_LOGINDATA, { username: username, password: password });
            store.commit(MutationTypes.SET_LOGGEDIN, true);
        }

        return result;
    }
}
