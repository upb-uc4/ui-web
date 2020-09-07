import Course from "@/api/api_models/course_management/Course";
import { Account } from "@/entities/Account";
import { loginAndCreateCourse, loginAndDeleteCourse } from "./helpers/CourseHelper";
import { loginAsDefaultStudent } from "./helpers/AuthHelper";
import { navigateToCourseListStudent } from "./helpers/NavigationHelper";

describe("Student course view", () => {
    const random = Math.floor(Math.random() * 9999);

    let studentAuth: Account;
    let lecturerAuth: Account;
    let course: Course;

    before(() => {
        cy.fixture("logins/student.json").then((student) => {
            studentAuth = student;
        });

        cy.fixture("logins/lecturer.json").then((lecturer) => {
            lecturerAuth = lecturer;
        });

        cy.fixture("course.json").then((c) => {
            course = c;
            course.courseName += "-" + random;
        });
    });

    it("Create Course as lecturer", () => {
        loginAndCreateCourse(course, lecturerAuth);
    });

    it("Login as student", () => {
        loginAsDefaultStudent();
    });

    it("Navigate to course list", () => {
        navigateToCourseListStudent();
    });

    it("Course exists", () => {
        cy.wait(2000);
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains(course.courseName);
    });

    it("Delete course as lecturer", () => {
        loginAndDeleteCourse(course, lecturerAuth);
    });
});
