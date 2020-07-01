import ResponseHandler from "./ResponeHandler"
import APIResponse from "../api/helpers/models/APIResponse"

export default class LoginResponseHandler implements ResponseHandler<boolean> {
    handleReponse(response: APIResponse<boolean>): boolean {
        console.log(response)
        if (response.networkError) {
            //TODO show toast
            alert("Network Error")
            return false;
        }
        switch (response.statusCode) {
            case 400: {
                //TODO show toast
                return false;
            }
            case 401: {
                alert("Wrong password or username combination!")
                return false;
            }
            case 404: {
                //TODO show toast
                return false;
            }
            case 200: {
                return true;
            }
        }

        return false;
    }

}