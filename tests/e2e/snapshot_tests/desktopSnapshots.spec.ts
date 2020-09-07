import {
    navigateToAccountList,
    navigateToAccountForm,
    navigateToPrivateProfile,
    navigateToCourseForm,
    navigateToSettingsPage,
    navigateToAboutPage,
} from "../helpers/NavigationHelper";
import { loginAsDefaultAdmin, loginAsDefaultLecturer } from "../helpers/AuthHelper";
import { createCourse } from "../helpers/CourseHelper";
import Course from "@/api/api_models/course_management/Course";
import { CourseType } from "@/entities/CourseType";

describe("Snapshot testing", () => {
    const suffix = Cypress.browser.displayName + "-" + Cypress.browser.majorVersion;

    it("Login page", () => {
        const testName = "login-page-" + suffix;
        cy.visit("/");
        cy.wait(500);
        cy.document().toMatchImageSnapshot({ name: testName, capture: "fullPage" });
    });

    it("Login modal", () => {
        const testName = "login-modal-" + suffix;
        cy.visit("/welcome");
        cy.wait(500);
        cy.get("div[id='loginModal']").toMatchImageSnapshot({ name: testName });
    });

    it("Account list", () => {
        const testName = "accountlist-" + suffix;
        loginAsDefaultAdmin();
        navigateToAccountList();
        cy.wait(1000);
        cy.get("div[id='user_student']").toMatchImageSnapshot({ name: "student" + testName });
        cy.get("div[id='user_lecturer']").toMatchImageSnapshot({ name: "lecturer" + testName });
        cy.get("div[id='user_admin']").toMatchImageSnapshot({ name: "admin" + testName });
    });

    it("Create Account Form", () => {
        const testName = "create-account-" + suffix;
        navigateToAccountForm();
        cy.wait(500);
        cy.document().toMatchImageSnapshot({ name: testName, capture: "fullPage" });
    });

    it("Admin Private Profile", () => {
        loginAsDefaultAdmin();
        const testName = "admin-private-profile-" + suffix;
        navigateToPrivateProfile();
        cy.wait(500);
        cy.document().toMatchImageSnapshot({ name: testName, capture: "fullPage" });
    });

    // bugged on firefox
    it.skip("Settings Page", () => {
        const testName = "settings-" + suffix;
        cy.wait(100);
        navigateToSettingsPage();
        cy.wait(500);
        cy.document().toMatchImageSnapshot({ name: testName, capture: "fullPage" });
    });

    // bugged on firefox
    it.skip("Password Changing", () => {
        cy.get("button[id='updatePassword'").click();
        var testName = "password-changing-1-" + suffix;
        cy.document().toMatchImageSnapshot({ name: testName, capture: "fullPage" });

        var testName = "password-changing-2-" + suffix;
        cy.get("input[id='enterPasswordModalPassword']").type("admin");
        cy.get("button[id='enterPasswordModalConfirm']").click();
        cy.wait(1000);
        cy.document().toMatchImageSnapshot({ name: testName, capture: "fullPage" });
    });

    it("Course Form", () => {
        loginAsDefaultLecturer();
        navigateToCourseForm();
        cy.wait(500);
        const testName = "course-form-" + suffix;
        cy.document().toMatchImageSnapshot({ name: testName, capture: "fullPage" });
    });

    // todo courses
});
