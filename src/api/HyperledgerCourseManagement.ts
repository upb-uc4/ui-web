import Common from "./Common";
import APIResponse from "./helpers/models/APIResponse";
import Course from "./api_models/course_management/Course";
import APIError from "./api_models/errors/APIError";
import { AxiosResponse, AxiosError } from "axios";
import ValidationError from "./api_models/errors/ValidationError";

export default class HyperledgerCourseManagement extends Common {
    constructor() {
        super("/hl-course-management");
    }

    async getCourses(name?: string): Promise<APIResponse<Course[]>> {
        let result: APIResponse<Course[]> = {
            error: {} as APIError,
            networkError: false,
            returnValue: [],
            statusCode: 0,
        };

        //optional name to search by
        if (name != undefined) {
            this._requestParameter.params.courseName = name;
        }

        await this._axios
            .get(`/courses`, this._requestParameter)
            .then((response: AxiosResponse) => {
                result.returnValue = response.data as Course[];
                result.statusCode = response.status;
            })
            .catch((error: AxiosError) => {
                console.log(error);
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
            .get(`/courses/${id}`, this._authHeader)
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
            .post("/courses", course, this._authHeader)
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
            .put(`/courses/${id}`, course, this._authHeader)
            .then((response: AxiosResponse) => {
                console.log(response);
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
            .delete(`/courses/${id}`, this._authHeader)
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
