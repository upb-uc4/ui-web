import Error from "@/api/api_models/errors/Error";
import APIResponse from "@/api/helpers/models/APIResponse";
import ValidationResponseHandler from "./ValidationResponseHandler";

export default class AccountValidationResponseHandler extends ValidationResponseHandler {
    handleReponse(response: APIResponse<boolean>): boolean {
        const result: boolean = super.handleResponse(response);

        if (response.statusCode == 409) {
            const error: Error = { name: "username", reason: response.error.title };
            this.errorList.push(error);
        }

        return result;
    }
}
