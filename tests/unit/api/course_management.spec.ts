import Course_Management from "@/api/Course_Management"
import { Role } from '@/entities/Role'
import { Account } from '@/entities/Account';
import Authentication_Management from "@/api/Authentication_Management"
import { Course } from '@/entities/Course';
import { Language } from '@/entities/Language';
import { CourseType } from '@/entities/CourseType';


var authentication_management: Authentication_Management;
var course_management : Course_Management;
const adminAuth = {username: "admin", password: "admin"};
const studentAuth = {username: "student", password: "student"};
const lecturerAuth = {username: "lecturer", password: "lecturer"};
var course = new Course();
var createdCourse: Course = {} as Course;
jest.useFakeTimers();

beforeAll(async () => {
    authentication_management = new Authentication_Management();
    await authentication_management.login(lecturerAuth);
    course_management = new Course_Management();
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

    console.log(course_management._authHeader)
    const success = await course_management.createCourse(course);

    expect(success).toBe(true);
})


test("Get all courses", async () => {
    setTimeout(async () => {
        const courses = await course_management.getCourses();
        const filteredCourses = courses.filter((c : Course) => c.courseName === "Best test course ever!")
        expect(filteredCourses.length > 0).toBe(true)
        createdCourse = filteredCourses[0];
    }, 10000)
})

test("Update course", async () => {
    setTimeout(async () => {
        createdCourse.courseName = "Worst test course ever!";
        const success = await course_management.updateCourse(createdCourse)
        expect(success).toBe(true);
    }, 10000)
})

test("Delete course", async () => {
    setTimeout(async () => {
        const success = await course_management.deleteCourse(createdCourse.courseId)
        expect(success).toBe(true);
    }, 10000)
})