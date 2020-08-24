const navbar_burger_menu = 'button[id="nav_mobile_toggle_menu"]';
const navbar_about = "#nav_mobile_common_about";
const navbar_guest_login = "#nav_mobile_guest_login";

beforeEach(() => {
    cy.viewport('iphone-x');
})

describe("guest", () => {
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
        const navbar_admin_manage_accounts = "#nav_mobile_admin_menu_manage_accounts";
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_admin_manage_accounts).trigger("mouseover");

        // TODO test menu items
    });

    it("profile", () => {
        // TODO implement
    });
});

describe("lecturer", () => {
    //TODO implement
});

describe("student", () => {
    //TODO implement
});