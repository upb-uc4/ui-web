import { Account } from "@/entities/Account";

export function loginAsDefaultAdmin() {
    cy.fixture("logins/admin.json").then((a) => {
        const admin = a as Account;
        loginAsUser(admin);
    });
}

export function loginAsDefaultStudent() {
    cy.fixture("logins/student.json").then((a) => {
        const student = a as Account;
        loginAsUser(student);
    });
}

export function loginAsDefaultLecturer() {
    cy.fixture("logins/lecturer.json").then((a) => {
        const lecturer = a as Account;
        loginAsUser(lecturer);
    });
}

export function loginAsUser(user: Account) {
    cy.visit("/");
    cy.get("input[id='email']").type(user.username);
    cy.get("input[id='password']").type(user.password);
    cy.get('button[id="login"]').click();
    cy.url().should("contain", "welcome");
}
