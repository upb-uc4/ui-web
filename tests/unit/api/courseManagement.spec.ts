import { Role } from "@/entities/Role";
import { Account } from "@/entities/Account";
import { CourseEntity } from "@/entities/CourseEntity";
import Course from "@/api/api_models/course_management/Course";
import { Language } from "@/entities/Language";
import { CourseType } from "@/entities/CourseType";
import UserManagement from "@/api/UserManagement";
import CourseManagement from "@/api/CourseManagement";
import { store } from "@/store/store";
import { MutationTypes } from "@/store/mutation-types";
import GenericResponseHandler from "@/use/GenericResponseHandler";

var courseManagement: CourseManagement;
const adminAuth = { username: "admin", password: "admin" };
const studentAuth = { username: "student", password: "student" };
const lecturerAuth = { username: "lecturer", password: "lecturer" };
var course = new CourseEntity();
var createdCourse: Course = {} as Course;
jest.setTimeout(30000);

beforeAll(async () => {
    const success = await UserManagement.login(lecturerAuth);
    store.commit(MutationTypes.SET_LOGINDATA, lecturerAuth);
    store.commit(MutationTypes.SET_LOGGEDIN, true);
    store.commit(MutationTypes.SET_ROLE, "Lecturer");
    courseManagement = new CourseManagement();
    expect(success.returnValue).toBe(true);
});

test("Create course", async () => {
    course.courseDescription = "This is a course description.";
    course.courseId = "-1";
    course.courseLanguage = Language.ENGLISH;
    course.courseName = "Best test course ever!";
    course.courseType = CourseType.LECTURE;
    course.currentParticipants = 5;
    course.ects = 60;
    course.startDate = "1999-01-01";
    course.endDate = "2000-01-01";
    course.lecturerId = "lecturer";
    course.maxParticipants = 10;

    const success = await courseManagement.createCourse(course);

    expect(success.returnValue).toBe(true);
});

test("Get all courses", async () => {
    await new Promise((r) => setTimeout(r, 5000));
    const courses = await courseManagement.getCourses();
    const filteredCourses = courses.returnValue.filter((c: Course) => c.courseName === "Best test course ever!");
    expect(filteredCourses.length > 0).toBe(true);
    createdCourse = filteredCourses[0];
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
