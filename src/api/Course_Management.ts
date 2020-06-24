import Common from "./Common"
import { Course } from "@/entities/Course"

export default class Course_Management extends Common {
    constructor() {
        super("/course-management");
     }

    async getCourses(name?: string): Promise<Course[]> {
        var courses: Course[] = [];

        //optional name to search by 
        if (name != undefined) {
            this._requestParameter.params.courseName = name;
        }

        await this._axios.get(`/courses`, this._requestParameter)
                    .then((response: any) => {
                        console.log(response)
                        courses = response.data;
                    })
                    .catch((error: any) => {
                        console.log(error)
                        if (!error.reponse) {
                            return console.log("Network Error")
                        }
                        if (error.response.status == "401") {
                            console.log(error)
                        } else if (error.response.status == "403") {
                            console.log(error)
                        }
                    }).then(()=> {
                        return courses;
                    });

        return courses;
    }

    async getCourse(id: string): Promise<{course: Course, found: boolean}> {
        var course: Course = new Course();
        var found: boolean = false;
        await this._axios.get(`/courses/${id}`, this._authHeader)
                    .then((response: any) => {
                        console.log(response)
                        course = response.data;
                        found = true;
                    })
                    .catch((error: any) => {
                        if (!error.reponse) {
                            return console.log("Network Error")
                        }
                        if (error.response.status == "401") {
                            console.log(error)
                        } else if (error.response.status == "403") {
                            console.log(error)
                        }
                    }).then(()=> {
                        return course;
                    });

        return {course: course, found: found};
    }

    async createCourse(course: Course): Promise<boolean> {
        let success = false;
        await this._axios.post("/courses", course, this._authHeader)
                    .then((response: any) => {
                        console.log(response)
                        success = true;
                    })
                    .catch((error: any) => {
                        if (error.response.status == "401") {
                            console.log(error)
                        } else if (error.response.status == "403") {
                            console.log(error)
                        } else if (error.response.status == "400") {
                            console.log(error.response)
                        }
                    });    
        return success
    }

    async updateCourse(course: Course): Promise<boolean> {
        const id = course.courseId;
        let success = false;
        await this._axios.put(`/courses/${id}`, course, this._authHeader)
                    .then((response: any) => {
                        console.log(response)
                        success = true
                    })
                    .catch((error: any) => {
                        if (error.response.status == "401") {
                            console.log(error)
                        } else if (error.response.status == "403") {
                            console.log(error)
                        }
                    });    
        return success;
    }    

    async deleteCourse(id: string): Promise<boolean> {
        let success = false;
        await this._axios.delete(`/courses/${id}`, this._authHeader)
                    .then((response: any) => {
                        console.log(response)
                        success = true;
                    })
                    .catch((error: any) => {
                        if (error.response.status == "401") {
                            console.log(error)
                        } else if (error.response.status == "403") {
                            console.log(error)
                        }
                    });    
        return success;
    }  

}