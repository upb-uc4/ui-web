import ResponseHandler from "./ResponeHandler"
import APIResponse from "../api/helpers/models/APIResponse"
import ValidationError from '@/api/api_models/errors/ValidationError';

/**
 * Use this class for API calls, that return a boolean and can have validation errors (put, post)
 */
export default class ValidationResponseHandler implements ResponseHandler<boolean> {
    errorList: {
        name: string;
        reason: string;
    }[] = [] as {
        name: string;
        reason: string;
    }[];

    isValidationError(object: any): object is ValidationError {
        return "invalidParams" in object;
    }

    handleReponse(response: APIResponse<boolean>): boolean {
        
        if (this.isValidationError(response.error)) {
            for(let err of response.error.invalidParams) {
                this.errorList.push(err);
            }
        }

        if (response.networkError) {
            //TODO show toast
            return false;
        }

        switch (response.statusCode) {
            case 400: {
                //TODO show toast
                return false;
            }
            case 401: {
                //TODO show toast
                return false;
            }
            case 404: {
                //TODO show toast
                return false;
            }
            case 422: {
                return false;
            }
            case 200: {
                return true;
            }
        }

        return false;
    }

}