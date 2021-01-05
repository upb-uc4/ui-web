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
            .then((ad) => {
                adminAuth = ad;
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

        cy.fixture("logins/student.json").then((st) => {
            studentAuth = st;
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

    it("Request data", () => {
        cy.get("button[id='requestData']").click();
        cy.get("input[id='timestamp']").should("not.have.value", "");
        //wait for data
        cy.wait(80000);
    });

    it("Refresh to obtain the data", () => {
        cy.get("button[id='refreshData']").click();
        cy.get("button[id='downloadData']").should("exist");
    });

    it("Download data", () => {
        cy.get("a[id='downloadData']");
    });

    it("Delete the data", () => {
        cy.get("div[id='deleteData']").click();
        cy.get("input[id='timestamp']").should("not.exist");
        cy.get("a[id='downloadData']").should("not.exist");
        cy.get("button[id='requestData']").should("exist");
    });
});
