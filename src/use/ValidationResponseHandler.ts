import ResponseHandler from "./ResponseHandler";
import APIResponse from "../api/helpers/models/APIResponse";
import ValidationError from "@/api/api_models/errors/ValidationError";
import Error from "@/api/api_models/errors/Error";

/**
 * Use this class for API calls, that return a boolean and can have validation errors (put, post)
 */
export default class ValidationResponseHandler implements ResponseHandler<boolean> {
    errorList: Error[] = [] as Error[];

    isValidationError(object: any): object is ValidationError {
        return "type" in object && object.type == "validation error";
    }

    handleReponse(response: APIResponse<boolean>): boolean {
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
                alert("Validation error!");
                console.log(response);
                console.log(this.errorList);
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
