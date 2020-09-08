export function navigateToAccountList() {
    const navbar_admin_menu_manage_accounts = "div[id='nav_desktop_admin_menu_manage_accounts']";
    cy.get(navbar_admin_menu_manage_accounts).children().eq(1).should("not.be.visible");
    cy.get(navbar_admin_menu_manage_accounts).trigger("mouseover");
    cy.get(navbar_admin_menu_manage_accounts).children().eq(1).get("span").contains("All Users").should("be.visible");
    cy.get(navbar_admin_menu_manage_accounts).children().eq(1).get("a").contains("All Users").click();
    cy.get(navbar_admin_menu_manage_accounts).trigger("mouseleave");
}

export function navigateToCourseListAdmin() {
    const navbar_admin_menu_course = "div[id='nav_desktop_admin_menu_course']";
    cy.get(navbar_admin_menu_course).children().eq(1).should("not.be.visible");
    cy.get(navbar_admin_menu_course).trigger("mouseover");
    cy.get(navbar_admin_menu_course).children().eq(1).get("span").contains("All Courses").should("be.visible");
    cy.get(navbar_admin_menu_course).children().eq(1).get("a").contains("All Courses").click();
    cy.get(navbar_admin_menu_course).trigger("mouseleave");
    cy.url().should("contain", "/all-courses");
}

export function navigateToAccountForm() {
    const navbar_admin_menu_manage_accounts = "div[id='nav_desktop_admin_menu_manage_accounts']";
    cy.get(navbar_admin_menu_manage_accounts).children().eq(1).should("not.be.visible");
    cy.get(navbar_admin_menu_manage_accounts).trigger("mouseover");
    cy.get(navbar_admin_menu_manage_accounts).children().eq(1).get("span").contains("New Account").should("be.visible");
    cy.get(navbar_admin_menu_manage_accounts).children().eq(1).get("a").contains("New Account").click();
    cy.get(navbar_admin_menu_manage_accounts).trigger("mouseleave");
    cy.url().should("contain", "/createAccount");
}

export function navigateToCourseListLecturer() {
    const navbar_lecturer_menu_courses = "div[id='nav_desktop_lecturer_menu_courses']";
    cy.get(navbar_lecturer_menu_courses).children().eq(1).should("not.be.visible");
    cy.get(navbar_lecturer_menu_courses).parents().eq(1).trigger("mouseover");
    cy.get(navbar_lecturer_menu_courses).children().eq(1).get("span").contains("All Courses").should("be.visible");
    cy.get(navbar_lecturer_menu_courses).children().eq(1).get("a").contains("All Courses").click();
    cy.get(navbar_lecturer_menu_courses).trigger("mouseleave");
    cy.url().should("contain", "all-courses");
}

export function navigateToMyCoursesLecturer() {
    const navbar_lecturer_menu_courses = "div[id='nav_desktop_lecturer_menu_courses']";
    cy.get(navbar_lecturer_menu_courses).children().eq(1).should("not.be.visible");
    cy.get(navbar_lecturer_menu_courses).parents().eq(1).trigger("mouseover");
    cy.get(navbar_lecturer_menu_courses).children().eq(1).get("span").contains("My Courses").should("be.visible");
    cy.get(navbar_lecturer_menu_courses).children().eq(1).get("a").contains("My Courses").click();
    cy.get(navbar_lecturer_menu_courses).trigger("mouseleave");
    cy.url().should("contain", "course-management");
}

export function navigateToCourseListStudent() {
    const navbar_student_menu_courses = "div[id='nav_desktop_student_menu_courses']";
    cy.get(navbar_student_menu_courses).children().eq(1).should("not.be.visible");
    cy.get(navbar_student_menu_courses).parents().eq(1).trigger("mouseover");
    cy.get(navbar_student_menu_courses).children().eq(1).get("span").contains("All Courses").should("be.visible");
    cy.get(navbar_student_menu_courses).children().eq(1).get("a").contains("All Courses").click();
    cy.get(navbar_student_menu_courses).trigger("mouseleave");
    cy.url().should("contain", "courses");
}

export function navigateToCourseForm() {
    const nav_desktop_lecturer_menu_courses = "div[id='nav_desktop_lecturer_menu_courses']";
    cy.get(nav_desktop_lecturer_menu_courses).children().eq(1).should("not.be.visible");
    cy.get(nav_desktop_lecturer_menu_courses).parents().eq(0).trigger("mouseover");
    cy.get(nav_desktop_lecturer_menu_courses).children().eq(0).get("a").contains("Create Course").click();
    cy.get(nav_desktop_lecturer_menu_courses).trigger("mouseleave");
    cy.url().should("contain", "createCourse");
}

export function navigateToCourseFormAdmin() {
    const nav_desktop_lecturer_menu_courses = "div[id='nav_desktop_admin_menu_course']";
    cy.get(nav_desktop_lecturer_menu_courses).children().eq(1).should("not.be.visible");
    cy.get(nav_desktop_lecturer_menu_courses).parents().eq(0).trigger("mouseover");
    cy.get(nav_desktop_lecturer_menu_courses).children().eq(0).get("a").contains("Create Course").click();
    cy.get(nav_desktop_lecturer_menu_courses).trigger("mouseleave");
    cy.url().should("contain", "createCourse");
}

export function navigateToSettingsPage() {
    cy.get("div[id='menu_profile']").children().eq(1).should("not.be.visible");
    cy.get("div[id='menu_profile']").trigger("mouseover");
    cy.get("div[id='menu_profile']").children().eq(1).get("span").contains("Settings").should("be.visible");
    cy.get("div[id='menu_profile']").children().eq(1).get("a").contains("Settings").click();
    cy.get("div[id='menu_profile']").trigger("mouseleave");
    cy.url().should("contain", "/settings");
}

export function navigateToPrivateProfile() {
    cy.get("div[id='menu_profile']").children().eq(1).should("not.be.visible");
    cy.get("div[id='menu_profile']").trigger("mouseover");
    cy.get("div[id='menu_profile']").children().eq(1).get("span").contains("Profile").should("be.visible");
    cy.get("div[id='menu_profile']").children().eq(1).get("a").contains("Profile").click();
    cy.get("div[id='menu_profile']").trigger("mouseleave");
    cy.url().should("contain", "/profile");
}

export function navigateToAboutPage() {
    cy.get("#routeAbout").click();
    cy.url().should("contain", "/about");
}
