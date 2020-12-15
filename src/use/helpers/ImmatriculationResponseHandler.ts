import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import Error from "@/api/api_models/errors/Error";
import ValidationError from "@/api/api_models/errors/ValidationError";
import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
import handleAuthenticationError from "@/api/AuthenticationHelper";
import APIResponse from "@/api/helpers/models/APIResponse";
import { showAPIToast, showNetworkErrorToast } from "@/use/helpers/Toasts";
import ResponseHandler from "./ResponseHandler";

export default class GenericImmatriculationResponseHandler implements ResponseHandler<boolean> {
    handleResponse<T>(response: APIResponse<T>): T {
        if (response.networkError) {
            showNetworkErrorToast();
            return response.returnValue;
        }
        switch (response.statusCode) {
            case 400: {
                showAPIToast(response.statusCode);
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
                return response.returnValue;
            }
            case 500: {
                showAPIToast(response.statusCode);
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
export class MatriculationValidationResponseHandler implements ResponseHandler<UnsignedProposalMessage> {
    errorList: Error[] = [] as Error[];

    isValidationError(object: any): object is ValidationError {
        return "type" in object && object.type == "HLUnprocessableEntity";
    }

    isUnsignedProposalMessage(object: any): object is UnsignedProposalMessage {
        return (object as UnsignedProposalMessage).unsignedProposal !== undefined;
    }

    handleResponse(response: APIResponse<UnsignedProposalMessage>): UnsignedProposalMessage {
        if (this.isUnsignedProposalMessage(response.returnValue)) {
            return response.returnValue;
        } else {
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
                    return response.returnValue;
                }
                case 401: {
                    handleAuthenticationError(response);
                    return response.returnValue;
                }
                case 404: {
                    showAPIToast(response.statusCode, "matriculation data");
                    return response.returnValue;
                }
                case 422: {
                    return response.returnValue;
                }
                case 500: {
                    showAPIToast(response.statusCode);
                    return response.returnValue;
                }
                case 200: {
                    return response.returnValue;
                }
            }
        }
        return response.returnValue;
    }

    static _createTestErrors(object: any): { name: string; reason: string }[] {
        let errors = [];
        for (let key in object) {
            errors.push({ name: key, reason: key + " is invalid" });
        }

        return errors;
    }
}
