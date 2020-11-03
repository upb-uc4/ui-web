import Course from "@/api/api_models/course_management/Course";
import { Account } from "@/entities/Account";
import { paths } from "@/use/router/paths";
import { getMachineUserAuth, loginAsDefaultStudent, logout } from "./helpers/AuthHelper";
import { createCourses, deleteCourses } from "./helpers/CourseHelper";
import { navigateToCourseListStudent } from "./helpers/NavigationHelper";

describe("Show public profile correctly", () => {
    const random = Math.floor(Math.random() * 9999);

    let adminAuth: Account;
    let studentAuth: Account;
    let lecturerAuth: Account;
    let course: Course;

    before(() => {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });

        cy.fixture("logins/admin.json")
            .then((admin) => {
                adminAuth = admin;
            })
            .then(async () => {
                await getMachineUserAuth(adminAuth);
            })
            .then(() => {
                cy.fixture("course.json").then((c) => {
                    course = c;
                    course.courseName += "-" + random;
                });
            })
            .then(() => {
                cy.fixture("logins/lecturer.json").then((lecturer) => {
                    lecturerAuth = lecturer;
                    course.lecturerId = lecturerAuth.username;
                });
            })
            .then(async () => {
                await createCourses([course]);
            })
            .then(() => {
                console.log("Setup finished");
            });

        cy.fixture("logins/student.json").then((student) => {
            studentAuth = student;
        });

        cy.fixture("course.json").then((c) => {
            course = c;
            course.courseName += "-" + random;
        });
    });

    after(() => {
        deleteCourses([course]);
        logout();
    });

    it("Login as Student", () => {
        loginAsDefaultStudent();
    });

    it("Navigate to 'lecturer's public profile via created course", () => {
        navigateToCourseListStudent();
        cy.url().should("contain", paths.STUDENT_COURSES);
        cy.wait(2000);
        cy.get("div").contains(course.courseName).parent().parent().find("a[id='showLecturer']").click();
        cy.url().should("contain", paths.PUBLIC_PROFILE + "/lecturer");
    });

    it("Public Profile contains correct information", () => {
        // TODO this could be changed, we should create our own lecturer and check against the values
        cy.get("div").contains("firstName LastName").should("exist");
        cy.get("div").contains("(@lecturer)").should("exist");
        cy.get("div").contains("Research Area").parent().parent().should("contain", "Mathematics");
        cy.get("div").contains("Description").parent().parent().should("contain", "Heute kommt der kleine Gauss dran.");
    });

    it("Back button works", () => {
        cy.get("button[id='navigateBack']").click();
        cy.url().should("contain", "courses");
    });
});
