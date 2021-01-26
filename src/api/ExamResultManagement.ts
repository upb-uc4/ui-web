import { AxiosError, AxiosResponse } from "axios";
import UnsignedProposalMessage from "./api_models/common/UnsignedProposalMessage";
import APIError from "./api_models/errors/APIError";
import Exam from "./api_models/exam_management/Exam";
import handleAuthenticationError from "./AuthenticationHelper";
import CommonHyperledger from "./CommonHyperledger";
import APIResponse from "./helpers/models/APIResponse";

export default class ExamResultManagement extends CommonHyperledger {
    protected static endpoint = "/examresult-management";

    constructor() {
        super(ExamResultManagement.endpoint);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    async getExamResults(username?: string, examIds?: string[]): Promise<APIResponse<Exam[]>> {
        const requestParameter = { params: {} as any };
        if (examIds) requestParameter.params.examIds = examIds.reduce((a, b) => a + "," + b, "");
        if (username) requestParameter.params.username = username;

        return await this._axios
            .get(`/examresults`, requestParameter)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data as Exam[],
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
                            returnValue: [],
                            networkError: false,
                        })
                    ) {
                        return await this.getExamResults(username, examIds);
                    }
                    return {
                        returnValue: [],
                        statusCode: error.response.status,
                        networkError: false,
                        error: error.response.data as APIError,
                    };
                } else {
                    return {
                        returnValue: [],
                        statusCode: 0,
                        networkError: true,
                        error: {} as APIError,
                    };
                }
            });
    }

    /**
     * Fetch an unsigned proposal for adding a course admission
     * @param courseAdmission courseAdmission
     */
    async getUnsignedExamCreateProposal(exam: Exam): Promise<APIResponse<UnsignedProposalMessage>> {
        return await this._axios
            .post(`/admissions/courses/unsigned_add_proposal`, exam)
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
                        return await this.getUnsignedExamCreateProposal(exam);
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
