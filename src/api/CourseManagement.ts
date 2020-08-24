import Common from "./Common";
import Course from "./api_models/course_management/Course";
import APIResponse from "./helpers/models/APIResponse";
import APIError from "./api_models/errors/APIError";
import { AxiosResponse, AxiosError } from "axios";
import ValidationError from "./api_models/errors/ValidationError";
import handleAuthenticationError from "./AuthenticationHelper";

export default class CourseManagement extends Common {
    constructor() {
        super("/course-management");
    }

    static async getVersion(): Promise<String> {
        return super.getVersion("/course-management");
    }

    async getCourses(courseName?: string, lecturerId?: string): Promise<APIResponse<Course[]>> {
        let result: APIResponse<Course[]> = {
            error: {} as APIError,
            networkError: false,
            returnValue: [],
            statusCode: 0,
        };

        const requestParameter = { params: {} as any };
        //optional name to search by
        if (courseName != undefined) {
            requestParameter.params.courseName = courseName;
        }
        if (lecturerId != undefined) {
            requestParameter.params.lecturerId = lecturerId;
        }

        var reloginSuccess = false;

        await this._axios
            .get(`/courses`, requestParameter)
            .then((response: AxiosResponse) => {
                result.returnValue = response.data as Course[];
                result.statusCode = response.status;
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    reloginSuccess = await handleAuthenticationError(result);
                } else {
                    result.networkError = true;
                }
            });

        if (result.statusCode == 401 && reloginSuccess) {
            return await this.getCourses(courseName, lecturerId);
        }

        return result;
    }

    async getCourse(id: string): Promise<APIResponse<Course>> {
        let result: APIResponse<Course> = {
            error: {} as APIError,
            networkError: false,
            returnValue: {} as Course,
            statusCode: 0,
        };

        var reloginSuccess = false;

        await this._axios
            .get(`/courses/${id}`)
            .then((response: AxiosResponse) => {
                result.statusCode = response.status;
                result.returnValue = response.data as Course;
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    reloginSuccess = await handleAuthenticationError(result);
                } else {
                    result.networkError = true;
                }
            });

        if (result.statusCode == 401 && reloginSuccess) {
            return await this.getCourse(id);
        }

        return result;
    }

    async createCourse(course: Course): Promise<APIResponse<boolean>> {
        let result: APIResponse<boolean> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };

        var reloginSuccess = false;

        await this._axios
            .post("/courses", course)
            .then((response: AxiosResponse) => {
                result.statusCode = response.status;
                result.returnValue = true;
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    result.error = error.response.data as ValidationError;
                    reloginSuccess = await handleAuthenticationError(result);
                } else {
                    result.networkError = true;
                }
            });

        if (result.statusCode == 401 && reloginSuccess) {
            return await this.createCourse(course);
        }

        return result;
    }

    async updateCourse(course: Course): Promise<APIResponse<boolean>> {
        let result: APIResponse<boolean> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };

        const id = course.courseId;
        var reloginSuccess = false;

        await this._axios
            .put(`/courses/${id}`, course)
            .then((response: AxiosResponse) => {
                result.returnValue = true;
                result.statusCode = response.status;
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    result.error = error.response.data as ValidationError;
                    reloginSuccess = await handleAuthenticationError(result);
                } else {
                    result.networkError = true;
                }
            });

        if (result.statusCode == 401 && reloginSuccess) {
            return await this.updateCourse(course);
        }

        return result;
    }

    async deleteCourse(id: string): Promise<APIResponse<boolean>> {
        let result: APIResponse<boolean> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };

        var reloginSuccess = false;

        await this._axios
            .delete(`/courses/${id}`)
            .then((response: AxiosResponse) => {
                result.returnValue = true;
                result.statusCode = response.status;
            })
            .catch(async (error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    reloginSuccess = await handleAuthenticationError(result);
                } else {
                    result.networkError = true;
                }
            });

        if (result.statusCode == 401 && reloginSuccess) {
            return await this.deleteCourse(id);
        }
        return result;
    }
}
