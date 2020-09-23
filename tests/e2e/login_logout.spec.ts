import { loginAsDefaultLecturer, loginAsDefaultAdmin, loginAsDefaultStudent, logout } from "./helpers/AuthHelper";

describe("Login behaviour", () => {
    before(() => {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });
    });

    it("Login as Lecturer", () => {
        loginAsDefaultLecturer();
        logout();
    });

    it("Login as Admin", () => {
        loginAsDefaultAdmin();
        logout();
    });

    it("Login as Student", () => {
        loginAsDefaultStudent();
        logout();
    });
});
