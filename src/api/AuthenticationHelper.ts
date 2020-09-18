import APIResponse from "@/api/helpers/models/APIResponse";
import { useStore } from "@/use/store/store";
import AuthenticationManagement from "@/api/AuthenticationManagement";

export default async function handleAuthenticationError<T>(response: APIResponse<T>): Promise<boolean> {
    if (response.statusCode == 401) {
        // read error message and do one of the following
        const error = response.error;

        if (error.type == "token missing" || error.type == "refresh token expired") {
            return (await useStore().state.modal).show();
        }

        if (error.type == "login token expired") {
            return (await AuthenticationManagement.login()).returnValue;
        }
    }

    return false;
}
