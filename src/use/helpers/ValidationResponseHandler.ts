import Error from "@/api/api_models/errors/Error";
import ValidationError from "@/api/api_models/errors/ValidationError";
import APIResponse from "@/api/helpers/models/APIResponse";
import ResponseHandler from "./ResponseHandler";
import handleAuthenticationError from "@/api/AuthenticationHelper";
import { showAPIToast, showNetworkErrorToast } from "@/use/helpers/Toasts";

/**
 * Use this class for API calls, that return a boolean and can have validation errors (put, post)
 */
export default class ValidationResponseHandler implements ResponseHandler<boolean> {
    dataType: string;
    errorList: Error[] = [] as Error[];

    constructor(msg: string) {
        this.dataType = msg;
    }

    isValidationError(object: any): object is ValidationError {
        return "type" in object && object.type == "Validation";
    }

    handleResponse(response: APIResponse<boolean>): boolean {
        if (this.isValidationError(response.error)) {
            for (let err of response.error.invalidParams) {
                this.errorList.push(err);
            }
        }

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
                showAPIToast(response.statusCode, this.dataType);
                return false;
            }
            case 422: {
                return false;
            }
            case 500: {
                showAPIToast(response.statusCode);
                return false;
            }
            case 201: {
                return true;
            }

            case 200: {
                return true;
            }
        }

        return false;
    }

    static _createTestErrors(object: any): { name: string; reason: string }[] {
        let errors = [];
        for (let key in object) {
            errors.push({ name: key, reason: key + " is invalid" });
        }

        return errors;
    }
}
