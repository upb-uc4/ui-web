import { createPartiallyEmittedExpression } from "typescript";

/*
 * Login as admin
 * check if admin, lecturer and student exist
 * create new account
 * check all input fields
 * check unsaved changes modal
 * create student account
 * edit student account
 * change fields of study
 * delete account
 * test account deletion modal
 */

describe("Account creation, edition and deletion", () => {
    it("Login as admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("admin");
        cy.get("input[id='password']").type("admin");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "admin");
    });

    it("List contains admin, student and lecturer", () => {
        cy.get("tr").get("tr>td").contains("student");
        cy.get("tr").get("tr>td").contains("lecturer");
        cy.get("tr").get("tr>td").contains("admin");
    });

    it("Show new account page", () => {
        cy.get('a[href*="/createAccount"]').click({ force: true });
        cy.url().should("contain", "/createAccount");
        //todo check if everything is there
    });

    it("Create Account button is disabled", () => {
        cy.get("button").contains("Create Account").should("be.disabled");
    });

    it("Can edit role", () => {
        cy.get("input[type='radio']").should("be.enabled");

        //admin
        cy.get("input[type='radio']").eq(0).click();

        //lecturer
        cy.get("input[type='radio']").eq(1).click();
        cy.get("textarea[id='freeText']").should("exist");
        cy.get("textarea[id='researchArea']").should("exist");

        // student
        cy.get("input[type='radio']").eq(2).click();
        cy.get("input[id='immatriculationStatus']").should("exist");
        cy.get("input[id='matriculationId']").should("exist");
        cy.get("input[id='semesterCount']").should("exist");
        cy.get("select[id='fieldsOfStudy-1']").should("exist");
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

    it("Show new account page", () => {
        cy.get('a[href*="/createAccount"]').click({ force: true });
        cy.url().should("contain", "/createAccount");
        //todo check if everything is there
    });

    it("Can edit role", () => {
        cy.get("input[type='radio']").eq(2).click();
    });
    it("Can edit username", () => {
        cy.get("input[id='userName']").type("test-username-cypress");
    });

    it("Can edit password", () => {
        cy.get("input[id='password']").should("exist");
        cy.get("input[id='password']").type("test-password-cypress");
    });

    it("Country enum is filled", () => {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
    });

    it("Can edit name", () => {
        cy.get("input[id='firstName']").type("firstName");
        cy.get("input[id='lastName']").type("lastName");
    });

    it("Can edit address", () => {
        cy.get("input[id='street']").type("test-street-cypress");
        cy.get("input[id='houseNumber']").type("test-street-number-cypress");
        cy.get("input[id='zipCode']").type("test-zipcode-cypress");
        cy.get("input[id='city']").type("test-city-cypress");
    });

    it("Can select birthDate", () => {
        cy.get("select").eq(0).select("15");
        cy.get("select").eq(1).select("November");
        cy.get("select").eq(2).select("1996");
    });

    it("Invalid email address will show validation error", () => {
        cy.get("input[id='email']").clear().type("fail");
        cy.get("button").contains("Create Account").should("be.enabled");
        cy.get("button").contains("Create Account").click();

        cy.get("input[id='email']").siblings().get("p").invoke("hasClass", "error-message");

        cy.get("input[id='email']").clear().type("valid@valid.de");
    });

    it("Can enter immatriculationStatus", () => {
        cy.get("input[id='immatriculationStatus']").type("IN");
    });

    it("Can enter matriculationId", () => {
        cy.get("input[id='matriculationId']").type("15");
    });

    it("Can enter semesterCount", () => {
        cy.get("input[id='semesterCount']").clear().type("1");
    });

    it("Create account works", () => {
        cy.get("button").contains("Create Account").should("be.enabled");
        cy.get("button").contains("Create Account").click();
        cy.url().should("contain", "admin");
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get("tr").get("tr>td").contains("test-username-cypress");
    });

    // edit account
    it("Show student edit page", () => {
        cy.get("button[id='editAccount-test-username-cypress']").click();

        //todo check if everything is there
    });

    it("Save Changes button is disabled", () => {
        cy.get("button[id='saveChanges']").should("be.disabled");
    });

    it("Can not edit role", () => {
        // check that I can not change role
        cy.get("input[type='radio']").should("be.disabled");
    });

    it("Can not edit username", () => {
        // check that I can not change my username
        cy.get("input[id='userName']").invoke("attr", "readonly").should("exist");
    });

    it("Can not edit password", () => {
        cy.get("input[id='password']").should("not.exist");
    });

    it("Invalid email address will show validation error", () => {
        cy.get("input[id='email']").clear().type("fail");
        cy.get("button").contains("Save Changes").should("be.enabled");
        cy.get("button").contains("Save Changes").click();

        cy.get("input[id='email']").siblings().get("p").invoke("hasClass", "error-message");

        cy.get("input[id='email']").clear().type("valid@valid.de");
    });

    it("Country enum is filled", () => {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
    });

    it("Select fields of study is working properly", () => {
        cy.get("select[id='fieldsOfStudy-1']").select("Economics");
        cy.get("select[id='fieldsOfStudy-2']").select("Physics");
        cy.get("select[id='fieldsOfStudy-3']").find("option").contains("Computer Science").should("exist");
        cy.get("select[id='fieldsOfStudy-3']").find("option").contains("Physics").should("not.exist");
        cy.get("select[id='fieldsOfStudy-3']").select("Education");
        cy.get("button[id='removeFieldOfStudy-2']").click();
        cy.get("select[id='fieldsOfStudy-3']").select("Computer Science");
    });

    it("Can change name", () => {
        cy.get('input[id="firstName"]').clear().type("newName");
    });

    it("Update working correctly", () => {
        cy.get("button[id='saveChanges']").click();
        cy.url().should("contain", "admin");
    });

    //delete account
    it("Show edit page", () => {
        cy.get("button[id='editAccount-test-username-cypress']").click();

        //todo check if everything is there
    });

    it("Delete account", () => {
        cy.wait(100);
        cy.get("button[id='deleteAccount']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this account").should("exist");
        // cancel
        cy.get('button[id="deleteAccountModalCancel"]').click();
        cy.get("button[id='deleteAccount']").click();
        cy.wait(100);
        cy.get('button[id="deleteAccountModalDelete"]').click();
    });

    it("Assert account deletion", () => {
        cy.url().should("contain", "/admin");

        cy.get("tr").get("tr>td").contains("student");
        cy.get("tr").get("tr>td").contains("lecturer");
        cy.get("tr").get("tr>td").contains("admin");
        cy.get("tr").get("tr>td").contains("test-username-cypress").should("not.exist");
    });
});
