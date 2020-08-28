describe.skip("Login page snapshot testing", () => {
    it("toMatchImageSnapshot - whole page", () => {
        cy.visit("/").then(() => {
            cy.document().toMatchImageSnapshot();
        });
    });
});
