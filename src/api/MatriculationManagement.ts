import Common from "./Common";
import APIResponse from "./helpers/models/APIResponse";
import MatriculationData from "./api_models/matriculation_management/MatriculationData";
import APIError from "./api_models/errors/APIError";
import { AxiosResponse, AxiosError } from "axios";
import { useStore } from "@/use/store/store";
import SubjectMatriculation from "./api_models/matriculation_management/SubjectMatriculation";

export default class MatriculationManagement extends Common {
    constructor() {
        super("/matriculation-management");
    }

    async updateMatriculationData(
        username: string,
        matriculation: SubjectMatriculation[]
    ): Promise<APIResponse<boolean | MatriculationData>> {
        let result: APIResponse<boolean | MatriculationData> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };

        let payload = { matriculation };

        await this._axios
            .put(`/${username}`, payload, await this._authHeader)
            .then((response: AxiosResponse) => {
                result.statusCode = response.status;
                if (response.status == 201) {
                    result.returnValue = response.data as MatriculationData;
                } else {
                    result.returnValue = true;
                }
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    result.error = error.response.data as APIError;
                } else {
                    result.networkError = true;
                }
            });
        return result;
    }

    async getMatriculationHistory(username: string): Promise<APIResponse<MatriculationData>> {
        let result: APIResponse<MatriculationData> = {
            error: {} as APIError,
            networkError: false,
            returnValue: {} as MatriculationData,
            statusCode: 0,
        };

        await this._axios
            .get(`/history/${username}`, await this._authHeader)
            .then((response: AxiosResponse) => {
                result.returnValue = response.data as MatriculationData;
                result.statusCode = response.status;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
            });

        return result;
    }

    async getOwnMatriculationHistory(): Promise<APIResponse<MatriculationData>> {
        const store = useStore();
        const username = (await store.getters.loginData).username;
        return this.getMatriculationHistory(username);
    }

    static async getVersion(): Promise<String> {
        return super.getVersion("/matriculation-management");
    }
}
