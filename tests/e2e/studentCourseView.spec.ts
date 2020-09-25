import Course from "@/api/api_models/course_management/Course";
import { Account } from "@/entities/Account";
import { loginAndCreateCourse, deleteCourses, createCourses } from "./helpers/CourseHelper";
import { getMachineUserAuth, loginAsDefaultStudent, logout } from "./helpers/AuthHelper";
import { navigateToCourseListStudent } from "./helpers/NavigationHelper";
import { Role } from "@/entities/Role";

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

        cy.fixture("logins/lecturer.json")
            .then((lecturer) => {
                lecturerAuth = lecturer;
                lecturerAuth.role = Role.LECTURER;
            })
            .then(() => {
                cy.fixture("course.json").then((c) => {
                    course = c;
                    course.courseName += "-" + random;
                });
            })
            .then(async () => {
                await getMachineUserAuth(lecturerAuth);
            })
            .then(async () => {
                await createCourses([course]);
            })
            .then(() => {
                console.log("Setup finished");
            });
    });

    after(() => {
        deleteCourses([course]);
        logout();
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
});
