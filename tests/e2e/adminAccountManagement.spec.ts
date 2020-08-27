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

import { getRandomizedUserAndAuthUser } from "../helper/Users";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { readFileSync } from "fs";
import { Role } from "@/entities/Role";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Admin from "@/api/api_models/user_management/Admin";

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
        cy.fixture("admin.json").then((a) => {
            (a as Admin).username += random;
            admin = a as Admin;
        });
        cy.fixture("adminAuthUser.json").then((a) => {
            (a as Account).username += random;
            adminAuthUser = a as Account;
        });

        cy.fixture("lecturer.json").then((l) => {
            (l as Lecturer).username += random;
            lecturer = l as Lecturer;
        });
        cy.fixture("lecturerAuthUser.json").then((l) => {
            (l as Account).username += random;
            lecturerAuthUser = l as Account;
        });

        cy.fixture("student.json").then((s) => {
            (s as Student).username += random;
            student = s as Student;
        });
        cy.fixture("studentAuthUser.json").then((s) => {
            (s as Account).username += random;
            studentAuthUser = s as Account;
        });

        cy.fixture("logins/admin.json").then((admin) => {
            adminAuth = admin;
        });
        cy.fixture("logins/student.json").then((student) => {
            studentAuth = student;
        });
        cy.fixture("logins/lecturer.json").then((lecturer) => {
            lecturerAuth = lecturer;
        });
    });

    it("Login as admin", function () {
        cy.visit("/");
        cy.get("input[id='email']").type(adminAuth.username);
        cy.get("input[id='password']").type(adminAuth.username);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Navigate to accountlist", function () {
        cy.get("div[id='menu_manageAccounts']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_manageAccounts']").trigger("mouseover");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("span").contains("All Users").should("be.visible");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("a").contains("All Users").click();
        cy.get("div[id='menu_manageAccounts']").trigger("mouseleave");
        cy.url().should("contain", "accounts");
    });

    it("List contains admin, student and lecturer", function () {
        cy.get("div").contains(`@${studentAuth.username}`);
        cy.get("div").contains(`@${lecturerAuth.username}`);
        cy.get("div").contains(`@${adminAuth.username}`);
    });

    it("Role filter buttons exist", function () {
        cy.get("button[id='role-All']").should("exist");
        Object.values(Role)
            .filter((role) => role != Role.NONE)
            .forEach((role) => {
                cy.get(`button[id='role-${role}']`).should("exist");
            });
    });

    it("Check if role filtering works", function () {
        // test admin role
        cy.get("button[id='role-Admin']").click();
        cy.get("div").contains(`@${adminAuth.username}`);
        cy.get("div").contains(`@${lecturerAuth.username}`).should("not.exist");
        cy.get("div").contains(`@${studentAuth.username}`).should("not.exist");
        // test lecturer role
        cy.get("button[id='role-Lecturer']").click();
        cy.get("div").contains(`@${lecturerAuth.username}`);
        cy.get("div").contains(`@${adminAuth.username}`).should("not.exist");
        cy.get("div").contains(`@${studentAuth.username}`).should("not.exist");

        // test student role
        cy.get("button[id='role-Student']").click();
        cy.get("div").contains(`@${studentAuth.username}`);
        cy.get("div").contains(`@${adminAuth.username}`).should("not.exist");
        cy.get("div").contains(`@${lecturerAuth.username}`).should("not.exist");

        //test all roles
        cy.get("button[id='role-All']").click();
        cy.get("div").contains(`@${adminAuth.username}`).should("exist");
        cy.get("div").contains(`@${lecturerAuth.username}`).should("exist");
        cy.get("div").contains(`@${studentAuth.username}`).should("exist");
    });

    it("Show new account page", function () {
        cy.get('button[id="addAccount"]').click({ force: true });
        cy.url().should("contain", "/createAccount");
    });

    it("Create Account button is disabled", function () {
        cy.get("button").contains("Create Account").should("be.disabled");
    });

    it("Check existence of all input fields", function () {
        Object.values(Role)
            .filter((role) => role != Role.NONE)
            .forEach((role) => {
                cy.get(`input[id='role-${role}']`).should("exist");
            });

        cy.get("input[id='userName']").should("exist");
        cy.get("input[id='email']").should("exist");
        cy.get("input[id='password']").should("exist");
        cy.get("input[id='phoneNumber']").should("exist");
        cy.get("input[id='firstName']").should("exist");
        cy.get("input[id='lastName']").should("exist");
        cy.get("select[id='day']").should("exist");
        cy.get("select[id='month']").should("exist");
        cy.get("select[id='year']").should("exist");
        cy.get("select[id='country']").should("exist");
        cy.get("input[id='street']").should("exist");
        cy.get("input[id='houseNumber']").should("exist");
        cy.get("input[id='zipCode']").should("exist");
        cy.get("input[id='city']").should("exist");
    });

    it("Can edit role", function () {
        cy.get("input[type='radio']").should("be.enabled");

        //admin
        cy.get("input[type='radio']").eq(0).click();

        //lecturer
        cy.get("input[type='radio']").eq(1).click();
        cy.get("textarea[id='freeText']").should("exist");
        cy.get("textarea[id='researchArea']").should("exist");

        // student
        cy.get("input[type='radio']").eq(2).click();
        cy.get("input[id='matriculationId']").should("exist");
    });

    it("Show unsaved changes modal", function () {
        cy.get("button[id='cancel']").click();
        cy.wait(100);
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Do you really want to continue and leave this page? You have unsaved changes.");

        cy.get("button[id='unsavedChangesModalCancel']").click();
        cy.wait(100);
        cy.get("button[id='cancel']").click();
        cy.get("button[id='unsavedChangesModalConfirmLeave']").click();
    });

    it("Show new account page", () => {
        cy.get('button[id="addAccount"]').click({ force: true });
        cy.url().should("contain", "/createAccount");
    });

    it("Show validation errors", () => {
        //TODO Include this when error with role is fixed
        // cy.get("input[id='userName']").type(studentUsername);
        // cy.get("button[id='createAccount']").click();
        // cy.get("div[id='roleSelection']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[type='radio']").eq(1).click();
        cy.get("textarea[id='researchArea']").invoke("val", "1".repeat(201)).trigger("input");
        cy.get("textarea[id='freeText']").invoke("val", "1".repeat(10001)).trigger("input");
        cy.get("input[id='userName']").clear();
        cy.get("button[id='createAccount']").click();
        cy.get("input[id='userName']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='email']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='phoneNumber']").siblings().get("p").should("have.class", "error-message");
        //TODO include when password is not optional
        //cy.get("input[id='password']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='firstName']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='lastName']").siblings().get("p").should("have.class", "error-message");
        cy.get("div[id='birthdate']").siblings().get("p").should("have.class", "error-message");
        cy.get("select[id='country']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='street']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='houseNumber']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='zipCode']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='city']").siblings().get("p").should("have.class", "error-message");
        cy.get("textarea[id='researchArea']").siblings().get("p").should("have.class", "error-message");
        cy.get("textarea[id='freeText']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[type='radio']").eq(2).click();
        cy.get("button[id='createAccount']").click();
        cy.get("input[id='matriculationId']").siblings().get("p").should("have.class", "error-message");
    });
    // create student account
    it("Can edit username", () => {
        cy.get("input[id='userName']").type(student.username);
    });

    it("Can edit password", function () {
        cy.get("input[id='password']").should("exist");
        cy.get("input[id='password']").type(studentAuthUser.password);
    });

    it("Country enum is filled", function () {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
        cy.get('select[id="country"]').select(student.address.country);
    });

    it("Can edit name", function () {
        cy.get("input[id='firstName']").type(student.firstName);
        cy.get("input[id='lastName']").type(student.lastName);
    });

    it("Can edit address", function () {
        cy.get("input[id='street']").type(student.address.street);
        cy.get("input[id='houseNumber']").type(student.address.houseNumber);
        cy.get("input[id='zipCode']").type(student.address.zipCode);
        cy.get("input[id='city']").type(student.address.city);
    });

    it("Can select birthDate", function () {
        cy.get("select").eq(0).select("15");
        cy.get("select").eq(1).select("November");
        cy.get("select").eq(2).select("1996");
    });

    it("Can change email address", () => {
        cy.get("input[id='email']").clear().type(student.email);
    });

    it("Can enter matriculationId", function () {
        cy.get("input[id='matriculationId']").type(student.matriculationId);
    });

    it("Can enter phoneNumber", function () {
        cy.get("input[id='phoneNumber']").type(student.phoneNumber);
    });

    it("Create account works", function () {
        cy.get("button").contains("Create Account").should("be.enabled");
        cy.get("button").contains("Create Account").click();
        cy.url().should("contain", "accounts");
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get(`div[id='user_${student.username}']`).should("exist");
    });

    // edit account
    it("Show student account edit page", function () {
        cy.get(`div[id='user_${student.username}']`).click();

        //todo check if everything is there
    });

    it("Save Changes button is disabled", function () {
        cy.get("button[id='saveChanges']").should("be.disabled");
    });

    it("Can not edit role", function () {
        // check that I can not change role
        cy.get("input[type='radio']").should("be.disabled");
    });

    it("Can not edit username", function () {
        // check that I can not change my username
        cy.get("input[id='userName']").invoke("attr", "readonly").should("exist");
    });

    it("Can not edit password", function () {
        cy.get("input[id='password']").should("not.exist");
    });

    it("Can change email address", () => {
        cy.get("input[id='email']").clear().type(student.email);
    });

    it("Country enum is filled", function () {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
        cy.get('select[id="country"]').select(student.address.country);
    });

    it("Can change name", function () {
        cy.get('input[id="firstName"]')
            .clear()
            .type(student.firstName + "newName");
    });

    it("Update working correctly", function () {
        cy.get("button[id='saveChanges']").click();
        cy.url().should("contain", "accounts");
    });

    // create lecturer account
    it("Show new account page", function () {
        cy.get('button[id="addAccount"]').click({ force: true });
        cy.url().should("contain", "/createAccount");
    });

    it("Can edit role", function () {
        cy.get("input[type='radio']").eq(1).click();
    });
    it("Can edit username", function () {
        cy.get("input[id='userName']").type(lecturer.username);
    });

    it("Can edit password", function () {
        cy.get("input[id='password']").should("exist");
        cy.get("input[id='password']").type(lecturerAuthUser.password);
    });

    it("Can enter phoneNumber", function () {
        cy.get("input[id='phoneNumber']").type(lecturer.phoneNumber);
    });

    it("Country enum is filled", function () {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
        cy.get('select[id="country"]').select(lecturer.address.country);
    });

    it("Can edit name", function () {
        cy.get("input[id='firstName']").type(lecturer.firstName);
        cy.get("input[id='lastName']").type(lecturer.lastName);
    });

    it("Can edit address", function () {
        cy.get("input[id='street']").type(lecturer.address.street);
        cy.get("input[id='houseNumber']").type(lecturer.address.houseNumber);
        cy.get("input[id='zipCode']").type(lecturer.address.zipCode);
        cy.get("input[id='city']").type(lecturer.address.city);
    });

    it("Can select birthDate", function () {
        cy.get("select").eq(0).select("15");
        cy.get("select").eq(1).select("November");
        cy.get("select").eq(2).select("1996");
    });

    it("Can change email address", () => {
        cy.get("input[id='email']").clear().type(lecturer.email);
    });

    it("Can enter free text", function () {
        cy.get("textarea[id='freeText']").type(lecturer.freeText);
    });

    it("Can enter fields of research", function () {
        cy.get("textarea[id='researchArea']").type(lecturer.researchArea);
    });

    it("Create account works", function () {
        cy.get("button").contains("Create Account").should("be.enabled");
        cy.get("button").contains("Create Account").click();
        cy.url().should("contain", "accounts");
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get(`div[id='user_${lecturer.username}']`).should("exist");
    });

    // edit account
    it("Show lecturer account edit page", function () {
        cy.get(`div[id='user_${lecturer.username}']`).click();
    });

    it("Save Changes button is disabled", function () {
        cy.get("button[id='saveChanges']").should("be.disabled");
    });

    it("Can not edit role", function () {
        // check that I can not change role
        cy.get("input[type='radio']").should("be.disabled");
    });

    it("Can not edit username", function () {
        // check that I can not change my username
        cy.get("input[id='userName']").invoke("attr", "readonly").should("exist");
    });

    it("Can not edit password", function () {
        cy.get("input[id='password']").should("not.exist");
    });

    it("Can change email address", () => {
        cy.get("input[id='email']").clear().type(lecturer.email);
    });

    it("Country enum is filled", function () {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
        cy.get('select[id="country"]').select(lecturer.address.country);
    });

    it("Can change description", function () {
        cy.get("textarea[id='freeText']")
            .clear()
            .type(lecturer.freeText + "newDescription");
    });

    it("Can change FoS", function () {
        cy.get("textarea[id='researchArea']")
            .clear()
            .type(lecturer.researchArea + "newFoS");
    });

    it("Can change name", function () {
        cy.get('input[id="firstName"]')
            .clear()
            .type(lecturer.firstName + "newName");
    });

    it("Update working correctly", function () {
        cy.get("button[id='saveChanges']").click();
        cy.url().should("contain", "accounts");
    });

    // create admin account
    it("Show new account page", function () {
        cy.get('button[id="addAccount"]').click({ force: true });
        cy.url().should("contain", "/createAccount");
    });

    it("Can edit role", function () {
        cy.get("input[type='radio']").eq(0).click();
    });
    it("Can edit username", function () {
        cy.get("input[id='userName']").type(admin.username);
    });

    it("Can edit password", function () {
        cy.get("input[id='password']").should("exist");
        cy.get("input[id='password']").type(adminAuthUser.password);
    });

    it("Can enter phoneNumber", function () {
        cy.get("input[id='phoneNumber']").type(admin.phoneNumber);
    });

    it("Country enum is filled", function () {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
        cy.get('select[id="country"]').select(admin.address.country);
    });

    it("Can edit name", function () {
        cy.get("input[id='firstName']").type(admin.firstName);
        cy.get("input[id='lastName']").type(admin.lastName);
    });

    it("Can edit address", function () {
        cy.get("input[id='street']").type(admin.address.street);
        cy.get("input[id='houseNumber']").type(admin.address.houseNumber);
        cy.get("input[id='zipCode']").type(admin.address.zipCode);
        cy.get("input[id='city']").type(admin.address.city);
    });

    it("Can select birthDate", function () {
        cy.get("select").eq(0).select("15");
        cy.get("select").eq(1).select("November");
        cy.get("select").eq(2).select("1996");
    });

    it("Can change email address", () => {
        cy.get("input[id='email']").clear().type(admin.email);
    });

    it("Create account works", function () {
        cy.get("button").contains("Create Account").should("be.enabled");
        cy.get("button").contains("Create Account").click();
        cy.url().should("contain", "accounts");
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get(`div[id='user_${admin.username}']`).should("exist");
    });

    // edit account
    it("Show admin account edit page", function () {
        cy.get(`div[id='user_${admin.username}']`).click();
    });

    it("Save Changes button is disabled", function () {
        cy.get("button[id='saveChanges']").should("be.disabled");
    });

    it("Can not edit role", function () {
        // check that I can not change role
        cy.get("input[type='radio']").should("be.disabled");
    });

    it("Can not edit username", function () {
        // check that I can not change my username
        cy.get("input[id='userName']").invoke("attr", "readonly").should("exist");
    });

    it("Can not edit password", function () {
        cy.get("input[id='password']").should("not.exist");
    });

    it("Can change email address", () => {
        cy.get("input[id='email']").clear().type(admin.email);
    });

    it("Country enum is filled", function () {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
        cy.get('select[id="country"]').select(admin.address.country);
    });

    it("Can change name", function () {
        cy.get('input[id="firstName"]')
            .clear()
            .type(admin.firstName + "newName");
    });

    it("Update working correctly", function () {
        cy.get("button[id='saveChanges']").click();
        cy.url().should("contain", "accounts");
    });

    //delete student account
    it("Show edit page", function () {
        cy.get(`div[id='user_${student.username}']`).click();
    });

    it("Delete account", function () {
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

    //delete lecturer account
    it("Show edit page", function () {
        cy.get(`div[id='user_${lecturer.username}']`).click();
    });

    it("Delete account", function () {
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

    //delete admin account
    it("Show edit page", function () {
        cy.get(`div[id='user_${admin.username}']`).click();
    });

    it("Delete account", function () {
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

    it("Assert account deletion", function () {
        cy.url().should("contain", "/accounts");
        cy.get(`div[id='user_${student.username}']`).should("not.exist");
        cy.get(`div[id='user_${lecturer.username}']`).should("not.exist");
        cy.get(`div[id='user_${admin.username}']`).should("not.exist");
        cy.get("div[id='user_student']").should("exist");
        cy.get("div[id='user_lecturer']").should("exist");
        cy.get("div[id='user_admin']").should("exist");
    });
});
