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

    it("accounts", () => {
        cy.get(navbar_burger_menu).click();

        //open the menu
        cy.get("#nav_mobile_admin_menu_manage_accounts").click();

        //all accounts
        cy.get("#nav_mobile_admin_menu_manage_accounts_all").click();
        cy.url().should("contain", "accounts");

        //create account
        cy.get("#nav_mobile_admin_menu_manage_accounts_create").click();
        cy.url().should("contain", "createAccount");
    });
    checkProfile();
});

describe("lecturer", () => {
    beforeEach(() => {
        cy.viewport('iphone-x');
    })

    it("login", () => {
        cy.visit("/");
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_guest_login).click();
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("courses", () => {
        cy.get(navbar_burger_menu).click();

        //open the menu
        cy.get("#nav_mobile_lecturer_menu_courses").click();

        //all courses
        cy.get("#nav_mobile_lecturer_menu_courses_all").click();
        cy.url().should("contain", "all-courses");

        // create course
        cy.get("#nav_mobile_lecturer_menu_courses_create").click();
        cy.url().should("contain", "createCourse");

        // my courses
        cy.get("#nav_mobile_lecturer_menu_courses_my_courses").click();
        cy.url().should("contain", "all-courses");

    });
    checkProfile();
});

describe("student", () => {
    beforeEach(() => {
        cy.viewport('iphone-x');
    })

    it("login", () => {
        cy.visit("/");
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_guest_login).click();
        cy.get("input[id='email']").type("student");
        cy.get("input[id='password']").type("student");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("courses", () => {
        cy.get(navbar_burger_menu).click();

        //open the menu
        cy.get("#nav_mobile_student_menu_courses").click();

        //all courses
        cy.get("#nav_mobile_student_menu_courses_all").click();
        cy.url().should("contain", "courses");
    });
    checkProfile();
});

//checks the profile menu and implicityl logs the current user out.
function checkProfile() {
    it("profile", () => {
        //open the menu
        cy.get(".nav_mobile_menu_profile").click();

        //profile
        cy.get("#nav_mobile_profile").click();
        cy.url().should("contain", "profile");

        //settings
        cy.get("#nav_mobile_settings").click();
        cy.url().should("contain", "settings");

        //logout
        cy.get("#nav_mobile_logout").click();
        cy.url().should("eq", Cypress.config().baseUrl);
    });
}