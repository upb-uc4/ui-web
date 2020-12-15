import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import { MutationTypes } from "@/use/store/mutation-types";
import { useStore } from "@/use/store/store";
import axios, { AxiosError, AxiosResponse } from "axios";
import CourseAdmission from "./api_models/admission_management/CourseAdmission";
import APIError from "./api_models/errors/APIError";
import User from "./api_models/user_management/User";
import handleAuthenticationError from "./AuthenticationHelper";
import Common from "./Common";
import APIResponse from "./helpers/models/APIResponse";
import UserManagement from "./UserManagement";
import UnsignedProposalMessage from "./api_models/common/UnsignedProposalMessage";
import SignedProposalMessage from "./api_models/common/SignedProposalMessage";
import CommonHyperledger from "./CommonHyperledger";
import UnsignedTransactionMessage from "./api_models/common/UnsignedTransactionMessage";
import SignedTransactionMessage from "./api_models/common/SignedTransactionMessage";

export default class AdmissionManagement extends CommonHyperledger {
    protected static endpoint = "/admission-management";

    constructor() {
        super(AdmissionManagement.endpoint);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    /**
     * Submit a signed admissions proposal
     * @param signedProposal signed proposal
     */
    async submitSignedAdmissionsProposal(signedProposal: SignedProposalMessage): Promise<APIResponse<UnsignedTransactionMessage>> {
        return await this._axios
            .post(`/admissions/proposal/submit`, signedProposal)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.data,
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
                            returnValue: {} as any,
                            networkError: false,
                        })
                    ) {
                        return await this.submitSignedAdmissionsProposal(signedProposal);
                    }
                    return {
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        returnValue: {} as any,
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        error: {} as APIError,
                        returnValue: {} as any,
                        networkError: true,
                    };
                }
            });
    }

    async submitSignedAdmissionsTransaction(message: SignedTransactionMessage): Promise<APIResponse<boolean>> {
        return await this._axios
            .post(`/admissions/signed_transaction`, message)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: true,
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
                        return await this.submitSignedAdmissionsTransaction(message);
                    }
                    return {
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        returnValue: false,
                        networkError: false,
                    };
                } else {
                    return {
                        statusCode: 0,
                        error: {} as APIError,
                        returnValue: false,
                        networkError: true,
                    };
                }
            });
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

    /**
     * Fetch an unsigned proposal for adding a course admission
     * @param courseAdmission courseAdmission
     */
    async getUnsignedCourseAdmissionAddProposal(courseAdmission: CourseAdmission): Promise<APIResponse<UnsignedProposalMessage>> {
        return await this._axios
            .post(`/admissions/courses/proposal/add`, courseAdmission)
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
                        return await this.getUnsignedCourseAdmissionAddProposal(courseAdmission);
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
     * Fetch an unsigned proposal for dropping a course admission
     * @param admissionId admission id of admission to drop
     */
    async getUnsignedCourseAdmissionDropProposal(admissionId: string): Promise<APIResponse<UnsignedProposalMessage>> {
        return await this._axios
            .post(`/admissions/courses/proposal/drop`, { admissionId })
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
                        return await this.getUnsignedCourseAdmissionDropProposal(admissionId);
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
