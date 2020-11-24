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
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { loginAsDefaultAdmin, logout } from "./helpers/AuthHelper";
import { navigateToAccountList, navigateToExamRegForm } from "./helpers/NavigationHelper";
import {
    createNewAdmin,
    createNewLecturer,
    createNewStudent,
    deleteUser,
    deleteUsers,
    getRandomMatriculationId,
} from "./helpers/UserHelper";

const random = Math.floor(Math.random() * 9999);
let admin: Admin;
let adminAuthUser: Account;
let student: Student;
let studentAuthUser: Account;
let lecturer: Lecturer;
let lecturerAuthUser: Account;

let adminAuth: Account;
let studentAuth: Account;
let lecturerAuth: Account;

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
        let exRegName = "TestExReg" + Math.floor(Math.random() * 99999999);
        let exRegModuleID = "TestModuleID" + Math.floor(Math.random() * 99999999);
        let exRegModuleName = "TestModuleName" + Math.floor(Math.random() * 99999999);

        cy.get("input[id='examRegName']").type(exRegName);
        cy.get("input[id='moduleID']").type(exRegModuleID);

        // cannot create exam reg without modules
        cy.get("button[id='createExamReg']").should("be.disabled");

        cy.get("input[id='moduleName']").type(exRegModuleName);
        cy.get("button[id='addModule']").click();

        cy.get("button[id='createExamReg']").should("be.enabled");
        cy.get("input[id='moduleID']").should("have.value", "");

        // Remove only module
        cy.get("button[id='removeModule0'").click();
        cy.get("button[id='createExamReg']").should("be.disabled");

        // Create module again
        cy.get("input[id='moduleID']").type(exRegModuleID);
        cy.get("input[id='moduleName']").type(exRegModuleName);
        cy.get("button[id='addModule']").click();

        // Submit and check if successful
        cy.get("button[id='createExamReg']").should("be.enabled");
        cy.get("button[id='createExamReg']").click();
        cy.wait(10000);
        cy.get("input[id='examRegName']").should("have.value", "");
    });
});
