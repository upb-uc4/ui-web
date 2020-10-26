import ResponseHandler from "./ResponseHandler";
import handleAuthenticationError from "@/api/AuthenticationHelper";
import APIResponse from "@/api/helpers/models/APIResponse";
import { showNetworkErrorToast, showAPIToast } from "@/use/helpers/Toasts";
import ValidationError from "@/api/api_models/errors/ValidationError";
import Error from "@/api/api_models/errors/Error";
import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";

export default class GenericImmatricultationResponseHandler implements ResponseHandler<boolean> {
    handleResponse<T>(response: APIResponse<T>): T {
        if (response.networkError) {
            showNetworkErrorToast();
            return response.returnValue;
        }
        switch (response.statusCode) {
            case 400: {
                showAPIToast("400");
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
                showAPIToast("404", "matriculation data");
                return response.returnValue;
            }
            case 200: {
                return response.returnValue;
            }
        }

        return response.returnValue;
    }
}

/**
 * Use this class for API calls, that return a boolean and can have validation errors (put, post)
 */
export class MatriculationValidationResponseHandler implements ResponseHandler<boolean> {
    errorList: Error[] = [] as Error[];

    isValidationError(object: any): object is ValidationError {
        return "type" in object && object.type == "HLUnprocessableEntity";
    }

    isMatriculationData(object: any): object is MatriculationData {
        return (
            (object as MatriculationData).birthDate !== undefined &&
            (object as MatriculationData).firstName !== undefined &&
            (object as MatriculationData).lastName !== undefined &&
            (object as MatriculationData).matriculationId !== undefined &&
            (object as MatriculationData).matriculationStatus !== undefined
        );
    }

    handleResponse(response: APIResponse<boolean | MatriculationData>): boolean {
        //TODO Remove following lines as they just avoid a temorary bug
        if (200 <= response.statusCode && response.statusCode <= 300) {
            return true;
        }

        if (this.isMatriculationData(response.returnValue)) {
            return true;
        } else if (response.returnValue === true || response.returnValue === false) {
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
                    showAPIToast("400");
                    return false;
                }
                case 401: {
                    handleAuthenticationError(response);
                    return false;
                }
                case 404: {
                    showAPIToast("404", "matriculation data");
                    return false;
                }
                case 422: {
                    return false;
                }
                case 200: {
                    return true;
                }
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
