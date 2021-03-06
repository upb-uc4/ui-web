import axios, { AxiosError, AxiosResponse } from "axios";
import CourseAdmission from "./api_models/admission_management/CourseAdmission";
import APIError from "./api_models/errors/APIError";
import handleAuthenticationError from "./AuthenticationHelper";
import APIResponse from "./helpers/models/APIResponse";
import UnsignedProposalMessage from "./api_models/common/UnsignedProposalMessage";
import SignedProposalMessage from "./api_models/common/SignedProposalMessage";
import CommonHyperledger from "./CommonHyperledger";
import UnsignedTransactionMessage from "./api_models/common/UnsignedTransactionMessage";
import SignedTransactionMessage from "./api_models/common/SignedTransactionMessage";
import ExamAdmission from "./api_models/admission_management/ExamAdmission";
import AbstractAdmission from "./api_models/admission_management/AbstractAdmission";

export default class AdmissionManagement extends CommonHyperledger {
    protected static endpoint = "/admission-management";
    protected static serviceIdentifier = "admission";

    constructor() {
        super(AdmissionManagement.endpoint, AdmissionManagement.serviceIdentifier);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    async getCourseAdmissions(username?: string, courseId?: string, moduleId?: string): Promise<APIResponse<CourseAdmission[]>> {
        const requestParameter = { params: {} as any };
        if (username) requestParameter.params.username = username;
        if (courseId) requestParameter.params.courseId = courseId;
        if (moduleId) requestParameter.params.moduleId = moduleId;

        return await this._axios
            .get(`/admissions/courses`, requestParameter)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data as CourseAdmission[],
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
                            returnValue: [] as CourseAdmission[],
                            networkError: false,
                        })
                    ) {
                        return await this.getCourseAdmissions(username, courseId, moduleId);
                    }
                    return {
                        returnValue: {} as CourseAdmission[],
                        statusCode: error.response.status,
                        networkError: false,
                        error: error.response.data as APIError,
                    };
                } else {
                    return {
                        returnValue: {} as CourseAdmission[],
                        statusCode: 0,
                        networkError: true,
                        error: {} as APIError,
                    };
                }
            });
    }

    async getExamAdmissions(username?: string, examIds?: string[], admissionIds?: string[]): Promise<APIResponse<ExamAdmission[]>> {
        const requestParameter = { params: {} as any };
        if (username) requestParameter.params.username = username;
        if (examIds) requestParameter.params.examIds = examIds?.reduce((a, b) => a + "," + b, "");
        if (admissionIds) requestParameter.params.admissionIds = admissionIds.reduce((a, b) => a + "," + b, "");

        return await this._axios
            .get(`/admissions/exams`, requestParameter)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data as ExamAdmission[],
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
                            returnValue: [] as ExamAdmission[],
                            networkError: false,
                        })
                    ) {
                        return await this.getExamAdmissions(username, examIds, admissionIds);
                    }
                    return {
                        returnValue: {} as ExamAdmission[],
                        statusCode: error.response.status,
                        networkError: false,
                        error: error.response.data as APIError,
                    };
                } else {
                    return {
                        returnValue: {} as ExamAdmission[],
                        statusCode: 0,
                        networkError: true,
                        error: {} as APIError,
                    };
                }
            });
    }

    async getUnsignedAdmissionAddProposal(admission: AbstractAdmission): Promise<APIResponse<UnsignedProposalMessage>> {
        return await this._axios
            .post(`/admissions/unsigned_add_proposal`, admission)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.data as UnsignedProposalMessage,
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
                            returnValue: {} as UnsignedProposalMessage,
                            networkError: false,
                        })
                    ) {
                        return await this.getUnsignedAdmissionAddProposal(admission);
                    }
                    return {
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        returnValue: {} as UnsignedProposalMessage,
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        error: {} as APIError,
                        returnValue: {} as UnsignedProposalMessage,
                        networkError: true,
                    };
                }
            });
    }

    /**
     * Fetch an unsigned proposal for dropping an admission
     * @param admissionId admission id of admission to drop
     */
    async getUnsignedAdmissionDropProposal(admissionId: string): Promise<APIResponse<UnsignedProposalMessage>> {
        return await this._axios
            .post(`/admissions/unsigned_drop_proposal`, { admissionId })
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.data as UnsignedProposalMessage,
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
                            returnValue: {} as UnsignedProposalMessage,
                            networkError: false,
                        })
                    ) {
                        return await this.getUnsignedAdmissionDropProposal(admissionId);
                    }
                    return {
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        returnValue: {} as UnsignedProposalMessage,
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        error: {} as APIError,
                        returnValue: {} as UnsignedProposalMessage,
                        networkError: true,
                    };
                }
            });
    }
}
