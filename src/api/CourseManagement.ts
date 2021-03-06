import { AxiosError, AxiosResponse } from "axios";
import Course from "./api_models/course_management/Course";
import APIError from "./api_models/errors/APIError";
import handleAuthenticationError from "./AuthenticationHelper";
import Common from "./Common";
import APIResponse from "./helpers/models/APIResponse";

export default class CourseManagement extends Common {
    protected static endpoint = "/course-management";
    protected static serviceIdentifier = "course";

    constructor() {
        super(CourseManagement.endpoint, CourseManagement.serviceIdentifier);
    }

    static async getVersion(): Promise<string> {
        return super.getVersion();
    }

    async getCourses(
        courseName?: string,
        lecturerId?: string,
        moduleIds?: string[],
        examregNames?: string[]
    ): Promise<APIResponse<Course[]>> {
        const requestParameter = { params: {} as any };
        //optional name to search by
        if (courseName != undefined) {
            requestParameter.params.courseName = courseName;
        }
        if (lecturerId != undefined) {
            requestParameter.params.lecturerId = lecturerId;
        }
        if (moduleIds != undefined) {
            requestParameter.params.moduleIds = moduleIds.reduce((a, b) => a + "," + b, "");
        }
        if (examregNames != undefined) {
            requestParameter.params.examregNames = examregNames.reduce((a, b) => a + "," + b, "");
        }

        return await this._axios
            .get(`/courses`, requestParameter)
            .then((response: AxiosResponse) => {
                return {
                    error: {} as APIError,
                    networkError: false,
                    returnValue: response.data as Course[],
                    statusCode: response.status,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    return {
                        error: error.response.data as APIError,
                        networkError: false,
                        returnValue: [] as Course[],
                        statusCode: error.response.status,
                    };
                } else {
                    return {
                        error: {} as APIError,
                        networkError: true,
                        returnValue: [] as Course[],
                        statusCode: 0,
                    };
                }
            });
    }

    async getCourse(id: string): Promise<APIResponse<Course>> {
        return await this._axios
            .get(`/courses/${id}`)
            .then((response: AxiosResponse) => {
                return {
                    statusCode: response.status,
                    returnValue: response.data as Course,
                    networkError: false,
                    error: {} as APIError,
                };
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    return {
                        statusCode: error.response.status,
                        returnValue: {} as Course,
                        networkError: false,
                        error: error.response.data as APIError,
                    };
                } else {
                    return {
                        statusCode: 0,
                        returnValue: {} as Course,
                        networkError: true,
                        error: {} as APIError,
                    };
                }
            });
    }

    async createCourse(course: Course): Promise<APIResponse<boolean>> {
        return await this._axios
            .post("/courses", course)
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
                            returnValue: {} as Course,
                            networkError: false,
                        })
                    ) {
                        return await this.createCourse(course);
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

    async updateCourse(course: Course): Promise<APIResponse<boolean>> {
        return await this._axios
            .put(`/courses/${course.courseId}`, course)
            .then((response: AxiosResponse) => {
                return {
                    error: {} as APIError,
                    networkError: false,
                    returnValue: true,
                    statusCode: response.status,
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
                        return await this.updateCourse(course);
                    }
                    return {
                        networkError: false,
                        returnValue: false,
                        statusCode: error.response.status,
                        error: error.response.data as APIError,
                    };
                } else {
                    return {
                        networkError: false,
                        returnValue: true,
                        statusCode: 0,
                        error: {} as APIError,
                    };
                }
            });
    }

    async deleteCourse(id: string): Promise<APIResponse<boolean>> {
        return await this._axios
            .delete(`/courses/${id}`)
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
                        return await this.deleteCourse(id);
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
}
