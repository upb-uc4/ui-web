const navbar_burger_menu = 'button[id="nav_mobile_toggle_menu"]';
const navbar_about = "#nav_mobile_common_about";
const navbar_guest_login = "#nav_mobile_guest_login";


describe("guest", () => {
    beforeEach(() => {
        cy.viewport('iphone-x');
    })

    it("login", () => {
        cy.visit("/");
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_guest_login).click();
        cy.url().should("contain", "login");
    });

    it("about", () => {
        cy.visit("/");
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_about).click();
        cy.url().should("contain", "about");
    });
});

describe("admin", () => {
    beforeEach(() => {
        cy.viewport('iphone-x');
    })

    it("login", () => {
        cy.visit("/");
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_guest_login).click();
        cy.get("input[id='email']").type("admin");
        cy.get("input[id='password']").type("admin");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("courses", () => {
        cy.get(navbar_burger_menu).click();

        //all accounts
        cy.get("#nav_mobile_admin_menu_manage_accounts_all").click();
        cy.url().should("contain", "accounts");

        //create account
        cy.get("#nav_mobile_admin_menu_manage_accounts_create").click();
        cy.url().should("contain", "createAccount");
    });

    it("profile", () => {
        //profile
        cy.get("#nav_mobile_admin_menu_profile_private").click();
        cy.url().should("contain", "profile");

        //settings
        cy.get("#nav_mobile_admin_settings").click();
        cy.url().should("contain", "settings");

        //logout
        cy.get("#nav_mobile_admin_logout").click();
        cy.url().should("eq", Cypress.config().baseUrl);
    });
});

describe("lecturer", () => {
    //TODO implement
});

describe("student", () => {
    //TODO implement
});