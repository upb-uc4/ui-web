import handleAuthenticationError from "@/api/AuthenticationHelper";
import APIResponse from "@/api/helpers/models/APIResponse";
import ResponseHandler from "./ResponseHandler";

export default class LoginResponseHandler implements ResponseHandler<boolean> {
    handleResponse(response: APIResponse<boolean>): boolean {
        if (response.networkError) {
            //TODO show toast
            alert("Network Error");
            return false;
        }
        switch (response.statusCode) {
            case 400: {
                //TODO show toast
                return false;
            }
            case 401: {
                handleAuthenticationError(response);
                return false;
            }
            case 404: {
                //TODO show toast
                return false;
            }
            case 200: {
                return true;
            }
        }

        return false;
    }
}
