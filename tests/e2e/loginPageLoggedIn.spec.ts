describe("Test that you cannot reach the login page via back button after logging in", () => {
    it("Login as Admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("admin");
        cy.get("input[id='password']").type("admin");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "/welcome");
    });
    it("Login page not reachable", () => {
        cy.go(-1);
        cy.url().should("contain", "/welcome");
    });
});
