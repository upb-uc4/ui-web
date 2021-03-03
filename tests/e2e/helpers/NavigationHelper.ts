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

export function navigateToImmatriculationPage() {
    cy.visit("immatriculation");
}

export function navigateToAdmittedCourses() {
    cy.visit("courses/my-courses");
}
export function navigateToWelcomePage() {
    cy.visit("welcome");
}
export function navigateToAllOperationsPage() {
    cy.visit("operations-all");
}
export function navigateToExamList() {
    cy.visit("exams");
}
export function navigateToExamForm() {
    cy.visit("create-exam");
}
export function navigateToExamView(examId: string) {
    cy.visit(`exam/${examId}`);
}
