import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import Admin from "@/api/api_models/user_management/Admin";
import { getMachineUserAuth, loginAsDefaultAdmin, loginAsUser, logout } from "./helpers/AuthHelper";
import { createNewStudent, deleteUser, getRandomMatriculationId, createUsers, deleteUsers } from "./helpers/UserHelper";
import { navigateToPrivateProfile } from "./helpers/NavigationHelper";
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
                    usersWithAuth.push({ userInfo: student, auth: studentAuthUser });
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

    it("Login as admin", function () {
        loginAsDefaultAdmin();
    });

    it("Create student account", function () {
        createNewStudent(student, studentAuth);
    });

    it("Pick picture as admin", function () {
        cy.visit(`/editAccount/${student.username}`);
        cy.fixture("pictures/darth_vader.jpg")
            .as("vader_pic")
            .get("button[id=uploadPicture]")
            .click()
            .then(function (el: any) {
                return Cypress.Blob.base64StringToBlob(this.vader_pic, "darth_vader.jpg").then((blob: any) => {
                    el[0].files[0] = blob;
                    el[0].dispatchEvent(new Event("change", { bubbles: true }));
                });
            });
    });

    it("Picture change detected", function () {
        cy.get("button[id='cancel']").click();
        cy.wait(100);
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Do you really want to continue and leave this page? You have unsaved changes.");

        cy.get("button[id='unsavedChangesModalCancel']").click();
        cy.wait(100);
    });

    it("Save Changes works", function () {
        cy.get("button[id=saveChanges]").click();
        cy.url().should("not.contain", student.username);
        cy.visit(`/editAccount/${student.username}`);
        //TODO check if given picture is the uploaded picture
    });

    it("Resetting the picture works for admins", function () {
        cy.fixture("pictures/luke.jpg")
            .as("luke_pic")
            .get("button[id=uploadPicture]")
            .click()
            .then(function (el: any) {
                return Cypress.Blob.base64StringToBlob(this.luke_pic, "luke.jpg").then((blob: any) => {
                    el[0].files[0] = blob;
                    el[0].dispatchEvent(new Event("change", { bubbles: true }));
                });
            });
        cy.get("button[id=resetPicture]").click();
        cy.get("button[id=resetPicture]").should("not.exist");
        //TODO check if darth_vader picture is shown
    });

    it("Logout", function () {
        logout();
    });

    it("Login as student", function () {
        loginAsUser(studentAuthUser);
    });

    it("Profile Picture shown corretly", function () {
        navigateToPrivateProfile();
        cy.get("button[id=uploadPicture]").should("exist");
        //TODO compare img content to darth_vader
    });

    it("Resetting the picture works for students", function () {
        cy.fixture("pictures/luke.jpg")
            .as("luke_pic")
            .get("button[id=uploadPicture]")
            .click()
            .then(function (el: any) {
                return Cypress.Blob.base64StringToBlob(this.luke_pic, "luke.jpg").then((blob: any) => {
                    el[0].files[0] = blob;
                    el[0].dispatchEvent(new Event("change", { bubbles: true }));
                });
            });
        cy.get("button[id=resetPicture]").click();
        cy.get("button[id=resetPicture]").should("not.exist");
        //TODO check if darth_vader picture is shown
    });

    it("Change the profile picture", function () {
        cy.fixture("pictures/luke.jpg")
            .as("luke_pic")
            .get("button[id=uploadPicture]")
            .click()
            .then(function (el: any) {
                return Cypress.Blob.base64StringToBlob(this.luke_pic, "luke.jpg").then((blob: any) => {
                    el[0].files[0] = blob;
                    el[0].dispatchEvent(new Event("change", { bubbles: true }));
                });
            });
        cy.get("button[id=confirmPicture]").click();
        cy.wait(5000);
        cy.get("button[id=resetPicture]").should("not.exist");
        cy.get("button[id=confirmPicture]").should("not.exist");
        //TODO check if shown picture is luke
    });

    it("Logout", function () {
        logout();
    });

    it("Delete student", function () {
        loginAsDefaultAdmin();
        deleteUser(student);
    });
});