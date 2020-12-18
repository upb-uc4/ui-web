import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
import { AxiosError, AxiosResponse } from "axios";
import APIError from "./api_models/errors/APIError";
import Module from "./api_models/exam_reg_management/Module";
import handleAuthenticationError from "./AuthenticationHelper";
import CommonHyperledger from "./CommonHyperledger";
import APIResponse from "./helpers/models/APIResponse";
import ServiceVersion from "@/api/helpers/models/ServiceVersion";

export default class ExaminationRegulationManagement extends CommonHyperledger {
    protected static endpoint = "/examreg-management";

    constructor() {
        super(ExaminationRegulationManagement.endpoint);
    }

    async getModules(moduleIds?: string[]): Promise<APIResponse<Module[]>> {
        const requestParameter = { params: {} as any };
        if (moduleIds != undefined) {
            requestParameter.params.moduleIds = moduleIds.reduce((a, b) => a + "," + b, "");
        }

        return await this._axios
            .get("/examination-regulations/modules", requestParameter)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.data as Module[],
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
                            returnValue: [] as Module[],
                            networkError: false,
                        })
                    ) {
                        return await this.getModules(moduleIds);
                    }
                    return {
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        returnValue: [] as Module[],
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        error: {} as APIError,
                        returnValue: [] as Module[],
                        networkError: true,
                    };
                }
            });
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

    async createExaminationRegulation(examReg: ExaminationRegulation): Promise<APIResponse<boolean>> {
        return await this._axios
            .post("/examination-regulations", examReg)
            .then((response: AxiosResponse) => {
                return {
                    error: {} as APIError,
                    networkError: false,
                    statusCode: response.status,
                    returnValue: true,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: false,
                            networkError: false,
                        })
                    ) {
                        return await this.createExaminationRegulation(examReg);
                    }
                    return {
                        error: error.response.data as APIError,
                        networkError: false,
                        statusCode: error.response.status,
                        returnValue: false,
                    };
                } else {
                    return {
                        error: {} as APIError,
                        networkError: true,
                        statusCode: 0,
                        returnValue: false,
                    };
                }
            });
    }

    async deleteExaminationRegulation(name: string): Promise<APIResponse<boolean>> {
        return await this._axios
            .delete(`/examination-regulations/${name}`)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: true,
                    statusCode: response.status,
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
                            returnValue: false,
                            networkError: false,
                        })
                    ) {
                        return await this.deleteExaminationRegulation(name);
                    }
                    return {
                        returnValue: false,
                        statusCode: error.response.status,
                        networkError: false,
                        error: error.response.data as APIError,
                    };
                } else {
                    return {
                        returnValue: false,
                        statusCode: 0,
                        networkError: true,
                        error: {} as APIError,
                    };
                }
            });
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    static getServiceVersion(): Promise<ServiceVersion> {
        return super.getServiceVersion().then(async (version: ServiceVersion) => {
            version.changelogURL = `https://github.com/upb-uc4/University-Credits-4.0/blob/examreg-${version.version}/product_code/examreg_service/CHANGELOG.md`;
            //todo inject the hyperledger version in the promise
            return version;
        });
    }
}
