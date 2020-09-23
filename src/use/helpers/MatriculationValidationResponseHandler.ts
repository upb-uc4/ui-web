import ResponseHandler from "./ResponseHandler";
import APIResponse from "@/api/helpers/models/APIResponse";
import ValidationError from "@/api/api_models/errors/ValidationError";
import Error from "@/api/api_models/errors/Error";
import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";

/**
 * Use this class for API calls, that return a boolean and can have validation errors (put, post)
 */
export default class MatriculationValidationResponseHandler implements ResponseHandler<boolean> {
    errorList: Error[] = [] as Error[];

    isValidationError(object: any): object is ValidationError {
        return "type" in object && object.type == "validation error";
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
