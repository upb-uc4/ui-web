/*
 * Login as admin
 * check if admin, lecturer and student exist
 * create new account
 * check all input fields
 * check unsaved changes modal
 * create student account
 * edit student account
 * change fields of study
 * delete account
 * test account deletion modal
 */

describe("Account creation, edition and deletion", () => {
    const random = Math.floor(Math.random() * 500);
    const studentUsername = "cy-student" + random;
    const lecturerUsername = "cy-lecturer" + random;
    const adminUsername = "cy-admin" + random;

    it("Login as admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("admin");
        cy.get("input[id='password']").type("admin");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Navigate to accountlist", () => {
        cy.get("div[id='menu_manageAccounts']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_manageAccounts']").trigger("mouseover");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("span").contains("All Users").should("be.visible");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("a").contains("All Users").click();
        cy.get("div[id='menu_manageAccounts']").trigger("mouseleave");
        cy.url().should("contain", "accounts");
    });

    it("List contains admin, student and lecturer", () => {
        cy.get("div").contains("@student");
        cy.get("div").contains("@lecturer");
        cy.get("div").contains("@admin");
    });

    it("Role filter buttons exist", () => {
        cy.get("button[id='role-All']").should("exist");
        cy.get("button[id='role-Admin']").should("exist");
        cy.get("button[id='role-Lecturer']").should("exist");
        cy.get("button[id='role-Student']").should("exist");
    });

    it("Check if role filtering works", () => {
        // test admin role
        cy.get("button[id='role-Admin']").click();
        cy.get("div").contains("@admin");
        cy.get("div").contains("@lecturer").should("not.exist");
        cy.get("div").contains("@student").should("not.exist");
        // test lecturer role
        cy.get("button[id='role-Lecturer']").click();
        cy.get("div").contains("@lecturer");
        cy.get("div").contains("@admin").should("not.exist");
        cy.get("div").contains("@student").should("not.exist");

        // test student role
        cy.get("button[id='role-Student']").click();
        cy.get("div").contains("@student");
        cy.get("div").contains("@admin").should("not.exist");
        cy.get("div").contains("@lecturer").should("not.exist");

        //test all roles
        cy.get("button[id='role-All']").click();
        cy.get("div").contains("@admin").should("exist");
        cy.get("div").contains("@lecturer").should("exist");
        cy.get("div").contains("@student").should("exist");
    });

    it("Show new account page", () => {
        cy.get('button[id="addAccount"]').click({ force: true });
        cy.url().should("contain", "/createAccount");
    });

    it("Create Account button is disabled", () => {
        cy.get("button").contains("Create Account").should("be.disabled");
    });

    it("Check existence of all input fields", () => {
        cy.get("input[id='role-Admin']").should("exist");
        cy.get("input[id='role-Lecturer']").should("exist");
        cy.get("input[id='role-Student']").should("exist");

        cy.get("input[id='userName']").should("exist");
        cy.get("input[id='email']").should("exist");
        cy.get("input[id='password']").should("exist");
        cy.get("input[id='phoneNumber']").should("exist");
        cy.get("input[id='firstName']").should("exist");
        cy.get("input[id='lastName']").should("exist");
        cy.get("select[id='day']").should("exist");
        cy.get("select[id='month']").should("exist");
        cy.get("select[id='year']").should("exist");
        cy.get("select[id='country']").should("exist");
        cy.get("input[id='street']").should("exist");
        cy.get("input[id='houseNumber']").should("exist");
        cy.get("input[id='zipCode']").should("exist");
        cy.get("input[id='city']").should("exist");
    });

    it("Can edit role", () => {
        cy.get("input[type='radio']").should("be.enabled");

        //admin
        cy.get("input[type='radio']").eq(0).click();

        //lecturer
        cy.get("input[type='radio']").eq(1).click();
        cy.get("textarea[id='freeText']").should("exist");
        cy.get("textarea[id='researchArea']").should("exist");

        // student
        cy.get("input[type='radio']").eq(2).click();
        cy.get("input[id='matriculationId']").should("exist");
    });

    it("Show unsaved changes modal", () => {
        cy.get("button[id='cancel']").click();
        cy.wait(100);
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Do you really want to continue and leave this page? You have unsaved changes.");

        cy.get("button[id='unsavedChangesModalCancel']").click();
        cy.wait(100);
        cy.get("button[id='cancel']").click();
        cy.get("button[id='unsavedChangesModalConfirmLeave']").click();
    });
    // create student account
    it("Show new account page", () => {
        cy.get('button[id="addAccount"]').click({ force: true });
        cy.url().should("contain", "/createAccount");
    });

    it("Can edit role", () => {
        cy.get("input[type='radio']").eq(2).click();
    });
    it("Can edit username", () => {
        cy.get("input[id='userName']").type(studentUsername);
    });

    it("Can edit password", () => {
        cy.get("input[id='password']").should("exist");
        cy.get("input[id='password']").type("test-password-cypress");
    });

    it("Country enum is filled", () => {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
    });

    it("Can edit name", () => {
        cy.get("input[id='firstName']").type("firstName");
        cy.get("input[id='lastName']").type("lastName");
    });

    it("Can edit address", () => {
        cy.get("input[id='street']").type("test-street-cypress");
        cy.get("input[id='houseNumber']").type("1a");
        cy.get("input[id='zipCode']").type("12345");
        cy.get("input[id='city']").type("test-city-cypress");
    });

    it("Can select birthDate", () => {
        cy.get("select").eq(0).select("15");
        cy.get("select").eq(1).select("November");
        cy.get("select").eq(2).select("1996");
    });

    it("Invalid email address will show validation error", () => {
        cy.get("input[id='email']").clear().type("fail");
        cy.get("button").contains("Create Account").should("be.enabled");
        cy.get("button").contains("Create Account").click();

        cy.get("input[id='email']").siblings().get("p").should("have.class", "error-message");

        cy.get("input[id='email']").clear().type("valid@valid.de");
    });

    it("Can enter matriculationId", () => {
        cy.get("input[id='matriculationId']").type("1234567");
    });

    it("Can enter phoneNumber", () => {
        cy.get("input[id='phoneNumber']").type("+49 123456789");
    });

    it("Create account works", () => {
        cy.get("button").contains("Create Account").should("be.enabled");
        cy.get("button").contains("Create Account").click();
        cy.url().should("contain", "accounts");
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get(`div[id='user_${studentUsername}']`).should("exist");
    });

    // edit account
    it("Show student account edit page", () => {
        cy.get(`div[id='user_${studentUsername}']`).click();

        //todo check if everything is there
    });

    it("Save Changes button is disabled", () => {
        cy.get("button[id='saveChanges']").should("be.disabled");
    });

    it("Can not edit role", () => {
        // check that I can not change role
        cy.get("input[type='radio']").should("be.disabled");
    });

    it("Can not edit username", () => {
        // check that I can not change my username
        cy.get("input[id='userName']").invoke("attr", "readonly").should("exist");
    });

    it("Can not edit password", () => {
        cy.get("input[id='password']").should("not.exist");
    });

    it("Invalid email address will show validation error", () => {
        cy.get("input[id='email']").clear().type("fail");
        cy.get("button").contains("Save Changes").should("be.enabled");
        cy.get("button").contains("Save Changes").click();

        cy.get("input[id='email']").siblings().get("p").should("have.class", "error-message");

        cy.get("input[id='email']").clear().type("valid@valid.de");
    });

    it("Country enum is filled", () => {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
    });

    it("Can change name", () => {
        cy.get('input[id="firstName"]').clear().type("newName");
    });

    it("Update working correctly", () => {
        cy.get("button[id='saveChanges']").click();
        cy.url().should("contain", "accounts");
    });

    // create lecturer account
    it("Show new account page", () => {
        cy.get('button[id="addAccount"]').click({ force: true });
        cy.url().should("contain", "/createAccount");
    });

    it("Can edit role", () => {
        cy.get("input[type='radio']").eq(1).click();
    });
    it("Can edit username", () => {
        cy.get("input[id='userName']").type(lecturerUsername);
    });

    it("Can edit password", () => {
        cy.get("input[id='password']").should("exist");
        cy.get("input[id='password']").type("test-password-cypress");
    });

    it("Can enter phoneNumber", () => {
        cy.get("input[id='phoneNumber']").type("+49 123456789");
    });

    it("Country enum is filled", () => {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
    });

    it("Can edit name", () => {
        cy.get("input[id='firstName']").type("firstName");
        cy.get("input[id='lastName']").type("lastName");
    });

    it("Can edit address", () => {
        cy.get("input[id='street']").type("test-street-cypress");
        cy.get("input[id='houseNumber']").type("1a");
        cy.get("input[id='zipCode']").type("12345");
        cy.get("input[id='city']").type("test-city-cypress");
    });

    it("Can select birthDate", () => {
        cy.get("select").eq(0).select("15");
        cy.get("select").eq(1).select("November");
        cy.get("select").eq(2).select("1996");
    });

    it("Invalid email address will show validation error", () => {
        cy.get("input[id='email']").clear().type("fail");
        cy.get("button").contains("Create Account").should("be.enabled");
        cy.get("button").contains("Create Account").click();

        cy.get("input[id='email']").siblings().get("p").invoke("hasClass", "error-message");

        cy.get("input[id='email']").clear().type("valid@valid.de");
    });

    it("Can enter free text", () => {
        cy.get("textarea[id='freeText']").type("I'm a lecturer created by the test framework Cypress");
    });

    it("Can enter fields of research", () => {
        cy.get("textarea[id='researchArea']").type("Cypress-Test-FoS");
    });

    it("Create account works", () => {
        cy.get("button").contains("Create Account").should("be.enabled");
        cy.get("button").contains("Create Account").click();
        cy.url().should("contain", "accounts");
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get(`div[id='user_${lecturerUsername}']`).should("exist");
    });

    // edit account
    it("Show lecturer account edit page", () => {
        cy.get(`div[id='user_${lecturerUsername}']`).click();
    });

    it("Save Changes button is disabled", () => {
        cy.get("button[id='saveChanges']").should("be.disabled");
    });

    it("Can not edit role", () => {
        // check that I can not change role
        cy.get("input[type='radio']").should("be.disabled");
    });

    it("Can not edit username", () => {
        // check that I can not change my username
        cy.get("input[id='userName']").invoke("attr", "readonly").should("exist");
    });

    it("Can not edit password", () => {
        cy.get("input[id='password']").should("not.exist");
    });

    it("Invalid email address will show validation error", () => {
        cy.get("input[id='email']").clear().type("fail");
        cy.get("button").contains("Save Changes").should("be.enabled");
        cy.get("button").contains("Save Changes").click();

        cy.get("input[id='email']").siblings().get("p").invoke("hasClass", "error-message");

        cy.get("input[id='email']").clear().type("valid@valid.de");
    });

    it("Country enum is filled", () => {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
    });

    it("Can change description", () => {
        cy.get("textarea[id='freeText']").clear().type("newDescription");
    });

    it("Can change FoS", () => {
        cy.get("textarea[id='researchArea']").clear().type("newFoS");
    });

    it("Can change name", () => {
        cy.get('input[id="firstName"]').clear().type("newName");
    });

    it("Update working correctly", () => {
        cy.get("button[id='saveChanges']").click();
        cy.url().should("contain", "accounts");
    });

    // create admin account
    it("Show new account page", () => {
        cy.get('button[id="addAccount"]').click({ force: true });
        cy.url().should("contain", "/createAccount");
    });

    it("Can edit role", () => {
        cy.get("input[type='radio']").eq(0).click();
    });
    it("Can edit username", () => {
        cy.get("input[id='userName']").type(adminUsername);
    });

    it("Can edit password", () => {
        cy.get("input[id='password']").should("exist");
        cy.get("input[id='password']").type("test-password-cypress");
    });

    it("Can enter phoneNumber", () => {
        cy.get("input[id='phoneNumber']").type("+49 123456789");
    });

    it("Country enum is filled", () => {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
    });

    it("Can edit name", () => {
        cy.get("input[id='firstName']").type("firstName");
        cy.get("input[id='lastName']").type("lastName");
    });

    it("Can edit address", () => {
        cy.get("input[id='street']").type("test-street-cypress");
        cy.get("input[id='houseNumber']").type("1a");
        cy.get("input[id='zipCode']").type("12345");
        cy.get("input[id='city']").type("test-city-cypress");
    });

    it("Can select birthDate", () => {
        cy.get("select").eq(0).select("15");
        cy.get("select").eq(1).select("November");
        cy.get("select").eq(2).select("1996");
    });

    it("Invalid email address will show validation error", () => {
        cy.get("input[id='email']").clear().type("fail");
        cy.get("button").contains("Create Account").should("be.enabled");
        cy.get("button").contains("Create Account").click();

        cy.get("input[id='email']").siblings().get("p").invoke("hasClass", "error-message");

        cy.get("input[id='email']").clear().type("valid@valid.de");
    });

    it("Create account works", () => {
        cy.get("button").contains("Create Account").should("be.enabled");
        cy.get("button").contains("Create Account").click();
        cy.url().should("contain", "accounts");
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get(`div[id='user_${adminUsername}']`).should("exist");
    });

    // edit account
    it("Show admin account edit page", () => {
        cy.get(`div[id='user_${adminUsername}']`).click();
    });

    it("Save Changes button is disabled", () => {
        cy.get("button[id='saveChanges']").should("be.disabled");
    });

    it("Can not edit role", () => {
        // check that I can not change role
        cy.get("input[type='radio']").should("be.disabled");
    });

    it("Can not edit username", () => {
        // check that I can not change my username
        cy.get("input[id='userName']").invoke("attr", "readonly").should("exist");
    });

    it("Can not edit password", () => {
        cy.get("input[id='password']").should("not.exist");
    });

    it("Invalid email address will show validation error", () => {
        cy.get("input[id='email']").clear().type("fail");
        cy.get("button").contains("Save Changes").should("be.enabled");
        cy.get("button").contains("Save Changes").click();

        cy.get("input[id='email']").siblings().get("p").invoke("hasClass", "error-message");

        cy.get("input[id='email']").clear().type("valid@valid.de");
    });

    it("Country enum is filled", () => {
        cy.get('select[id="country"]').select("Germany");
        cy.get('select[id="country"]').select("United States");
    });

    it("Can change name", () => {
        cy.get('input[id="firstName"]').clear().type("newName");
    });

    it("Update working correctly", () => {
        cy.get("button[id='saveChanges']").click();
        cy.url().should("contain", "accounts");
    });

    //delete student account
    it("Show edit page", () => {
        cy.get(`div[id='user_${studentUsername}']`).click();
    });

    it("Delete account", () => {
        cy.wait(100);
        cy.get("button[id='deleteAccount']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this account").should("exist");
        // cancel
        cy.get('button[id="deleteAccountModalCancel"]').click();
        cy.get("button[id='deleteAccount']").click();
        cy.wait(100);
        cy.get('button[id="deleteAccountModalDelete"]').click();
    });

    //delete lecturer account
    it("Show edit page", () => {
        cy.get(`div[id='user_${lecturerUsername}']`).click();
    });

    it("Delete account", () => {
        cy.wait(100);
        cy.get("button[id='deleteAccount']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this account").should("exist");
        // cancel
        cy.get('button[id="deleteAccountModalCancel"]').click();
        cy.get("button[id='deleteAccount']").click();
        cy.wait(100);
        cy.get('button[id="deleteAccountModalDelete"]').click();
    });

    //delete lecturer account
    it("Show edit page", () => {
        cy.get(`div[id='user_${adminUsername}']`).click();
    });

    it("Delete account", () => {
        cy.wait(100);
        cy.get("button[id='deleteAccount']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this account").should("exist");
        // cancel
        cy.get('button[id="deleteAccountModalCancel"]').click();
        cy.get("button[id='deleteAccount']").click();
        cy.wait(100);
        cy.get('button[id="deleteAccountModalDelete"]').click();
    });

    it("Assert account deletion", () => {
        cy.url().should("contain", "/accounts");
        cy.get(`div[id='user_${studentUsername}']`).should("not.exist");
        cy.get(`div[id='user_${lecturerUsername}']`).should("not.exist");
        cy.get(`div[id='user_${adminUsername}']`).should("not.exist");
        cy.get("div[id='user_student']").should("exist");
        cy.get("div[id='user_lecturer']").should("exist");
        cy.get("div[id='user_admin']").should("exist");
    });
});
