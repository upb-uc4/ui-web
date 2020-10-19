import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { getRandomMatriculationId, deleteUsers, createUsers, getRandomizedGovernmentId } from "./helpers/UserHelper";
import { getMachineUserAuth, loginAsUser, logout } from "./helpers/AuthHelper";
import { navigateToSettingsPage } from "./helpers/NavigationHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";
import { Role } from "@/entities/Role";

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

    it("Open password change modal", () => {
        cy.get("#modal-wrapper").should("exist");
        cy.get("div[id='modal-wrapper']").children().should("not.be.visible");

        // open
        cy.get("button[id='updatePassword'").click();
        cy.get("div[id='modal-wrapper']").children().eq(0).should("be.visible");

        // close with cancel button
        cy.get("button[id='enterPasswordModalCancel']").click();
        cy.get("div[id='modal-wrapper']").children().should("not.be.visible");

        // open
        cy.get("button[id='updatePassword'").click();
        cy.get("div[id='modal-wrapper']").children().eq(0).should("be.visible");
    });

    it("Enter wrong password should show error", () => {
        cy.get("input[id='enterPasswordModalPassword']").type(studentAuthUser.password + "wrong!");
        cy.get("button[id='enterPasswordModalConfirm']").click();

        cy.get("p").should("have.class", "error-message").should("exist");
    });

    it("Enter correct password", () => {
        cy.get("input[id='enterPasswordModalPassword']").clear().type(studentAuthUser.password);
        cy.get("button[id='enterPasswordModalConfirm']").click();

        cy.get("p").invoke("hasClass", "error-message").should("not.be.visible");
        cy.get("div[id='modal-wrapper']").children().should("not.be.visible");
    });

    it("Password fields should be password fields", () => {
        cy.get("input[id='newPassword']").invoke("attr", "type").should("equal", "password");
        cy.get("input[id='confirmationPassword']").invoke("attr", "type").should("equal", "password");
    });

    it("Converting password fields to text fields works", () => {
        cy.get("button[id='toggleNewPassword']").click();

        cy.get("input[id='newPassword']").invoke("attr", "type").should("equal", "text");
        cy.get("input[id='confirmationPassword']").invoke("attr", "type").should("equal", "text");

        cy.get("button[id='toggleConfirmationPassword']").click();

        cy.get("input[id='newPassword']").invoke("attr", "type").should("equal", "password");
        cy.get("input[id='confirmationPassword']").invoke("attr", "type").should("equal", "password");
    });

    it("Entering different passwords should block button", () => {
        cy.get("button[id='changePassword']").should("be.disabled");
        cy.get("input[id='newPassword']").type("password-a");
        cy.get("input[id='confirmationPassword']").type("password-b");
        cy.get("button[id='changePassword']").should("be.disabled");
    });

    it("Entering the same password should be valid", () => {
        cy.get("button[id='changePassword']").should("be.disabled");
        studentAuthUser.password += "-new";
        cy.get("input[id='newPassword']").clear().type(studentAuthUser.password);
        cy.get("input[id='confirmationPassword']").clear().type(studentAuthUser.password);
        cy.get("button[id='changePassword']").should("not.be.disabled");
        cy.get("button[id='changePassword']").click();
    });

    it("Password change should hide inputs", () => {
        cy.get("input[id='newPassword']").should("not.exist");
        cy.get("input[id='confirmationPassword']").should("not.exist");
        cy.get("button[id='changePassword']").should("not.exist");
        cy.wait(300);
    });

    it("Login with new password", () => {
        logout();
        loginAsUser(studentAuthUser);
    });
});
