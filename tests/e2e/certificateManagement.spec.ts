import Admin from "@/api/api_models/user_management/Admin";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { getMachineUserAuth, loginAsUser, logout } from "./helpers/AuthHelper";
import { navigateToSettingsPage } from "./helpers/NavigationHelper";
import { createUsers, deleteUsers, getRandomMatriculationId } from "./helpers/UserHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";

describe("Certificate Management", function () {
    const random = Math.floor(Math.random() * 9999);
    let admin: Admin;
    let student: Student;
    let studentAuthUser: Account;
    let adminAuth: Account;

    let usersWithAuth: UserWithAuth[] = [];

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
                    student.birthDate = "2012-01-01";
                });
            })
            .then(() => {
                cy.fixture("studentAuthUser.json").then((s) => {
                    (s as Account).username += random;
                    studentAuthUser = s as Account;
                    usersWithAuth.push({ userInfo: student, auth: studentAuthUser });
                });
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

    it("Login and navigate to settings page as student", function () {
        cy.wait(1500);
        loginAsUser(studentAuthUser);
        navigateToSettingsPage();
        cy.wait(100);
    });

    it("Show encryption modal", function () {
        cy.get("button[id='createCertificate']").click();
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
});
