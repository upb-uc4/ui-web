import { loginAsDefaultLecturer, loginAsDefaultAdmin, loginAsDefaultStudent } from "./helpers/AuthHelper";

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
        cy.get("div[id='menu_profile']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_profile']").trigger("mouseover");
        cy.get("div[id='menu_profile']").children().eq(1).get("span").contains("Sign out").should("be.visible");
        cy.get("div[id='menu_profile']").children().eq(1).get("a").contains("Sign out").click();
        cy.url().should("contain", "/");
        cy.go(-1);
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Please enter your authentication credentials.");
        cy.get("button[id='loginModalCancel']").click();
        cy.url().should("contain", "/login");
    });
});
