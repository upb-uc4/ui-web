import Common from "./Common";
import APIResponse from "./helpers/models/APIResponse";
import MatriculationData from "./api_models/matriculation_management/MatriculationData";
import APIError from "./api_models/errors/APIError";
import { AxiosResponse, AxiosError } from "axios";
import { useStore } from "@/use/store/store";
import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
import handleAuthenticationError from "./AuthenticationHelper";

export default class ExaminationRegulationManagement extends Common {
    constructor() {
        super("/exam-reg-management");
    }

    async getExaminationRegulation(names?: string[]): Promise<APIResponse<ExaminationRegulation[]>> {
        const requestParameter = { params: {} as any };
        if (names != undefined) {
            requestParameter.params.regulations = names.reduce((a, b) => a + "," + b, "");
        }

        return await this._axios
            .get("/examination-regulations", requestParameter)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.data as ExaminationRegulation[],
                    networkError: false,
                    error: {} as APIError,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: [] as ExaminationRegulation[],
                            networkError: false,
                        })
                    ) {
                        return await this.getExaminationRegulation(names);
                    }
                    return {
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        returnValue: [] as ExaminationRegulation[],
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        error: {} as APIError,
                        returnValue: [] as ExaminationRegulation[],
                        networkError: true,
                    };
                }
            });
    }

    async getExaminationRegulationNames(): Promise<APIResponse<string[]>> {
        return await this._axios
            .get("/examination-regulations/names")
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.data as string[],
                    networkError: false,
                    error: {} as APIError,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: [] as string[],
                            networkError: false,
                        })
                    ) {
                        return await this.getExaminationRegulationNames();
                    }
                    return {
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        returnValue: [] as string[],
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        error: {} as APIError,
                        returnValue: [] as string[],
                        networkError: true,
                    };
                }
            });
    }

    static async getVersion(): Promise<string> {
        return super.getVersion("/exam-reg-management");
    }
}
