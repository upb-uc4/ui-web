describe("Login behaviour", () => {
    it("Login as Lecturer", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Login as Admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("admin");
        cy.get("input[id='password']").type("admin");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Login as Student", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("student");
        cy.get("input[id='password']").type("student");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
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
