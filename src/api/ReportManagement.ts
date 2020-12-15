import { AxiosError, AxiosResponse } from "axios";
import Course from "./api_models/course_management/Course";
import APIError from "./api_models/errors/APIError";
import handleAuthenticationError from "./AuthenticationHelper";
import Common from "./Common";
import APIResponse from "./helpers/models/APIResponse";

export default class ReportManagement extends Common {
    protected static endpoint = "/report-management";

    constructor() {
        super(ReportManagement.endpoint);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    async getArchive(username: string): Promise<APIResponse<File | string>> {
        return await this._axios
            .get(`/reports/${username}/result`, {
                responseType: "arraybuffer",
            })
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    let blob: Blob = new Blob([response.data], { type: response.headers["content-type"] });
                    const file: File = new File([blob], "image.png", { type: response.headers["content-type"] });
                    return {
                        error: {} as APIError,
                        networkError: false,
                        statusCode: response.status,
                        returnValue: file,
                    };
                } else if (response.status === 202) {
                    return {
                        error: {} as APIError,
                        networkError: false,
                        statusCode: response.status,
                        returnValue: response.headers["X-UC4-timestamp"],
                    };
                } else {
                    return Promise.reject("Something went wrong in the archive request.");
                }
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    if (
                        await handleAuthenticationError({
                            statusCode: error.response.status,
                            error: error.response.data as APIError,
                            returnValue: {} as File,
                            networkError: false,
                        })
                    ) {
                        return await this.getArchive(username);
                    }
                    return {
                        returnValue: {} as File,
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        returnValue: {} as File,
                        statusCode: 0,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }

    async deleteArchive(username: string): Promise<APIResponse<boolean>> {
        return await this._axios
            .delete(`/reports/${username}/result`)
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
                        return await this.deleteArchive(username);
                    }
                    return {
                        returnValue: false,
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                        networkError: false,
                    };
                } else {
                    return {
                        returnValue: false,
                        statusCode: 0,
                        error: {} as APIError,
                        networkError: true,
                    };
                }
            });
    }
}
