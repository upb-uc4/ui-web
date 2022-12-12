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
import { navigateToAccountList } from "./helpers/NavigationHelper";
import {
    createNewAdmin,
    createNewLecturer,
    createNewStudent,
    deleteUser,
    deleteUsers,
    getRandomizedGovernmentId,
    getRandomMatriculationId,
} from "./helpers/UserHelper";

const random = Math.floor(Math.random() * 9999);
let admin: Admin;
let adminAuthUser: Account;
let adminGovId: string;
let student: Student;
let studentAuthUser: Account;
let studentGovId: string;
let lecturer: Lecturer;
let lecturerAuthUser: Account;
let lecturerGovId: string;

let adminAuth: Account;
let studentAuth: Account;
let lecturerAuth: Account;

describe("Account creation, edition and deletion", function () {
    before(function () {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });

        cy.fixture("admin.json").then((a) => {
            (a as Admin).username += random;
            admin = a as Admin;
            adminGovId = getRandomizedGovernmentId();
        });
        cy.fixture("adminAuthUser.json").then((a) => {
            (a as Account).username += random;
            adminAuthUser = a as Account;
        });

        cy.fixture("lecturer.json").then((l) => {
            (l as Lecturer).username += random;
            lecturer = l as Lecturer;
            lecturerGovId = getRandomizedGovernmentId();
        });
        cy.fixture("lecturerAuthUser.json").then((l) => {
            (l as Account).username += random;
            lecturerAuthUser = l as Account;
        });

        cy.fixture("student.json").then((s) => {
            (s as Student).username += random;
            student = s as Student;
            student.matriculationId = getRandomMatriculationId();
            studentGovId = getRandomizedGovernmentId();
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

    after(() => {
        deleteUsers([studentAuthUser, lecturerAuthUser, adminAuthUser], adminAuth);
        logout();
    });

    it("Login as admin", function () {
        loginAsDefaultAdmin();
    });

    it("Navigate to accountlist", function () {
        navigateToAccountList();
    });

    it("Show new account page", function () {
        cy.get('a[id="addAccount"]').click({ force: true });
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
        cy.get("input[id='securitySectionPassword']").should("exist");
        cy.get("input[id='phoneNumber']").should("exist");
        cy.get("input[id='firstName']").should("exist");
        cy.get("input[id='lastName']").should("exist");
        cy.get("button[id='day']").should("exist");
        cy.get("button[id='month']").should("exist");
        cy.get("button[id='year']").should("exist");
        cy.get("button[id='country']").should("exist");
        cy.get("input[id='street']").should("exist");
        cy.get("input[id='houseNumber']").should("exist");
        cy.get("input[id='zipCode']").should("exist");
        cy.get("input[id='city']").should("exist");
        cy.get("input[id='governmentId']").should("exist");
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
        cy.get('a[id="addAccount"]').click({ force: true });
        cy.url().should("contain", "/createAccount");
    });

    it("Show validation errors", () => {
        cy.get("input[id='userName']").type(student.username);
        cy.get("button[id='createAccount']").click();
        cy.get("div[id='roleSelection']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[type='radio']").eq(1).click();
        cy.get("textarea[id='researchArea']").invoke("val", "1".repeat(201)).trigger("input");
        cy.get("textarea[id='freeText']").invoke("val", "1".repeat(10001)).trigger("input");
        cy.get("input[id='userName']").clear();
        cy.get("button[id='createAccount']").click();
        cy.get("input[id='userName']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[id='email']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[id='phoneNumber']").siblings().get("label").should("have.class", "input-label-error");
        //TODO include when password is not optional
        //cy.get("input[id='password']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[id='firstName']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[id='lastName']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("div[id='birthdate']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("button[id='country']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[id='street']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[id='houseNumber']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[id='zipCode']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[id='city']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("textarea[id='researchArea']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("textarea[id='freeText']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[type='radio']").eq(2).click();
        cy.get("button[id='createAccount']").click();
        cy.get("input[id='matriculationId']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[id='governmentId']").siblings().get("label").should("have.class", "input-label-error");
    });

    it("Duplicate username detected", () => {
        cy.get("input[id='userName']").type("student");
        cy.get("button[id='createAccount']").click();
        cy.get("input[id='userName']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[id='userName']").clear();
    });
    // create student account
    it("Create student account", () => {
        createNewStudent(studentGovId, student, studentAuthUser);
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
        cy.get("input[type='radio']").should("not.exist");
    });

    it("Can not edit username", function () {
        // check that I can not change my username
        cy.get("input[id='userName']").invoke("attr", "readonly").should("exist");
    });

    it("Can not edit password", function () {
        cy.get("input[id='securitySectionPassword']").should("not.exist");
    });

    it("Can change email address", () => {
        cy.get("input[id='email']").clear().type(student.email);
    });

    it("Country enum is filled", function () {
        cy.get('button[id="country"]').click();
        cy.get('li[id="countryItem-Germany"]').click();
        cy.get('button[id="country"]').click();
        cy.get('li[id="countryItem-United States"]').click();
        cy.get('button[id="country"]').click();
        cy.get('li[id="countryItem-' + student.address.country + '"]').click();
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
    it("Create lecturer account", function () {
        createNewLecturer(lecturerGovId, lecturer, lecturerAuthUser);
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
        cy.get("input[type='radio']").should("not.exist");
    });

    it("Can not edit username", function () {
        // check that I can not change my username
        cy.get("input[id='userName']").invoke("attr", "readonly").should("exist");
    });

    it("Can not edit password", function () {
        cy.get("input[id='securitySectionPassword']").should("not.exist");
    });

    it("Can change email address", () => {
        cy.get("input[id='email']").clear().type(lecturer.email);
    });

    it("Country enum is filled", function () {
        cy.get('button[id="country"]').click();
        cy.get('li[id="countryItem-Germany"]').click();
        cy.get('button[id="country"]').click();
        cy.get('li[id="countryItem-United States"]').click();
        cy.get('button[id="country"]').click();
        cy.get('li[id="countryItem-' + student.address.country + '"]').click();
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
    it("Create admin account", function () {
        createNewAdmin(adminGovId, admin, adminAuthUser);
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
        cy.get("input[type='radio']").should("not.exist");
    });

    it("Can not edit username", function () {
        // check that I can not change my username
        cy.get("input[id='userName']").invoke("attr", "readonly").should("exist");
    });

    it("Can not edit password", function () {
        cy.get("input[id='securitySectionPassword']").should("not.exist");
    });

    it("Can change email address", () => {
        cy.get("input[id='email']").clear().type(admin.email);
    });

    it("Country enum is filled", function () {
        cy.get('button[id="country"]').click();
        cy.get('li[id="countryItem-Germany"]').click();
        cy.get('button[id="country"]').click();
        cy.get('li[id="countryItem-United States"]').click();
        cy.get('button[id="country"]').click();
        cy.get('li[id="countryItem-' + student.address.country + '"]').click();
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

    it("Delete users as admin", function () {
        deleteUser(student);
        cy.wait(10000);
        deleteUser(lecturer);
        cy.wait(10000);
        deleteUser(admin);
    });
});
