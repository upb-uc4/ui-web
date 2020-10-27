import ResponseHandler from "./ResponseHandler";
import handleAuthenticationError from "@/api/AuthenticationHelper";
import APIResponse from "@/api/helpers/models/APIResponse";
import { showNetworkErrorToast, showAPIToast } from "@/use/helpers/Toasts";

export default class LoginResponseHandler implements ResponseHandler<boolean> {
    handleResponse(response: APIResponse<boolean>): boolean {
        if (response.networkError) {
            showNetworkErrorToast();
            return false;
        }
        switch (response.statusCode) {
            case 400: {
                showAPIToast("400");
                return false;
            }
            case 401: {
                handleAuthenticationError(response);
                return false;
            }
            case 404: {
                showAPIToast("404", "login data");
                return false;
            }
            case 500: {
                showAPIToast("500");
                return false;
            }
            case 200: {
                return true;
            }
        }

        return false;
    }
}
