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
    it("Login as lecturer", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "lecturer");
    });

    it("Show new course page", () => {
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.url().should("contain", "/createCourse");
    });

    it("Can not submit empty course", () => {
        cy.get('button[id="createCourse"]').should("be.disabled");
    });

    it("Can change courseType", () => {
        cy.get("input[type='radio']").should("be.enabled");
        cy.get("input[type='radio']").eq(0).click();
        cy.get("input[type='radio']").eq(1).click();
        cy.get("input[type='radio']").eq(2).click();
    });

    it("Show unsaved changes modal", () => {
        cy.get("button").contains("Cancel").click();
        cy.wait(100);
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Do you really want to continue and leave this page? You have unsaved changes.");
        cy.get("#modal-wrapper").contains("Cancel").click();

        cy.get("button").contains("Cancel").click();
        cy.wait(100);
        cy.get("button").contains("Leave").click();
    });

    it("Show new course page", () => {
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.url().should("contain", "/createCourse");
    });

    it("Can change courseType", () => {
        cy.get("input[type='radio']").eq(0).click();
    });

    it("Can edit courseName", () => {
        cy.get('input[id="courseName"]').type("test-courseName-cypress");
    });

    it("Can edit courseLanguage", () => {
        cy.get("select").select("German");
    });

    it("Can edit description", () => {
        cy.get('textarea[id="courseDescription"]').type("test-courseDescription-cypress");
    });

    it("Validation errors are shown", () => {
        cy.get('button[id="createCourse"]').click();
        cy.get('input[id="maxParticipants"]').clear().type("-1");
        cy.get("input[id='maxParticipants']").siblings().get("p").invoke("hasClass", "error-message");
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
        cy.url().should("contain", "lecturer");
    });

    it("Course was created", () => {
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains("test-courseName-cypress");
    });

    // edit course
    it("Show course edit page", () => {
        cy.get("div").contains("test-courseName-cypress").parent().parent().find("button[id='editCourse']").click();

        cy.get('input[id="courseName"]').should("have.value", "test-courseName-cypress");
    });

    it("Can not save unchanged course", () => {
        cy.get('button[id="saveChanges"]').should("be.disabled");
    });

    it("Can edit courseName", () => {
        cy.get('input[id="courseName"]').clear().type("test-CourseName-cypress");
    });

    it("Can save course", () => {
        cy.get('button[id="saveChanges"]').should("be.enabled");
        cy.get('button[id="saveChanges"]').click();
    });

    it("Edit worked", () => {
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains("test-CourseName-cypress").parent().parent().find("button[id='editCourse']").should("exist");
    });

    //delete course
    it("Show edit page", () => {
        cy.get("div").contains("test-CourseName-cypress").parent().parent().find("button[id='editCourse']").click();
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
        cy.url().should("contain", "/lecturer");
        cy.get("div").contains("test-CourseName-cypress").should("not.exist");
    });
});
