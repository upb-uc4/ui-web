import ResponseHandler from "./ResponseHandler";
import APIResponse from "@/api/helpers/models/APIResponse";
import ValidationError from "@/api/api_models/errors/ValidationError";
import Error from "@/api/api_models/errors/Error";

export default class ProfilePictureUpdateResponseHandler implements ResponseHandler<boolean> {
    errorList: Error[] = [] as Error[];

    isValidationError(object: any): object is ValidationError {
        return "type" in object && object.type == "Validation";
    }

    handleResponse<T>(response: APIResponse<T>): T {
        if (response.statusCode == 413) {
            //alert("The uploaded file is too large!");
            this.errorList.push({ name: "profilePicture", reason: "The image size is too large (max 1MB)." });
            return response.returnValue;
        }
        if (this.isValidationError(response.error)) {
            for (let err of response.error.invalidParams) {
                this.errorList.push(err);
            }
        }
        if (response.networkError) {
            //TODO show toast
            console.log("Network Error");
            return response.returnValue;
        }
        switch (response.statusCode) {
            case 400: {
                //TODO show toast
                return response.returnValue;
            }
            case 401: {
                alert("Authentication failed. Please login again!");
                return response.returnValue;
            }
            case 403: {
                alert("You do not have the neccessary user rights for this action!");
                return response.returnValue;
            }
            case 404: {
                //TODO show toast
                return response.returnValue;
            }
            case 200: {
                return response.returnValue;
            }
            case 415: {
                alert("The uploaded file has unsupported file type!");
            }
        }

        return response.returnValue;
    }
}
