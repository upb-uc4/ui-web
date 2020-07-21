describe("Login behaviour", () => {
    it("Login as admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "lecturer");

        cy.reload();

        cy.visit("/");
        cy.get("input[id='email']").type("admin");
        cy.get("input[id='password']").type("admin");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "admin");

        cy.reload();

        cy.visit("/");
        cy.get("input[id='email']").type("student");
        cy.get("input[id='password']").type("student");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "student");
    });
});
