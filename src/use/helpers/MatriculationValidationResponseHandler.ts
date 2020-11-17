import UnsignedProposalMessage from "@/api/api_models/common/UnsignedProposalMessage";
import Error from "@/api/api_models/errors/Error";
import ValidationError from "@/api/api_models/errors/ValidationError";
import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";
import APIResponse from "@/api/helpers/models/APIResponse";
import ResponseHandler from "./ResponseHandler";

/**
 * Use this class for API calls, that return a boolean and can have validation errors (put, post)
 */
export default class MatriculationValidationResponseHandler implements ResponseHandler<boolean> {
    errorList: Error[] = [] as Error[];

    isValidationError(object: any): object is ValidationError {
        return "type" in object && object.type == "HLUnprocessableEntity";
    }

    isUnsignedProposalMessage(object: any): object is UnsignedProposalMessage {
        return (object as UnsignedProposalMessage).unsignedProposal !== undefined;
    }

    handleResponse(response: APIResponse<boolean | UnsignedProposalMessage>): boolean {
        if (this.isUnsignedProposalMessage(response.returnValue)) {
            return true;
        } else {
            if (this.isValidationError(response.error)) {
                for (let err of response.error.invalidParams) {
                    this.errorList.push(err);
                }
            }

            if (response.networkError) {
                alert("Network Error!");
                return false;
            }

            switch (response.statusCode) {
                case 400: {
                    alert("Wrong syntax.. Why are you seeing this?");
                    return false;
                }
                case 401: {
                    alert("Wrong password or username combination!");
                    return false;
                }
                case 404: {
                    alert("I don't think this is even possible, HOW IS THIS ERROR CODE GENERATED?");
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
