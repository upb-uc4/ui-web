import { loginAsDefaultLecturer, loginAsDefaultAdmin, loginAsDefaultStudent, logout } from "./helpers/AuthHelper";

describe("Login behaviour", () => {
    before(() => {
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });
    });

    it("Login as Lecturer", () => {
        loginAsDefaultLecturer();
    });

    it("Login as Admin", () => {
        logout();
        loginAsDefaultAdmin();
    });

    it("Login as Student", () => {
        logout();
        loginAsDefaultStudent();
    });

    it("Logout works", () => {
        cy.get("div[id='menu_profile']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_profile']").trigger("mouseover");
        cy.get("div[id='menu_profile']").children().eq(1).get("span").contains("Sign out").should("be.visible");
        cy.get("div[id='menu_profile']").children().eq(1).get("button").contains("Sign out").click();
        cy.url().should("contain", "/");
        cy.wait(100);
        cy.go(-1);
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Please enter your authentication credentials.");
        cy.get("button[id='loginModalCancel']").click();
        cy.url().should("not.contain", "/welcome");
    });
});
