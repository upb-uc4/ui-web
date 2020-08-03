describe("Login behaviour", () => {
    it("Login with default accounts", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");

        cy.reload();

        cy.visit("/");
        cy.get("input[id='email']").type("admin");
        cy.get("input[id='password']").type("admin");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");

        cy.reload();

        cy.visit("/");
        cy.get("input[id='email']").type("student");
        cy.get("input[id='password']").type("student");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });
});
