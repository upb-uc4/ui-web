import Course from "@/api/api_models/course_management/Course";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import { Account } from "@/entities/Account";
import { getMachineUserAuth, loginAsDefaultLecturer, logout } from "./helpers/AuthHelper";
import { deleteCourses, createCourses } from "./helpers/CourseHelper";
import { createUsers, deleteUsers, getRandomizedGovernmentId } from "./helpers/UserHelper";
import { navigateToCourseListLecturer, navigateToMyCoursesLecturer } from "./helpers/NavigationHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";

let lecturer: Lecturer;
let lecturerAuthUser: Account;
let course1: Course;
let course2: Course;
let adminAuth: Account;
let lecturerAuth: Account;
let usersWithAuth: UserWithAuth[] = [];

describe("Course List Behavior", function () {
    const random = Math.floor(Math.random() * 9999);

    before(function () {
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
                cy.fixture("lecturer.json").then((l) => {
                    (l as Lecturer).username += random;
                    lecturer = l as Lecturer;
                });
            })
            .then(() => {
                cy.fixture("logins/lecturer.json").then((lecturer) => {
                    lecturerAuth = lecturer;
                });
            })
            .then(() => {
                cy.fixture("lecturerAuthUser.json").then((lecturerAuth) => {
                    (lecturerAuth as Account).username += random;
                    lecturerAuthUser = lecturerAuth as Account;
                    let governmentId = getRandomizedGovernmentId();
                    usersWithAuth.push({ governmentId, userInfo: lecturer, auth: lecturerAuthUser });
                });
            })
            .then(async () => {
                await createUsers(usersWithAuth);
            })
            .then(() => {
                cy.fixture("course.json").then((course) => {
                    course1 = { ...(course as Course) };
                    course1.courseName += "1-" + random;

                    course2 = { ...(course as Course) };
                    course2.courseName += "2-" + random;
                });
            })
            .then(() => {
                course1.lecturerId = lecturerAuth.username;
                course2.lecturerId = lecturerAuthUser.username;
                createCourses([course1, course2]);
            })
            .then(() => {
                console.log("Setup finished");
            });
    });

    after(() => {
        deleteUsers([lecturerAuthUser], adminAuth);
        deleteCourses([course1, course2]);
        logout();
    });

    it("Create an own course", function () {
        loginAsDefaultLecturer();
    });

    it("Tab All Courses should contain both courses", function () {
        navigateToCourseListLecturer();
        cy.url().should("contain", "all-courses");
        cy.get("div").contains(course1.courseName).should("exist");
        cy.get("div").contains(course1.courseName).parent().parent().find("button[id='editCourse']").should("exist");
        cy.get("div").contains(course2.courseName).should("exist");
        cy.get("div").contains(course2.courseName).parent().parent().find("button[id='editCourse']").should("not.exist");
    });

    it("Tab my course should just contain my courses", function () {
        navigateToMyCoursesLecturer();
        cy.url().should("contain", "course-management");
        cy.get("div").contains(course1.courseName).should("exist");
        cy.get("div").contains(course1.courseName).parent().parent().find("button[id='editCourse']").should("exist");
        cy.get("div").contains(course2.courseName).should("not.exist");
    });
});
