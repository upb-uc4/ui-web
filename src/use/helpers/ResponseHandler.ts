import APIResponse from "@/api/helpers/models/APIResponse";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import { useStore } from "@/use/store/store";

export default interface ResponseHandler<T> {
    handleResponse(response: APIResponse<T>): T;
}
