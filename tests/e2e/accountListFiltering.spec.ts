import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { loginAsDefaultAdmin, logout } from "./helpers/AuthHelper";
import { navigateToAccountList } from "./helpers/NavigationHelper";

let adminAuth: Account;
let studentAuth: Account;
let lecturerAuth: Account;

describe("Account creation, edition and deletion", function () {
    before(function () {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
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
        logout();
    });

    it("Login as admin and navigate to account list", () => {
        loginAsDefaultAdmin();
        navigateToAccountList();
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
});
