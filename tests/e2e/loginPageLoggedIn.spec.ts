import { Account } from "@/entities/Account";

describe("Test that you cannot reach the login page via back button after logging in", () => {
    let adminAuth: Account;

    before(() => {
        cy.fixture("logins/admin.json").then((admin) => {
            adminAuth = admin;
        });
    });

    it("Login as Admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(adminAuth.username);
        cy.get("input[id='password']").type(adminAuth.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "/welcome");
    });
    it("Login page not reachable", () => {
        cy.go(-1);
        cy.url().should("contain", "/welcome");
    });
});
