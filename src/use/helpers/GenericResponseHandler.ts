import ResponseHandler from "./ResponseHandler";
import handleAuthenticationError from "@/api/AuthenticationHelper";
import APIResponse from "@/api/helpers/models/APIResponse";
import { showNetworkErrorToast, showAPI400Toast, showAPI404Toast } from "@/use/helpers/Toasts";

export default class GenericResponseHandler implements ResponseHandler<boolean> {
    handleResponse<T>(response: APIResponse<T>): T {
        if (response.networkError) {
            showNetworkErrorToast();
            return response.returnValue;
        }
        switch (response.statusCode) {
            case 400: {
                showAPI400Toast();
                return response.returnValue;
            }
            case 401: {
                handleAuthenticationError(response);
                return response.returnValue;
            }
            case 403: {
                alert("You do not have the neccessary user rights for this action!");
                return response.returnValue;
            }
            case 404: {
                showAPI404Toast();
                return response.returnValue;
            }
            case 200: {
                return response.returnValue;
            }
        }

        return response.returnValue;
    }
}
