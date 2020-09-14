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
    cy.wait(1000);
}

export function logout() {
    cy.get("div[id='menu_profile']").children().eq(1).should("not.be.visible");
    cy.get("div[id='menu_profile']").trigger("mouseover");
    cy.get("div[id='menu_profile']").children().eq(1).get("span").contains("Sign out").should("be.visible");
    cy.get("div[id='menu_profile']").children().eq(1).get("a").contains("Sign out").click();
    cy.url().should("contain", "/");
}
