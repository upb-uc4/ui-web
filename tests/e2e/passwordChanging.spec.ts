describe("Change password", () => {
    const random = Math.floor(Math.random() * 500);
    const studentUsername = "cy-student" + random;

    it("Login as admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("admin");
        cy.get("input[id='password']").type("admin");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Show new account page", () => {
        cy.get("div[id='menu_manageAccounts']").trigger("mouseover");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("a").contains("New Account").click();
        cy.get("div[id='menu_manageAccounts']").trigger("mouseleave");
        cy.url().should("contain", "/createAccount");
    });

    it("Create account works", () => {
        cy.get("input[type='radio']").eq(2).click();
        cy.get("input[id='userName']").type(studentUsername);
        cy.get("input[id='password']").type("test-password-cypress");
        cy.get('select[id="country"]').select("Germany");
        cy.get("input[id='firstName']").type("firstName");
        cy.get("input[id='lastName']").type("lastName");
        cy.get("input[id='street']").type("test-street-cypress");
        cy.get("input[id='houseNumber']").type("1a");
        cy.get("input[id='zipCode']").type("12345");
        cy.get("input[id='city']").type("test-city-cypress");
        cy.get("select[id='day']").select("15");
        cy.get("select[id='month']").select("November");
        cy.get("select[id='year']").select("1996");
        cy.get("input[id='email']").clear().type("valid@valid.de");
        cy.get("input[id='matriculationId']").type("1234567");
        cy.get("input[id='phoneNumber']").type("+49 123456789");

        cy.get("button").contains("Create Account").click();
        cy.wait(300);
    });

    it("Login with new student account", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(studentUsername);
        cy.get("input[id='password']").type("test-password-cypress");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Navigate to settings page", () => {
        cy.get("div[id='menu_profile']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_profile']").trigger("mouseover");
        cy.get("div[id='menu_profile']").children().eq(1).get("span").contains("Settings").should("be.visible");
        cy.get("div[id='menu_profile']").children().eq(1).get("a").contains("Settings").click();
        cy.get("div[id='menu_profile']").trigger("mouseleave");
        cy.url().should("contain", "/settings");
    });

    it("Open password change modal", () => {
        cy.get("#modal-wrapper").should("exist");
        cy.get("div[id='modal-wrapper']").children().should("not.be.visible");

        // open
        cy.get("button[id='updatePassword'").click();
        cy.get("div[id='modal-wrapper']").children().eq(0).should("be.visible");

        // close with cancel button
        cy.get("button[id='enterPasswordModalCancel']").click();
        cy.get("div[id='modal-wrapper']").children().should("not.be.visible");

        // open
        cy.get("button[id='updatePassword'").click();
        cy.get("div[id='modal-wrapper']").children().eq(0).should("be.visible");
    });

    it("Enter wrong password should show error", () => {
        cy.get("input[id='enterPasswordModalPassword']").type("test-password-cypress-wrong");
        cy.get("button[id='enterPasswordModalConfirm']").click();

        cy.get("p").should("have.class", "error-message").should("exist");
    });

    it("Enter correct password", () => {
        cy.get("input[id='enterPasswordModalPassword']").clear().type("test-password-cypress");
        cy.get("button[id='enterPasswordModalConfirm']").click();

        cy.get("p").invoke("hasClass", "error-message").should("not.be.visible");
        cy.get("div[id='modal-wrapper']").children().should("not.be.visible");
    });

    it("Password fields should be password fields", () => {
        cy.get("input[id='newPassword']").invoke("attr", "type").should("equal", "password");
        cy.get("input[id='confirmationPassword']").invoke("attr", "type").should("equal", "password");
    });

    it("Converting password fields to text fields works", () => {
        cy.get("button[id='toggleNewPassword']").click();

        cy.get("input[id='newPassword']").invoke("attr", "type").should("equal", "text");
        cy.get("input[id='confirmationPassword']").invoke("attr", "type").should("equal", "text");

        cy.get("button[id='toggleConfirmationPassword']").click();

        cy.get("input[id='newPassword']").invoke("attr", "type").should("equal", "password");
        cy.get("input[id='confirmationPassword']").invoke("attr", "type").should("equal", "password");
    });

    it("Entering different passwords should block button", () => {
        cy.get("button[id='changePassword']").should("be.disabled");
        cy.get("input[id='newPassword']").type("password-a");
        cy.get("input[id='confirmationPassword']").type("password-b");
        cy.get("button[id='changePassword']").should("be.disabled");
    });

    it("Entering the same password should be valid", () => {
        cy.get("button[id='changePassword']").should("be.disabled");
        cy.get("input[id='newPassword']").clear().type("test-password-cypress-new");
        cy.get("input[id='confirmationPassword']").clear().type("test-password-cypress-new");
        cy.get("button[id='changePassword']").should("not.be.disabled");
        cy.get("button[id='changePassword']").click();
    });

    it("Password change should hide inputs", () => {
        cy.get("input[id='newPassword']").should("not.exist");
        cy.get("input[id='confirmationPassword']").should("not.exist");
        cy.get("button[id='changePassword']").should("not.exist");
        cy.wait(300);
    });

    it("Login with new password", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(studentUsername);
        cy.get("input[id='password']").type("test-password-cypress-new");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Login as admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("admin");
        cy.get("input[id='password']").type("admin");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Delete account", () => {
        cy.get("div[id='menu_manageAccounts']").trigger("mouseover");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("a").contains("All Users").click();
        cy.get("div[id='menu_manageAccounts']").trigger("mouseleave");

        cy.get(`div[id='user_${studentUsername}']`).click();
        cy.wait(100);
        cy.get("button[id='deleteAccount']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this account").should("exist");
        // cancel
        cy.wait(100);
        cy.get('button[id="deleteAccountModalDelete"]').click();
    });
});
