import ResponseHandler from "./ResponseHandler";
import APIResponse from "../api/helpers/models/APIResponse";

export default class GenericResponseHandler implements ResponseHandler<boolean> {
    handleReponse<T>(response: APIResponse<T>): T {
        console.log(response);
        if (response.networkError) {
            //TODO show toast
            alert("Network Error");
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
        }

        return response.returnValue;
    }
}
