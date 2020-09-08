import { loginAsDefaultLecturer, loginAsDefaultAdmin, loginAsDefaultStudent, logout } from "./helpers/AuthHelper";

describe("Login behaviour", () => {
    it("Login as Lecturer", () => {
        loginAsDefaultLecturer();
    });

    it("Login as Admin", () => {
        loginAsDefaultAdmin();
    });

    it("Login as Student", () => {
        loginAsDefaultStudent();
    });

    it("Logout works", () => {
        logout();
        cy.go(-1);
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Please enter your authentication credentials.");
        cy.get("button[id='loginModalCancel']").click();
        cy.url().should("contain", "/login");
    });
});
