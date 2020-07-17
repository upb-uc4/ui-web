import APIResponse from "@/api/helpers/models/APIResponse";

export default interface ResponseHandler<T> {
    handleReponse(response: APIResponse<T>): T;
}
