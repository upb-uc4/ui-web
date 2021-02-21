import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { getMachineUserAuth, loginAsUser, logout } from "./helpers/AuthHelper";
import { navigateToSettingsPage } from "./helpers/NavigationHelper";
import { createUsers, deleteUsers, getRandomizedGovernmentId, getRandomMatriculationId } from "./helpers/UserHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";

describe("Change password", () => {
    const random = Math.floor(Math.random() * 9999);
    let student: Student;
    let studentAuthUser: Account;
    let adminAuth: Account;

    let usersWithAuth: UserWithAuth[] = [];

    before(() => {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });

        cy.fixture("student.json")
            .then((s) => {
                (s as Student).username += random;
                student = s as Student;
                student.matriculationId = getRandomMatriculationId();
            })
            .then(() => {
                cy.fixture("studentAuthUser.json").then((s) => {
                    (s as Account).username += random;
                    studentAuthUser = s as Account;
                    let governmentId = getRandomizedGovernmentId();
                    usersWithAuth.push({ governmentId, userInfo: student, auth: studentAuthUser });
                });
            })
            .then(() => {
                cy.fixture("logins/admin.json").then((admin) => {
                    adminAuth = admin;
                });
            })
            .then(async () => {
                await getMachineUserAuth(adminAuth);
            })
            .then(async () => {
                await createUsers(usersWithAuth);
            })
            .then(() => {
                console.log("Setup finished");
            });
    });

    after(() => {
        deleteUsers([studentAuthUser], adminAuth);
        logout();
    });

    it("Login with new student account", () => {
        loginAsUser(studentAuthUser);
    });

    it("Navigate to settings page", () => {
        navigateToSettingsPage();
    });

    it("Enter wrong password should show error", () => {
        cy.get("input[id='oldPassword']").type(studentAuthUser.password + "wrong!");
        cy.get("input[id='newPassword']").type("password-a");
        cy.get("input[id='confirmationPassword']").type("password-a");
        cy.get("button[id='updatePassword']").click();

        cy.get("label").should("have.class", "input-label-error").should("exist");
    });

    it("Enter correct password", () => {
        cy.get("input[id='oldPassword']").clear().type(studentAuthUser.password);
    });

    it("Password fields should be password fields", () => {
        cy.get("input[id='newPassword']").invoke("attr", "type").should("equal", "password");
        cy.get("input[id='confirmationPassword']").invoke("attr", "type").should("equal", "password");
    });

    it("Converting password fields to text fields works", () => {
        cy.get("i[id='toggleNewPassword']").click();

        cy.get("input[id='newPassword']").invoke("attr", "type").should("equal", "text");
        cy.get("input[id='confirmationPassword']").invoke("attr", "type").should("equal", "text");

        cy.get("i[id='toggleConfirmationPassword']").click();

        cy.get("input[id='newPassword']").invoke("attr", "type").should("equal", "password");
        cy.get("input[id='confirmationPassword']").invoke("attr", "type").should("equal", "password");
    });

    it("Entering different passwords should block button", () => {
        cy.get("input[id='newPassword']").type("password-a");
        cy.get("input[id='confirmationPassword']").type("password-b");

        cy.get("button[id='updatePassword']").click();
        cy.get("label").should("have.class", "input-label-error").should("exist");
    });

    it("Entering the same password should be valid", () => {
        studentAuthUser.password += "-new";
        cy.get("input[id='newPassword']").clear().type(studentAuthUser.password);
        cy.get("input[id='confirmationPassword']").clear().type(studentAuthUser.password);
        cy.get("button[id='updatePassword']").click();
    });

    it("Login with new password", () => {
        logout();
        loginAsUser(studentAuthUser);
    });
});
