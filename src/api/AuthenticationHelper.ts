import AuthenticationManagement from "@/api/AuthenticationManagement";
import APIResponse from "@/api/helpers/models/APIResponse";
import { useStore } from "@/use/store/store";

export default async function handleAuthenticationError<T>(response: APIResponse<T>): Promise<boolean> {
    if (response.statusCode == 401) {
        // read error message and do one of the following
        const error = response.error;

        const promptRefreshErrors = ["JwtAuthorization", "LoginTokenExpired", "LoginTokenSignatureInvalid", "MalformedLoginToken"];
        const promptReloginErrors = ["RefreshTokenMissing", "MalformedRefreshToken", "RefreshTokenExpired", "RefreshTokenSignatureInvalid"];

        if (promptReloginErrors.includes(error.type)) {
            return (await useStore().state.modal).show();
        }

        if (promptRefreshErrors.includes(error.type)) {
            return (await AuthenticationManagement._getLoginToken()).returnValue;
        }
    }

    return false;
}
