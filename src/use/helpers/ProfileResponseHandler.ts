import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import handleAuthenticationError from "@/api/AuthenticationHelper";
import APIResponse from "@/api/helpers/models/APIResponse";
import { showAPIToast, showNetworkErrorToast } from "@/use/helpers/Toasts";
import ResponseHandler from "./ResponseHandler";

export default class ProfileResponseHandler implements ResponseHandler<Student | Lecturer | Admin> {
    handleResponse(response: APIResponse<Student | Lecturer | Admin>): Student | Lecturer | Admin {
        if (response.networkError) {
            showNetworkErrorToast();
            return response.returnValue;
        }

        switch (response.statusCode) {
            case 400: {
                showAPIToast(response.statusCode);
                break;
            }
            case 401: {
                handleAuthenticationError(response);
                break;
            }
            case 404: {
                showAPIToast(response.statusCode, "user");
                break;
            }
            case 500: {
                showAPIToast(response.statusCode);
                break;
            }
        }
        return response.returnValue;
    }
}
