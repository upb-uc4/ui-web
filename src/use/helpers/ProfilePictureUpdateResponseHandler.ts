import Error from "@/api/api_models/errors/Error";
import ValidationError from "@/api/api_models/errors/ValidationError";
import APIResponse from "@/api/helpers/models/APIResponse";
import ResponseHandler from "./ResponseHandler";
import { showAPIToast, showNetworkErrorToast } from "@/use/helpers/Toasts";

export default class ProfilePictureUpdateResponseHandler implements ResponseHandler<boolean> {
    errorList: Error[] = [] as Error[];

    isValidationError(object: any): object is ValidationError {
        return "type" in object && object.type == "Validation";
    }

    handleResponse<T>(response: APIResponse<T>): T {
        if (response.statusCode == 413) {
            this.errorList.push({ name: "profilePicture", reason: "The image size is too large (max 1MB)." });
            return response.returnValue;
        }
        if (this.isValidationError(response.error)) {
            for (let err of response.error.invalidParams) {
                this.errorList.push(err);
            }
        }
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
                alert("Authentication failed. Please login again!");
                break;
            }
            case 403: {
                alert("You do not have the neccessary user rights for this action!");
                break;
            }
            case 404: {
                showAPIToast(response.statusCode, "profile picture");
                break;
            }
            case 500: {
                showAPIToast(response.statusCode);
                break;
            }
            case 200: {
                break;
            }
            case 415: {
                alert("The uploaded file has unsupported file type!");
                break;
            }
        }

        return response.returnValue;
    }
}
