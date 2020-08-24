const navbar_burger_menu = 'button[id="nav_mobile_toggle_menu"]';
const navbar_about = "#nav_mobile_common_about";

beforeEach(() => {
    cy.viewport('iphone-x');
})

describe("guest", () => {
    it("login", () => {
        const navbar_guest_login = "#nav_mobile_guest_login";
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
    //TODO implement
});

describe("lecturer", () => {
    //TODO implement
});

describe("student", () => {
    //TODO implement
});