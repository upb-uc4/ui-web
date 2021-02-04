import { AxiosError, AxiosResponse } from "axios";
import UnsignedProposalMessage from "./api_models/common/UnsignedProposalMessage";
import APIError from "./api_models/errors/APIError";
import Exam from "./api_models/exam_management/Exam";
import ExamResult from "./api_models/exam_result_management/ExamResult";
import handleAuthenticationError from "./AuthenticationHelper";
import CommonHyperledger from "./CommonHyperledger";
import APIResponse from "./helpers/models/APIResponse";

export default class ExamResultManagement extends CommonHyperledger {
    protected static endpoint = "/exam-result-management";
    protected static serviceIdentifier = "exam-result";

    constructor() {
        super(ExamResultManagement.endpoint, ExamResultManagement.serviceIdentifier);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    async getExamResults(username?: string, examIds?: string[]): Promise<APIResponse<ExamResult[]>> {
        const requestParameter = { params: {} as any };
        if (examIds) requestParameter.params.examIds = examIds.reduce((a, b) => a + "," + b, "");
        if (username) requestParameter.params.username = username;

        return await this._axios
            .get(`/exam_results`, requestParameter)
            .then((response: AxiosResponse) => {
                return {
                    returnValue: response.data as ExamResult[],
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

    async getUnsignedExamResultAddProposal(examResults: ExamResult[]): Promise<APIResponse<UnsignedProposalMessage>> {
        return await this._axios
            .post(`/exan_results/unsigned_add_proposal`, examResults)
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
                        return await this.getUnsignedExamResultAddProposal(examResults);
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
