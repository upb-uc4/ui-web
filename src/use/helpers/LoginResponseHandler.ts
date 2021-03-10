import handleAuthenticationError from "@/api/AuthenticationHelper";
import APIResponse from "@/api/helpers/models/APIResponse";
import { showAPIToast, showNetworkErrorToast } from "@/use/helpers/Toasts";
import ResponseHandler from "./ResponseHandler";

export default class LoginResponseHandler implements ResponseHandler<boolean> {
    handleResponse(response: APIResponse<boolean>): boolean {
        if (response.networkError) {
            showNetworkErrorToast();
            return false;
        }
        switch (response.statusCode) {
            case 400: {
                showAPIToast(response.statusCode);
                return false;
            }
            case 401: {
                handleAuthenticationError(response);
                return false;
            }
            case 404: {
                showAPIToast(response.statusCode, "login data");
                return false;
            }
            case 502:
            case 500: {
                showAPIToast(response.statusCode);
                return false;
            }
            case 200: {
                return true;
            }
        }

        return false;
    }
}
