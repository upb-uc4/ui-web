import { paths } from "@/use/router/paths";
import { loginAsDefaultAdmin, logout } from "./helpers/AuthHelper";

describe("Test that you cannot reach the login page via back button after logging in", () => {
    before(() => {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });
    });

    after(() => {
        logout();
    });

    it("Login as Admin", () => {
        loginAsDefaultAdmin();
    });

    it("Login page not reachable", () => {
        cy.go(-1);
        cy.url().should("contain", paths.WELCOME_PAGE);
    });
});
