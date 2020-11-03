import { paths } from "@/use/router/paths";

export function navigateToAccountList() {
    cy.visit(paths.ACCOUNT_LIST);
}

export function navigateToCourseListAdmin() {
    cy.visit(paths.ALL_COURSES);
}

export function navigateToAccountForm() {
    cy.visit(paths.CREATE_ACCOUNT);
}

export function navigateToCourseListLecturer() {
    cy.visit(paths.ALL_COURSES);
}

export function navigateToMyCoursesLecturer() {
    cy.visit(paths.LECTURER_MY_COURSES);
}

export function navigateToCourseListStudent() {
    cy.visit(paths.STUDENT_COURSES);
}

export function navigateToCourseForm() {
    cy.visit(paths.CREATE_COURSE);
}

export function navigateToCourseFormAdmin() {
    cy.visit(paths.CREATE_COURSE);
}

export function navigateToSettingsPage() {
    cy.visit(paths.SETTINGS);
}

export function navigateToPrivateProfile() {
    cy.visit(paths.PRIVATE_PROFILE);
}

export function navigateToAboutPage() {
    cy.visit(paths.ABOUT_PAGE);
}
