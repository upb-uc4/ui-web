import Admin from "@/api/api_models/user_management/Admin";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { getMachineUserAuth, loginAsUser, logout } from "./helpers/AuthHelper";
import { navigateToSettingsPage } from "./helpers/NavigationHelper";
import { createUsers, deleteUsers, getRandomizedGovernmentId, getRandomMatriculationId } from "./helpers/UserHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";

const random = Math.floor(Math.random() * 9999);
let admin: Admin;
let student: Student;
let studentAuthUser: Account;
let adminAuth: Account;
let studentAuth: Account;
let usersWithAuth: UserWithAuth[] = [];

describe("Account creation, edition and deletion", function () {
    before(function () {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });

        cy.fixture("admin.json").then((a) => {
            (a as Admin).username += random;
            admin = a as Admin;
        });
        cy.fixture("logins/admin.json")
            .then((admin) => {
                adminAuth = admin;
            })
            .then(async () => {
                await getMachineUserAuth(adminAuth);
            })
            .then(() => {
                cy.fixture("student.json").then((s) => {
                    (s as Student).username += random;
                    student = s as Student;
                    student.matriculationId = getRandomMatriculationId();
                });
            })
            .then(() => {
                cy.fixture("studentAuthUser.json").then((s) => {
                    (s as Account).username += random;
                    studentAuthUser = s as Account;
                    let governmentId = getRandomizedGovernmentId();
                    usersWithAuth.push({ governmentId, userInfo: student, auth: studentAuthUser });
                });
            })
            .then(async () => {
                await createUsers(usersWithAuth);
            })
            .then(() => {
                console.log("Setup finished");
            });

        cy.fixture("logins/student.json").then((student) => {
            studentAuth = student;
        });
    });

    after(() => {
        deleteUsers([studentAuthUser], adminAuth);
        logout();
    });

    it("Login as student", () => {
        loginAsUser(studentAuthUser);
    });

    it("Navigate to settings page", () => {
        navigateToSettingsPage();
    });

    it("Show account deletion modal", () => {
        cy.get("#modal-wrapper").should("exist");

        // open
        cy.get("button[id='showAccountDeletionModal'").click();
        cy.get("button[id='deleteOwnAccountModalCancel']").should("be.visible");
        cy.get("button[id='deleteOwnAccountModalConfirm']").should("be.visible").and("be.disabled");

        // close with cancel button
        cy.get("button[id='deleteOwnAccountModalCancel']").click();

        // open
        cy.get("button[id='showAccountDeletionModal'").click();
    });

    it("Entering wrong password results in error", () => {
        cy.get("input[id='enterPasswordForAccountDeletion']").type("wrong-password");
        cy.get("button[id='deleteOwnAccountModalConfirm']").click();
        cy.wait(500);
        cy.get("p").contains("Please enter the correct password.").should("exist");
        cy.get("input[id='enterPasswordForAccountDeletion']").should("have.class", "error");
    });

    it("Entering correct password works", () => {
        cy.get("input[id='enterPasswordForAccountDeletion']").clear().type(studentAuthUser.password);
        cy.get("button[id='deleteOwnAccountModalConfirm']").click();
        cy.wait(5000);
        cy.url().should("contain", "/login");
    });

    it("Cannot login with deleted account", () => {
        cy.get("input[id='email']").type(studentAuthUser.username);
        cy.get("input[id='password']").type(studentAuthUser.password);
        cy.get('button[id="login"]').click();
        cy.get("input[id='email']").should("have.class", "error");
    });
});
