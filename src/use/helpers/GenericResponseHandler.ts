import handleAuthenticationError from "@/api/AuthenticationHelper";
import APIResponse from "@/api/helpers/models/APIResponse";
import { showAPIToast, showNetworkErrorToast } from "@/use/helpers/Toasts";
import ResponseHandler from "./ResponseHandler";

export default class GenericResponseHandler implements ResponseHandler<boolean> {
    dataType: string;

    constructor(msg: string) {
        this.dataType = msg;
    }

    handleResponse<T>(response: APIResponse<T>): T {
        if (response.networkError) {
            showNetworkErrorToast();
            return response.returnValue;
        }
        switch (response.statusCode) {
            case 400:
            case 500:
            case 502:
            case 503: {
                showAPIToast(response.statusCode);
                return response.returnValue;
            }
            case 401: {
                handleAuthenticationError(response);
                return response.returnValue;
            }
            case 403: {
                showAPIToast(response.statusCode, this.dataType);
                return response.returnValue;
            }
            case 404: {
                showAPIToast(response.statusCode, this.dataType);
                return response.returnValue;
            }
            case 200: {
                return response.returnValue;
            }
        }

        return response.returnValue;
    }
}
