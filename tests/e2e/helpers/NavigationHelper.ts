export function navigateToAccountList() {
    cy.visit("accounts");
}

export function navigateToCourseListAdmin() {
    cy.visit("all-courses");
}

export function navigateToExamRegForm() {
    cy.visit("create-exam-reg");
}

export function navigateToAccountForm() {
    cy.visit("createAccount");
}

export function navigateToCourseListLecturer() {
    cy.visit("all-courses");
}

export function navigateToMyCoursesLecturer() {
    cy.visit("course-management");
}

export function navigateToCourseListStudent() {
    cy.visit("courses");
}

export function navigateToCourseForm() {
    cy.visit("createCourse");
}

export function navigateToCourseFormAdmin() {
    cy.visit("createCourse");
}

export function navigateToSettingsPage() {
    cy.visit("settings");
}

export function navigateToPrivateProfile() {
    cy.visit("profile");
}

export function navigateToAboutPage() {
    cy.visit("about");
}
