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

describe("Course creation, edition and deletion", () => {
    const random = Math.floor(Math.random() * 500);
    const courseName = "test-course-cypress" + random;
    const updatedCourseName = courseName + "-update";

    it("Login as lecturer", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Navigate to course list", () => {
        cy.get("div[id='menu_courses']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_courses']").parents().eq(1).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(1).get("span").contains("My Courses").should("be.visible");
        cy.get("div[id='menu_courses']").children().eq(1).get("a").contains("My Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
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

    it("Can change courseType", () => {
        cy.get("input[type='radio']").eq(0).click();
    });

    it("Can edit courseName", () => {
        cy.get('input[id="courseName"]').type(courseName);
    });

    it("Can edit courseLanguage", () => {
        cy.get("select").select("German");
    });

    it("Can edit description", () => {
        cy.get('textarea[id="courseDescription"]').type("test-courseDescription-cypress");
    });

    it("Can edit maxParticipants", () => {
        cy.get('input[id="maxParticipants"]').clear().type("1");
    });

    it("Can not edit dates", () => {
        cy.get('input[id="endDate"]').invoke("attr", "readonly").should("exist");
        cy.get('input[id="startDate"]').invoke("attr", "readonly").should("exist");
    });

    it("Create Course works", () => {
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "course-management");
    });

    it("Course was created", () => {
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains(courseName);
    });

    // edit course
    it("Show course edit page", () => {
        cy.get("div").contains(courseName).parent().parent().find("button[id='editCourse']").click();

        cy.get('input[id="courseName"]').should("have.value", courseName);
    });

    it("Can not save unchanged course", () => {
        cy.get('button[id="saveChanges"]').should("be.disabled");
    });

    it("Can edit courseName", () => {
        cy.get('input[id="courseName"]').clear().type(updatedCourseName);
    });

    it("Can save course", () => {
        cy.get('button[id="saveChanges"]').should("be.enabled");
        cy.get('button[id="saveChanges"]').click();
    });

    it("Edit worked", () => {
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains(updatedCourseName).parent().parent().find("button[id='editCourse']").should("exist");
    });

    //delete course
    it("Show edit page", () => {
        cy.get("div").contains(updatedCourseName).parent().parent().find("button[id='editCourse']").click();
    });

    it("Delete course", () => {
        cy.wait(100);
        cy.get("button[id='deleteCourse']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this course?").should("exist");
        // cancel
        cy.get('button[id="deleteCourseModalCancel"]').click();
        cy.get("button[id='deleteCourse']").click();
        cy.wait(100);
        cy.get('button[id="deleteCourseModalDelete"]').click();
    });

    it("Assert course deletion", () => {
        cy.url().should("contain", "/course-management");
        cy.get("div").contains(updatedCourseName).should("not.exist");
    });
});
