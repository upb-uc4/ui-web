import APIResponse from "@/api/helpers/models/APIResponse";

export default interface ResponseHandler<T> {
    handleResponse(response: APIResponse<T>): T;
}
