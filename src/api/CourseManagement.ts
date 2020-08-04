import Common from "./Common";
import Course from "./api_models/course_management/Course";
import APIResponse from "./helpers/models/APIResponse";
import APIError from "./api_models/errors/APIError";
import { AxiosResponse, AxiosError } from "axios";
import ValidationError from "./api_models/errors/ValidationError";

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

        const requestParameter = { ...(await this._authHeader), params: {} as any };
        //optional name to search by
        if (courseName != undefined) {
            requestParameter.params.courseName = courseName;
        }
        if (lecturerId != undefined) {
            requestParameter.params.lecturerId = lecturerId;
        }

        await this._axios
            .get(`/courses`, requestParameter)
            .then((response: AxiosResponse) => {
                result.returnValue = response.data as Course[];
                result.statusCode = response.status;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
            });

        return result;
    }

    async getCourse(id: string): Promise<APIResponse<Course>> {
        let result: APIResponse<Course> = {
            error: {} as APIError,
            networkError: false,
            returnValue: {} as Course,
            statusCode: 0,
        };

        await this._axios
            .get(`/courses/${id}`, await this._authHeader)
            .then((response: AxiosResponse) => {
                result.statusCode = response.status;
                result.returnValue = response.data as Course;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
            });

        return result;
    }

    async createCourse(course: Course): Promise<APIResponse<boolean>> {
        let result: APIResponse<boolean> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };

        await this._axios
            .post("/courses", course, await this._authHeader)
            .then((response: AxiosResponse) => {
                result.statusCode = response.status;
                result.returnValue = true;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    result.error = error.response.data as ValidationError;
                } else {
                    result.networkError = true;
                }
            });

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

        await this._axios
            .put(`/courses/${id}`, course, await this._authHeader)
            .then((response: AxiosResponse) => {
                result.returnValue = true;
                result.statusCode = response.status;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                    result.error = error.response.data as ValidationError;
                } else {
                    result.networkError = true;
                }
            });

        return result;
    }

    async deleteCourse(id: string): Promise<APIResponse<boolean>> {
        let result: APIResponse<boolean> = {
            error: {} as APIError,
            networkError: false,
            returnValue: false,
            statusCode: 0,
        };

        await this._axios
            .delete(`/courses/${id}`, await this._authHeader)
            .then((response: AxiosResponse) => {
                result.returnValue = true;
                result.statusCode = response.status;
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    result.statusCode = error.response.status;
                } else {
                    result.networkError = true;
                }
            });

        return result;
    }
}
