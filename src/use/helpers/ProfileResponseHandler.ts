import ResponseHandler from "./ResponseHandler";
import APIResponse from "@/api/helpers/models/APIResponse";
import Student from "@/api/api_models/user_management/Student";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Admin from "@/api/api_models/user_management/Admin";
import handleAuthenticationError from "@/api/AuthenticationHelper";
import { showNetworkErrorToast, showAPIToast } from "@/use/helpers/Toasts";

export default class ProfileResponseHandler implements ResponseHandler<Student | Lecturer | Admin> {
    handleResponse(response: APIResponse<Student | Lecturer | Admin>): Student | Lecturer | Admin {
        if (response.networkError) {
            showNetworkErrorToast();
            return response.returnValue;
        }

        switch (response.statusCode) {
            case 400: {
                showAPIToast("400");
                break;
            }
            case 401: {
                handleAuthenticationError(response);
                break;
            }
            case 404: {
                showAPIToast("404", "user");
                break;
            }
        }
        return response.returnValue;
    }
}
