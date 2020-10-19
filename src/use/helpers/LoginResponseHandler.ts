import ResponseHandler from "./ResponseHandler";
import handleAuthenticationError from "@/api/AuthenticationHelper";
import APIResponse from "@/api/helpers/models/APIResponse";
import { showNetworkErrorToast, showAPI400Toast, showAPI404Toast } from "@/use/helpers/Toasts";

export default class LoginResponseHandler implements ResponseHandler<boolean> {
    handleResponse(response: APIResponse<boolean>): boolean {
        if (response.networkError) {
            showNetworkErrorToast();
            return false;
        }
        switch (response.statusCode) {
            case 400: {
                showAPI400Toast();
                return false;
            }
            case 401: {
                handleAuthenticationError(response);
                return false;
            }
            case 404: {
                showAPI404Toast();
                return false;
            }
            case 200: {
                return true;
            }
        }

        return false;
    }
}
