import { paths } from "@/use/router/paths";
import { loginAsDefaultAdmin, loginAsDefaultLecturer, loginAsDefaultStudent } from "./helpers/AuthHelper";

const navbar_burger_menu_list = "#nav_mobile_menu_list";
const navbar_burger_menu = 'button[id="nav_mobile_toggle_menu"]';
const navbar_about = "#nav_mobile_common_about";
const navbar_guest_login = "#nav_mobile_guest_login";

before(() => {
    cy.clearCookies();
    Cypress.Cookies.defaults({
        preserve: ["refresh", "login"],
    });
});

describe("guest", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
    });

    it("login", () => {
        cy.visit(paths.HOME);
        cy.wait(500);
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_guest_login).click();
        cy.url().should("contain", "login");
    });

    it("about", () => {
        cy.visit(paths.HOME);
        cy.wait(500);
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_about).click();
        cy.url().should("contain", paths.ABOUT_PAGE);
    });
});

describe("admin", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
    });

    it("login", () => {
        cy.visit(paths.HOME);
        cy.wait(500);
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_guest_login).click();
        loginAsDefaultAdmin();
    });

    it("accounts", () => {
        cy.get(navbar_burger_menu).click();

        //open the menu
        cy.get("#nav_mobile_admin_menu_manage_accounts").click();

        //all accounts
        cy.get("#nav_mobile_admin_menu_manage_accounts_all").click();
        cy.url().should("contain", "accounts");

        cy.get(navbar_burger_menu).click();

        //create account
        cy.get("#nav_mobile_admin_menu_manage_accounts_create").click();
        cy.url().should("contain", paths.CREATE_ACCOUNT);
    });

    it("courses", () => {
        cy.get(navbar_burger_menu).click();
        cy.get("#nav_mobile_admin_menu_courses").click();

        //all courses
        cy.get("#nav_mobile_admin_menu_courses_all").click();
        cy.url().should("contain", "all-courses");

        cy.get(navbar_burger_menu).click();

        // create course
        cy.get("#nav_mobile_admin_menu_courses_create").click();
        cy.url().should("contain", paths.CREATE_COURSE);
    });
    checkProfile();
});

describe("lecturer", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
    });

    it("login", () => {
        cy.visit(paths.HOME);
        cy.wait(500);
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_guest_login).click();
        loginAsDefaultLecturer();
    });

    it("courses", () => {
        cy.get(navbar_burger_menu).click();

        //open the menu
        cy.get("#nav_mobile_lecturer_menu_courses").click();

        //all courses
        cy.get("#nav_mobile_lecturer_menu_courses_all").click();
        cy.url().should("contain", "all-courses");

        cy.get(navbar_burger_menu).click();

        // create course
        cy.get("#nav_mobile_lecturer_menu_courses_create").click();
        cy.url().should("contain", paths.CREATE_COURSE);

        cy.get(navbar_burger_menu).click();

        // my courses
        cy.get("#nav_mobile_lecturer_menu_courses_my_courses").click();
        cy.url().should("contain", "course-management");
    });
    checkProfile();
});

describe("student", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
    });

    it("login", () => {
        cy.visit(paths.HOME);
        cy.wait(500);
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_guest_login).click();
        loginAsDefaultStudent();
    });

    it("courses", () => {
        cy.get(navbar_burger_menu).click();

        //open the menu
        cy.get("#nav_mobile_student_menu_courses").click();

        //all courses
        cy.get("#nav_mobile_student_menu_courses_all").click();
        cy.url().should("contain", paths.STUDENT_COURSES);
    });
    checkProfile();
});

describe("menu", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
    });

    it("toggleMenu", () => {
        cy.visit(paths.HOME);
        cy.wait(500);
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_burger_menu_list).should("be.visible");
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_burger_menu_list).should("not.be.visible");
    });

    it("closeOnTransition", () => {
        cy.visit(paths.HOME);
        cy.wait(500);
        cy.get(navbar_burger_menu).click();
        cy.get(navbar_burger_menu_list).should("be.visible");
        cy.get(navbar_about).click();
        cy.get(navbar_burger_menu_list).should("not.be.visible");
    });
});

//checks the profile menu and implicityl logs the current user out.
function checkProfile() {
    it("profile", () => {
        cy.get(navbar_burger_menu).click();

        //open the menu
        cy.get(".nav_mobile_menu_profile").click();

        //profile
        cy.get("#nav_mobile_profile").click();
        cy.url().should("contain", paths.PRIVATE_PROFILE);

        cy.get(navbar_burger_menu).click();

        //settings
        cy.get("#nav_mobile_settings").click();
        cy.url().should("contain", paths.SETTINGS);

        cy.get(navbar_burger_menu).click();

        //logout
        cy.get("#nav_mobile_logout").click();
        cy.url().should("eq", Cypress.config().baseUrl);
    });
}
