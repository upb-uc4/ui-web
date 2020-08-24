import ResponseHandler from "./ResponseHandler";
import APIResponse from "../api/helpers/models/APIResponse";
import Student from "@/api/api_models/user_management/Student";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Admin from "@/api/api_models/user_management/Admin";

export default class ProfileResponseHandler implements ResponseHandler<Student | Lecturer | Admin> {
    handleResponse(response: APIResponse<Student | Lecturer | Admin>): Student | Lecturer | Admin {
        if (response.networkError) {
            //todo show or do something
        }
        switch (response.statusCode) {
            case 400: {
                //todo
                break;
            }
            case 401: {
                //todo
                break;
            }
            case 404: {
                //todo
                break;
            }
        }
        return response.returnValue;
    }
}
