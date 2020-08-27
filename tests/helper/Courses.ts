import fs from "fs";
import Course from "@/api/api_models/course_management/Course";

export function getRandomizedCourse(): Course {
    const random = Math.floor(Math.random() * 9999);
    const course = JSON.parse(fs.readFileSync("@/../tests/fixtures/course.json", "utf-8")) as Course;
    course.courseName = course.courseName + "-" + random;

    return course;
}
