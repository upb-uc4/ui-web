import CourseManagement from "@/api/CourseManagement"
import { Role } from '@/entities/Role'
import { Account } from '@/entities/Account';
import  { CourseEntity } from '@/entities/CourseEntity';
import Course from "@/api/api_models/course_management/Course"
import { Language } from '@/entities/Language';
import { CourseType } from '@/entities/CourseType';
import UserManagement from '@/api/UserManagement';


var userManagement: UserManagement;
var courseManagement : CourseManagement;
const adminAuth = {username: "admin", password: "admin"};
const studentAuth = {username: "student", password: "student"};
const lecturerAuth = {username: "lecturer", password: "lecturer"};
var course = new CourseEntity();
var createdCourse: Course = {} as Course;
jest.useFakeTimers();

beforeAll(async () => {
    userManagement = new UserManagement();
    const success = await userManagement.login(lecturerAuth);
    expect(success.returnValue).toBe(true);
    courseManagement = new CourseManagement();
})

test("Create course", async () => {


    course.courseDescription = "This is a course description."
    course.courseId = "-1";
    course.courseLanguage = Language.ENGLISH;
    course.courseName = "Best test course ever!";
    course.courseType = CourseType.LECTURE;
    course.currentParticipants = 5;
    course.ects = 60;
    course.startDate = "0420-69-69";
    course.endDate = "6969-69-69";
    course.lecturerId = "lecturer";
    course.maxParticipants = 10;

    console.log(courseManagement._authHeader)
    const success = await courseManagement.createCourse(course);

    expect(success.returnValue).toBe(true);
})


test("Get all courses", async () => {
    setTimeout(async () => {
        const courses = await courseManagement.getCourses();
        const filteredCourses = courses.returnValue.filter((c : Course) => c.courseName === "Best test course ever!")
        expect(filteredCourses.length > 0).toBe(true)
        createdCourse = filteredCourses[0];
    }, 10000)
})

test("Update course", async () => {
    setTimeout(async () => {
        createdCourse.courseName = "Worst test course ever!";
        const success = await courseManagement.updateCourse(createdCourse)
        expect(success.returnValue).toBe(true);
    }, 10000)
})

test("Delete course", async () => {
    setTimeout(async () => {
        const success = await courseManagement.deleteCourse(createdCourse.courseId)
        expect(success.returnValue).toBe(true);
    }, 10000)
})