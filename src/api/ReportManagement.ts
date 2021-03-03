import { AxiosError, AxiosResponse } from "axios";
import APIError from "./api_models/errors/APIError";
import handleAuthenticationError from "./AuthenticationHelper";
import Common from "./Common";
import APIResponse from "./helpers/models/APIResponse";

export default class ReportManagement extends Common {
    protected static endpoint = "/report-management";
    protected static serviceIdentifier = "examreg";

    constructor() {
        super(ReportManagement.endpoint, ReportManagement.serviceIdentifier);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    async getCertificateOfEnrollment(username: string, semester: string): Promise<APIResponse<File>> {
        const params = {} as any;

        let base64UrlSemester = btoa(semester);
        base64UrlSemester = base64UrlSemester.replace(/\+/g, "-");
        base64UrlSemester = base64UrlSemester.replace(/\//g, "_");
        base64UrlSemester = base64UrlSemester.replace(/=/g, "");

        params.semester = base64UrlSemester;

        return await this._axios
            .get(`/certificates/${username}/enrollment`, { params, responseType: "arraybuffer" })
            .then((response: AxiosResponse) => {
                let blob: Blob = new Blob([response.data], { type: response.headers["content-type"] });
                const file: File = new File([blob], "certificate.pdf", { type: response.headers["content-type"] });
                return {
                    error: {} as APIError,
                    networkError: false,
                    statusCode: response.status,
                    returnValue: file,
                };
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
                        return await this.getCertificateOfEnrollment(username, semester);
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

    async getTranscriptOfRecords(username: string, exregName: string): Promise<APIResponse<File>> {
        const params = {} as any;

        let base64UrlExregName = btoa(exregName);
        base64UrlExregName = base64UrlExregName.replace(/\+/g, "-");
        base64UrlExregName = base64UrlExregName.replace(/\//g, "_");
        base64UrlExregName = base64UrlExregName.replace(/=/g, "");

        params.exregName = base64UrlExregName;

        return await this._axios
            .get(`/certificates/${username}/transcript_of_records`, { params, responseType: "arraybuffer" })
            .then((response: AxiosResponse) => {
                let blob: Blob = new Blob([response.data], { type: response.headers["content-type"] });
                const file: File = new File([blob], "records.pdf", { type: response.headers["content-type"] });
                return {
                    error: {} as APIError,
                    networkError: false,
                    statusCode: response.status,
                    returnValue: file,
                };
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
                        return await this.getTranscriptOfRecords(username, exregName);
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

    async getArchive(username: string): Promise<APIResponse<File | string>> {
        return await this._axios
            .get(`/reports/${username}/archive`, {
                responseType: "arraybuffer",
            })
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    let blob: Blob = new Blob([response.data], { type: response.headers["content-type"] });
                    const file: File = new File([blob], "archive.zip", { type: response.headers["content-type"] });
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
                        returnValue: response.headers["x-uc4-timestamp"],
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
            .delete(`/reports/${username}/archive`)
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
