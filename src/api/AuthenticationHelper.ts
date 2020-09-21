import APIResponse from "@/api/helpers/models/APIResponse";
import { useStore } from "@/use/store/store";
import AuthenticationManagement from "@/api/AuthenticationManagement";

export default async function handleAuthenticationError<T>(response: APIResponse<T>): Promise<boolean> {
    if (response.statusCode == 401) {
        // read error message and do one of the following
        const error = response.error;

        if (error.type == "RefreshTokenMissing" || error.type == "RefreshTokenExpired") {
            return (await useStore().state.modal).show();
        }

        if (error.type == "LoginTokenExpired" || error.type == "JwtAuthorization") {
            return (await AuthenticationManagement._getLoginToken()).returnValue;
        }
    }

    return false;
}
