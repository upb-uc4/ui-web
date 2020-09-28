import Course from "@/api/api_models/course_management/Course";
import { Account } from "@/entities/Account";
import { loginAsDefaultLecturer, logout, getMachineUserAuth } from "./helpers/AuthHelper";
import { createCourse, createCourses, deleteCourses } from "./helpers/CourseHelper";
import { CourseType } from "@/entities/CourseType";
import { Role } from "@/entities/Role";
import { navigateToCourseListLecturer } from "./helpers/NavigationHelper";

describe("Course Filtering", function () {
    const random1 = Math.floor(Math.random() * 9999);
    const random2 = Math.floor(Math.random() * 9999);
    const random3 = Math.floor(Math.random() * 9999);

    let course1: Course;
    let course2: Course;
    let course3: Course;
    let lecturerAuth: Account;

    before(function () {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });

        cy.fixture("course.json")
            .then((course) => {
                course1 = { ...(course as Course) };
                course1.courseName += random1;
                course1.courseType = CourseType.LECTURE;

                course2 = { ...(course as Course) };
                course2.courseName += random2;
                course2.courseType = CourseType.SEMINAR;

                course3 = { ...(course as Course) };
                course3.courseName += random3;
                course3.courseType = CourseType.PG;
            })
            .then(() => {
                cy.fixture("logins/lecturer.json").then((lecturer) => {
                    lecturerAuth = lecturer;
                });
            })
            .then(async () => {
                await getMachineUserAuth(lecturerAuth);
            })
            .then(async () => {
                await createCourses([course1, course2, course3]);
            })
            .then(() => {
                console.log("Setup finished");
            });
    });

    after(() => {
        deleteCourses([course1, course2, course3]);
        logout();
    });

    it("Login as Lecturer", function () {
        loginAsDefaultLecturer();
    });

    it("Lecture filter working", function () {
        navigateToCourseListLecturer();
        cy.get("button[id='courseType-Lecture']").click();
        cy.get("div").contains(course1.courseName).should("exist");
        cy.get("div").contains(course2.courseName).should("not.exist");
        cy.get("div").contains(course3.courseName).should("not.exist");
    });

    it("Seminar filter working", function () {
        cy.get("button[id='courseType-Seminar']").click();
        cy.get("div").contains(course1.courseName).should("not.exist");
        cy.get("div").contains(course2.courseName).should("exist");
        cy.get("div").contains(course3.courseName).should("not.exist");
    });

    it("PG filter working", function () {
        cy.get("button[id='courseType-Project Group']").click();
        cy.get("div").contains(course1.courseName).should("not.exist");
        cy.get("div").contains(course2.courseName).should("not.exist");
        cy.get("div").contains(course3.courseName).should("exist");
    });

    it("All filter working", function () {
        cy.get("button[id='courseType-All']").click();
        cy.get("div").contains(course1.courseName).should("exist");
        cy.get("div").contains(course2.courseName).should("exist");
        cy.get("div").contains(course3.courseName).should("exist");
    });

    it("Searchbar working", function () {
        cy.get("input[id='message']").type(random1.toString());
        cy.get("div").contains(course1.courseName).should("exist");
        cy.get("div").contains(course2.courseName).should("not.exist");
        cy.get("div").contains(course3.courseName).should("not.exist");
        cy.get("input[id='message']").clear();
        cy.get("div").contains(course1.courseName).should("exist");
        cy.get("div").contains(course2.courseName).should("exist");
        cy.get("div").contains(course3.courseName).should("exist");
    });
});
