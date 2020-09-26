import Course from "@/api/api_models/course_management/Course";
import { Account } from "@/entities/Account";
import { loginAndCreateCourse, deleteCourses } from "./helpers/CourseHelper";
import { loginAsDefaultStudent, logout } from "./helpers/AuthHelper";
import { navigateToCourseListStudent } from "./helpers/NavigationHelper";

describe("Student course view", () => {
    const random = Math.floor(Math.random() * 9999);

    let studentAuth: Account;
    let lecturerAuth: Account;
    let course: Course;

    before(() => {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });

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

    after(() => {
        deleteCourses([course], lecturerAuth);
        logout();
    });

    it("Create Course as lecturer", () => {
        loginAndCreateCourse(course, lecturerAuth);
    });

    it("Login as student", () => {
        logout();
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
});
