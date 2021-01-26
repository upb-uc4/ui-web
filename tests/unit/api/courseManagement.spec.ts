import Course from "@/api/api_models/course_management/Course";
import CourseManagement from "@/api/CourseManagement";
import { readFileSync } from "fs";
import { getRandomizedCourse } from "../../helper/Courses";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";

var courseManagement: CourseManagement;
const lecturerAuth = JSON.parse(readFileSync("tests/fixtures/logins/lecturer.json", "utf-8")) as {
    username: string;
    password: string;
};
const course = getRandomizedCourse();
var createdCourse: Course = {} as Course;

jest.setTimeout(30000);

beforeAll(async () => {
    const success = await MachineUserAuthenticationManagement._getRefreshToken(lecturerAuth);

    courseManagement = new CourseManagement();
    expect(success.returnValue.login).not.toEqual("");
});

test("Create course", async () => {
    const success = await courseManagement.createCourse(course);
    expect(success.returnValue).toBe(true);
    await new Promise((r) => setTimeout(r, 5000));
});

test("Get all courses", async () => {
    const courses = await courseManagement.getCourses();
    const filteredCourses = courses.returnValue.filter((c: Course) => c.courseName === course.courseName);
    expect(filteredCourses.length > 0).toBe(true);
});

test("Get lecturers courses", async () => {
    const courses = await courseManagement.getCourses(undefined, lecturerAuth.username);
    const filteredCourses = courses.returnValue.filter((c: Course) => c.courseName === course.courseName);
    expect(filteredCourses.length > 0).toBe(true);
});

test("Get courses by name", async () => {
    const courses = await courseManagement.getCourses(course.courseName, undefined);
    const filteredCourses = courses.returnValue.filter((c: Course) => c.courseName === course.courseName);
    expect(filteredCourses.length > 0).toBe(true);
});

test("Get lecturers courses by name", async () => {
    const courses = await courseManagement.getCourses(course.courseName, lecturerAuth.username);
    expect(courses.returnValue.length).toBeGreaterThan(0);
    createdCourse = courses.returnValue[0];
});

test("Get courses by module", async () => {
    const courses = await courseManagement.getCourses(undefined, undefined, ["M.1275.01158"]);
    expect(courses.returnValue.length).toBeGreaterThan(0);
});

test("Update course", async () => {
    createdCourse.courseName = "Worst test course ever!";
    const success = await courseManagement.updateCourse(createdCourse);
    expect(success.returnValue).toBe(true);
});

test("Delete course", async () => {
    const success = await courseManagement.deleteCourse(createdCourse.courseId);
    expect(success.returnValue).toBe(true);
});
