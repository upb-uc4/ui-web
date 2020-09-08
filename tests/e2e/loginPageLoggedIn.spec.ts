import { loginAsDefaultAdmin } from "./helpers/AuthHelper";

describe("Test that you cannot reach the login page via back button after logging in", () => {
    it("Login as Admin", () => {
        loginAsDefaultAdmin();
    });

    it("Login page not reachable", () => {
        cy.go(-1);
        cy.url().should("contain", "/welcome");
    });
});
