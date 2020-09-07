/*
 * Login as lecturer
 * create new course
 * check all input fields
 * check unsaved changes modal
 * create course
 * edit course
 * delete course
 * test account deletion modal
 */

import Course from "@/api/api_models/course_management/Course";
import { Account } from "@/entities/Account";
import { loginAsDefaultLecturer } from "./helpers/AuthHelper";
import { navigateToCourseListLecturer } from "./helpers/NavigationHelper";
import { createCourse, deleteCourse } from "./helpers/CourseHelper";

describe("Course creation, edition and deletion", () => {
    const random = Math.floor(Math.random() * 9999);

    let course: Course;
    let lecturerAuth: Account;

    before(function () {
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });

        cy.fixture("course.json").then((c) => {
            course = { ...(c as Course) };
            course.courseName += random;
        });

        cy.fixture("logins/lecturer.json").then((lecturer) => {
            lecturerAuth = lecturer;
        });
    });

    it("Login as lecturer", () => {
        loginAsDefaultLecturer();
    });

    it("Navigate to course list", () => {
        navigateToCourseListLecturer();
    });

    it("Show new course page", () => {
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.url().should("contain", "/createCourse");
    });

    it("Check existence of all fields", () => {
        cy.get("input[id='courseType']").should("exist");
        cy.get("input[id='courseName']").should("exist");
        cy.get("select[id='courseLanguage']").should("exist");
        cy.get("textarea[id='courseDescription']").should("exist");
        cy.get("input[id='maxParticipants']").should("exist");
        cy.get("input[id='startDate']").should("exist");
        cy.get("input[id='endDate']").should("exist");
    });

    it("Can not submit empty course", () => {
        cy.get('button[id="createCourse"]').should("be.disabled");
    });

    it("Can change courseType", () => {
        cy.get("input[type='radio']").should("be.enabled");
    });

    it("Show validation errors", () => {
        cy.get("input[id='courseName']").type("test");
        cy.get('button[id="createCourse"]').click();
        cy.get("input[id='courseType']").siblings().get("p").should("have.class", "error-message");
        cy.get("select[id='courseLanguage']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='maxParticipants']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='courseName']").clear();
        cy.get("input[type='radio']").eq(0).click();
        cy.get('button[id="createCourse"]').click();
        cy.get("input[id='courseName']").siblings().get("p").should("have.class", "error-message");
    });

    it("Show unsaved changes modal", () => {
        cy.get("button[id='cancel']").click();
        cy.wait(100);
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Do you really want to continue and leave this page? You have unsaved changes.");

        cy.get("button[id='unsavedChangesModalCancel']").click();
        cy.wait(100);
        cy.get("button[id='cancel']").click();
        cy.get("button[id='unsavedChangesModalConfirmLeave']").click();
    });

    it("Show new course page", () => {
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.url().should("contain", "/createCourse");
    });

    it("Create course", () => {
        createCourse(course);
    });

    // edit course
    it("Show course edit page", () => {
        cy.get("div").contains(course.courseName).parent().parent().find("button[id='editCourse']").click();

        cy.get('input[id="courseName"]').should("have.value", course.courseName);
    });

    it("Can not save unchanged course", () => {
        cy.get('button[id="saveChanges"]').should("be.disabled");
    });

    it("Can edit courseName", () => {
        course.courseName += "-updated";
        cy.get('input[id="courseName"]').clear().type(course.courseName);
    });

    it("Can save course", () => {
        cy.get('button[id="saveChanges"]').should("be.enabled");
        cy.get('button[id="saveChanges"]').click();
    });

    it("Edit worked", () => {
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains(course.courseName).parent().parent().find("button[id='editCourse']").should("exist");
    });

    it("Delete course", () => {
        deleteCourse(course);
    });
});
