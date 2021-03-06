import Admin from "@/api/api_models/user_management/Admin";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { getMachineUserAuth, loginAsDefaultAdmin, loginAsUser, logout } from "./helpers/AuthHelper";
import { getRandomMatriculationId, createUsers, deleteUsers, getRandomizedGovernmentId } from "./helpers/UserHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";

const random = Math.floor(Math.random() * 9999);
let admin: Admin;
let student: Student;
let studentAuthUser: Account;
let adminAuth: Account;
let studentAuth: Account;
let usersWithAuth: UserWithAuth[] = [];

let vaderPic: any;
let lukePic: any;
let vaderPicCropped: any;
let lukePicCropped: any;

describe("Account creation, edition and deletion", function () {
    before(function () {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });

        cy.fixture("pictures/darth_vader.jpg").then((vader) => {
            vaderPic = "data:image/jpeg;base64," + vader;
        });

        cy.fixture("pictures/luke.jpg").then((luke) => {
            lukePic = "data:image/jpeg;base64," + luke;
        });

        cy.fixture("pictures/vaderCropped.jpg").then((vaderCropped) => {
            vaderPicCropped = "data:image/jpeg;base64," + vaderCropped;
        });

        cy.fixture("pictures/lukeCropped.jpg").then((lukeCropped) => {
            lukePicCropped = "data:image/jpeg;base64," + lukeCropped;
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

    it("Login as admin", function () {
        loginAsDefaultAdmin();
    });

    it("Pick picture as admin", function () {
        cy.visit(`/editAccount/${student.username}`);
        cy.wait(3000);
        cy.get("#profilePicture").click();
        cy.get("input[id='uploadFile']").attachFile("pictures/darth_vader.jpg", { force: true });
    });

    it("Check if updated picture is shown", function () {
        cy.get("img[id='picture']").should("have.attr", "src", vaderPic);
    });

    it("Updating picture works", function () {
        cy.reload();
        cy.get("img[id='picture']", { timeout: 10000 }).should("have.attr", "src", vaderPicCropped);
    });

    it("Deleting picture works", function () {
        cy.get("#profilePicture").click();
        cy.get("#deletePicture").click();
        cy.get("#deleteProfilePictureModalDelete").click();
        cy.get("img[id='picture']").should("not.have.attr", "src", vaderPic);
        cy.reload();
        cy.wait(500);
        cy.get("img[id='picture']").should("not.have.attr", "src", vaderPic);
        // ReUpload image
        cy.get("input[id='uploadFile']").attachFile("pictures/darth_vader.jpg", { force: true });
    });

    it("Logout as Admin", function () {
        logout();
    });

    it("Login as student and navigate to private profile", function () {
        loginAsUser(studentAuthUser);
        cy.visit("/profile");
        cy.wait(2500);
    });

    it("Correct profile picture shown", function () {
        cy.get("img[id='picture']").should("have.attr", "src", vaderPicCropped);
    });

    it("Delete profile picture modal is shown", function () {
        cy.get("#profilePicture").click();
        cy.get("#deletePicture").click();
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete the profile picture?");

        cy.get("button[id='deleteProfilePictureModalCancel']").click();
        cy.wait(100);
    });

    it("Deleting profile picture works", function () {
        cy.get("#profilePicture").click();
        cy.get("#deletePicture").click();
        cy.get("button[id='deleteProfilePictureModalDelete']").click();
        cy.wait(1000);
        cy.get("img[id='picture']").should("not.have.attr", "src", lukePic);
        cy.get("img[id='picture']").should("not.have.attr", "src", vaderPic);
    });

    it("Changing picture works for students", function () {
        cy.get("input[id='uploadFile']").attachFile("pictures/luke.jpg", { force: true });
        cy.wait(1000);
        cy.get("img[id='picture']").should("have.attr", "src", lukePic);
    });

    it("Logout as students", function () {
        logout();
    });

    it("Login as admin and open student's account page", function () {
        loginAsDefaultAdmin();
        cy.visit(`/editAccount/${student.username}`);
        cy.wait(2500);
    });

    it("Correct profile picture is shown", function () {
        cy.get("img[id='picture']").should("have.attr", "src", lukePicCropped);
    });

    it("Delete profile picture modal is shown", function () {
        cy.get("#profilePicture").click();
        cy.get("#deletePicture").click();
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete the profile picture?");

        cy.get("button[id='deleteProfilePictureModalCancel']").click();
        cy.wait(100);
    });

    it("Deleting profile picture works", function () {
        cy.get("#profilePicture").click();
        cy.get("#deletePicture").click();
        cy.get("button[id='deleteProfilePictureModalDelete']").click();
        cy.wait(1000);
        cy.get("img[id='picture']").should("not.have.attr", "src", lukePic);
        cy.get("img[id='picture']").should("not.have.attr", "src", vaderPic);
    });
});
