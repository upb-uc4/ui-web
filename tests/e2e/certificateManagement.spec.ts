import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { loginAsUser, logout } from "./helpers/AuthHelper";
import { navigateToSettingsPage } from "./helpers/NavigationHelper";
import { getRandomMatriculationId, loginAndCreateStudent, loginAndDeleteUser } from "./helpers/UserHelper";

describe("Certificate Management", function () {
    const random = Math.floor(Math.random() * 9999);
    let student: Student;
    let studentAuthUser: Account;
    let adminAuth: Account;

    before(() => {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });

        cy.fixture("student.json").then((s) => {
            (s as Student).username += random;
            student = s as Student;
            student.matriculationId = getRandomMatriculationId();
        });

        cy.fixture("studentAuthUser.json").then((s) => {
            (s as Account).username += random;
            studentAuthUser = s as Account;
        });

        cy.fixture("logins/admin.json").then((admin) => {
            adminAuth = admin;
        });
    });

    after(() => {
        loginAndDeleteUser(student, adminAuth);
        logout();
    });

    it("Create student", () => {
        loginAndCreateStudent(student, studentAuthUser, adminAuth);
        logout();
    });

    it("Navigate to Settings Page", function () {
        cy.wait(1500);
        loginAsUser(studentAuthUser);
        navigateToSettingsPage();
        cy.wait(100);
    });

    it("Show encryption modal", function () {
        cy.get("buttone[id='createButton']").click();
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains(
            "Please choose a password to encrypt your private key, so it can be securely stored on our servers. Ensure that you do not lose this password as it cannot be restored."
        );
    });

    it("Enter password and confirm", function () {
        const encryptionPassword = studentAuthUser.password;
        cy.get("input[id='enterEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("input[id='confirmEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("button[id='encryptPrivateKeyModalConfirm']").click();
        cy.wait(8000);
    });

    it("Certificate is shown", function () {
        cy.get("button[id='createCertificate']").should("not.exist");
        cy.get("textarea[id='certificate']").should("exist");
        cy.get("textarea[id='certificate']").should("not.have.value", "");
        cy.get("textarea[id='certificate']").should("not.have.value", "undefined");
    });

    it("Logout", function () {
        logout();
    });
});
