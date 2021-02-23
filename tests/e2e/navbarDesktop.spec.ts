import { loginAsDefaultAdmin, loginAsDefaultLecturer, loginAsDefaultStudent, logout } from "./helpers/AuthHelper";

before(() => {
    cy.clearCookies();
    Cypress.Cookies.defaults({
        preserve: ["refresh", "login"],
    });
});

describe("guest", () => {
    it("about", () => {
        cy.visit("/");
        cy.get("#routeAbout").click();
        cy.url().should("contain", "about");
    });

    it("course catalog", () => {
        cy.visit("/");
        cy.get("#routeCourseCatalog").click();
        cy.url().should("contain", "/course-catalog");
    });
});

describe("admin", () => {
    it("login", () => {
        loginAsDefaultAdmin();
    });

    it("accounts", () => {
        //all accounts
        cy.get("#nav_desktop_admin_menu_manage_accounts").trigger("mouseover");
        cy.get("#nav_desktop_admin_menu_manage_accounts_all").click();
        cy.url().should("contain", "accounts");

        //create account
        cy.get("#nav_desktop_admin_menu_manage_accounts").trigger("mouseover");
        cy.get("#nav_desktop_admin_menu_manage_accounts_create").click();
        cy.url().should("contain", "createAccount");

        // create exam reg form
        cy.get("#nav_desktop_admin_menu_manage_accounts").trigger("mouseover");
        cy.get("#nav_desktop_admin_menu_exreg_create").click();
        cy.url().should("contain", "create-exam-reg");
    });

    it("courses", () => {
        //all courses
        cy.get("#nav_desktop_admin_menu_courses").trigger("mouseover");
        cy.get("#nav_desktop_admin_menu_courses_all").click();
        cy.url().should("contain", "all-courses");

        // create course
        cy.get("#nav_desktop_admin_menu_courses").trigger("mouseover");
        cy.get("#nav_desktop_admin_menu_courses_create").click();
        cy.url().should("contain", "createCourse");
    });

    checkProfile();
});

describe("lecturer", () => {
    it("login", () => {
        loginAsDefaultLecturer();
    });

    it("courses", () => {
        //open the menu
        cy.get("#nav_desktop_lecturer_menu_courses").trigger("mouseover");

        //all courses
        cy.get("#nav_desktop_lecturer_menu_courses_all").click();
        cy.url().should("contain", "all-courses");

        // create course
        cy.get("#nav_desktop_lecturer_menu_courses_create").click();
        cy.url().should("contain", "createCourse");

        // my courses
        cy.get("#nav_desktop_lecturer_menu_courses_my_courses").click();
        cy.url().should("contain", "course-management");
    });

    it("exams", () => {
        //open the menu
        cy.get("#nav_desktop_lecturer_menu_exams").trigger("mouseover");

        // create exam
        cy.get("#nav_desktop_lecturer_menu_exams_create").click();
        cy.url().should("contain", "create-exam");

        // my exams
        cy.get("#nav_desktop_lecturer_menu_exams_my_exams").click();
        cy.url().should("contain", "exams");
    });
    checkProfile();
});

describe("student", () => {
    it("login", () => {
        loginAsDefaultStudent();
    });

    it("courses", () => {
        //open the menu
        cy.get("#nav_desktop_student_menu_courses").trigger("mouseover");

        //all courses
        cy.get("#nav_desktop_student_menu_courses_all").click();
        cy.url().should("contain", "courses");

        //admitted courses
        cy.get("#nav_desktop_student_menu_courses_admitted").click();
        cy.url().should("contain", "/my-courses");
    });

    it("study", () => {
        //open the menu
        cy.get("#nav_desktop_student_menu_study").trigger("mouseover");

        //all courses
        cy.get("#nav_desktop_student_menu_study_immatriculation").click();
        cy.url().should("contain", "immatriculation");
    });

    it("exams", () => {
        //open the menu
        cy.get("#nav_desktop_student_menu_exams").trigger("mouseover");

        // my exams
        cy.get("#nav_desktop_student_menu_exams_my_exams").click();
        cy.url().should("contain", "exams");

        // exam results
        cy.get("#nav_desktop_student_menu_exams_results").click();
        cy.url().should("contain", "exam-results");
    });

    checkProfile();
});

//checks the profile menu and implicitly logs the current user out.
function checkProfile() {
    it("profile", () => {
        //open the menu
        cy.get("#menu_profile").trigger("mouseover");

        //profile
        cy.get("#nav_desktop_profile").click();
        cy.url().should("contain", "profile");

        //settings
        cy.get("#nav_desktop_settings").click();
        cy.url().should("contain", "settings");

        logout();
    });
}
