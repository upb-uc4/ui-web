import { Account } from "@/entities/Account";
import { paths } from "@/use/router/paths";
import MachineUserAuthenticationManagement from "tests/helper/MachineUserAuthenticationManagement";

export async function getMachineUserAuth(userAuth: Account) {
    MachineUserAuthenticationManagement.setVueEnvVariable(Cypress.env("NODE_ENV"));
    await MachineUserAuthenticationManagement._getRefreshToken(userAuth);
}

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
    cy.visit(paths.HOME);
    cy.get("input[id='email']").type(user.username);
    cy.get("input[id='password']").type(user.password);
    cy.get('button[id="login"]').click();
    cy.url().should("eq", Cypress.config().baseUrl + "welcome");
    cy.wait(1000);
}

export function logout() {
    cy.get("div[id='menu_profile']").children().eq(1).should("not.be.visible");
    cy.get("div[id='menu_profile']").trigger("mouseover");
    cy.get("div[id='menu_profile']").children().eq(1).get("span").contains("Sign out").should("be.visible");
    cy.get("#nav_desktop_logout").click();
    cy.url().should("eq", Cypress.config().baseUrl);
}

export function logoutMobile() {
    cy.get("button[id='nav_mobile_toggle_menu']").click();
    cy.get("nav").should("be.visible");
    cy.get("div[id='nav_mobile_menu_profile mobile-navbar-menu']").click();
    cy.get("#nav_mobile_logout").click();
    cy.url().should("eq", Cypress.config().baseUrl);
}
