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

import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import { loginAsDefaultAdmin, logout } from "./helpers/AuthHelper";
import { navigateToExamRegForm } from "./helpers/NavigationHelper";

let exRegName = "TestExReg" + Math.floor(Math.random() * 99999999);
let exRegModuleID = "TestModuleID" + Math.floor(Math.random() * 99999999);
let exRegModuleName = "TestModuleName" + Math.floor(Math.random() * 99999999);

describe("Account creation, edition and deletion", function () {
    before(function () {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });
    });

    after(() => {
        logout();
    });

    it("Login as admin", function () {
        loginAsDefaultAdmin();
    });

    it("Navigate to Create Exam Reg Form", function () {
        navigateToExamRegForm();
    });

    it("Add Exam Regulation name and check if create button is disabled", function () {
        cy.get("input[id='examRegName']").type(exRegName);

        // cannot create exam reg without modules
        cy.get("button[id='createExamReg']").should("be.disabled");
    });

    it("Create module and check if we can now create the exam regulation", function () {
        cy.get("input[id='moduleID']").type(exRegModuleID);
        cy.get("input[id='moduleName']").type(exRegModuleName);
        cy.get("button[id='addModule']").click();

        cy.get("input[id='moduleID']").should("have.value", "");
        cy.get("button[id='createExamReg']").should("be.enabled");
    });

    it("Remove module and ensure we cannot create the examination regulation", function () {
        // Remove only module
        cy.get("button[id='removeModule0'").click();
        cy.get("button[id='createExamReg']").should("be.disabled");
    });

    it("Re-create module and and create exam regulation", function () {
        // Create module again
        cy.get("input[id='moduleID']").type(exRegModuleID);
        cy.get("input[id='moduleName']").type(exRegModuleName);
        cy.get("button[id='addModule']").click();

        // Submit and check if successful
        cy.get("button[id='createExamReg']").should("be.enabled");
        cy.get("button[id='createExamReg']").click();

        // TODO: can use intercept and wait with @?
        cy.wait(10000);
        cy.get("input[id='examRegName']").should("have.value", "");
        cy.get("input[id='moduleID']").should("have.value", "");
        cy.get("button[id='createExamReg']").should("be.disabled");
    });

    it("Check that examRegName cannot be used", function () {
        // Create module again
        cy.get("input[id='examRegName']").type(exRegName);
        cy.get("div[id='examRegNameFeedback']").should("contain.text", "already exists");
        cy.get("button[id='createExamReg']").should("be.disabled");
    });

    it("Add module from just created exam regulation", function () {
        // Use new exam regulation name
        cy.get("input[id='examRegName']")
            .clear()
            .type(exRegName + "1");
        cy.get("button[id='createExamReg']").should("be.disabled");

        // Test text for non-existing module ID
        cy.get("input[id='moduleID']")
            .clear()
            .type(exRegModuleID + "1");
        cy.get("input[id='moduleName']").clear().type(exRegModuleName);
        cy.get("button[id='addModule']").should("contain.text", "Create Module");

        // Add existing module
        cy.get("input[id='moduleID']").clear().type(exRegModuleID);
        cy.get("button[id='addModule']").should("contain.text", "Add Module");
        cy.get("button[id='addModule']").click();
        cy.get("button[id='createExamReg']").should("be.enabled");
    });

    it("Remove exam regulation name and ensure create button is disabled", function () {
        cy.get("input[id='examRegName']").clear();
        cy.get("button[id='createExamReg']").should("be.disabled");
    });
});
