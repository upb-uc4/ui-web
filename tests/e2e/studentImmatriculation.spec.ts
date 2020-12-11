import Admin from "@/api/api_models/user_management/Admin";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { getMachineUserAuth, loginAsUser, logout } from "./helpers/AuthHelper";
import { navigateToImmatriculationPage } from "./helpers/NavigationHelper";
import { createUsers, deleteUsers, getRandomizedGovernmentId, getRandomMatriculationId } from "./helpers/UserHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";

const random = Math.floor(Math.random() * 9999);
let admin: Admin;
let student: Student;
let studentAuthUser: Account;
let adminAuth: Account;
let studentAuth: Account;
let usersWithAuth: UserWithAuth[] = [];

let fieldOfStudy = [
    { semesterType: "SS", year: "2020", fos: ["Bachelor Computer Science v3", "Bachelor Computer Science v4"] },
    { semesterType: "WS", year: "2019/20", fos: ["Bachelor Computer Science v3"] },
];

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
        navigateToImmatriculationPage();
        //Timeout needed for waiting for the data
        cy.wait(20000);
    });

    it("Add two fields of studies for one summer semester", function () {
        cy.get("select[id=semesterType]").select(fieldOfStudy[0].semesterType);
        cy.get("select[id=semesterYear]").select(fieldOfStudy[0].year);
        cy.get("select[id=fieldsOfStudy-1]").select(fieldOfStudy[0].fos[0]);
        cy.get("select[id=fieldsOfStudy-2]").select(fieldOfStudy[0].fos[1]);
        cy.get("button[id=addImmatriculationData]").click();
        cy.wait(5000);
    });

    it("Encryption modal should be shown", () => {
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains(
            "Please choose a password to encrypt your private key, so it can be securely stored on our servers. Ensure that you do not lose this password as it cannot be restored."
        );
    });

    //TODO Comment in when bug is resolved
    // it("Canceling the modal does not result in error", () => {
    //     cy.get("button[id='encryptPrivateKeyModalCancel']").click();
    //     cy.get("button[id='encryptPrivateKeyModalCancel']").should("not.be.visible");
    //     cy.get("button[id='addImmatriculationData']").click();
    // });

    it("Enter encryption password to proceed", () => {
        const encryptionPassword = studentAuthUser.password;
        cy.get("input[id='enterEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("input[id='confirmEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("button[id='encryptPrivateKeyModalConfirm']").click();
        // wait for certificate to be created and the immatriculation data to be written
        cy.wait(40000);
    });

    //TODO What happens if we cancel here?
    it("Decryption modal shown", () => {
        cy.get("input[id='enterDecryptionPassword']").type(studentAuthUser.password);
        cy.get("button[id='decryptPrivateKeyModalConfirm']").click();
    });

    it("Correct immatriculation entries are shown", () => {
        cy.get("div").contains("Immatriculation History");
        cy.get("div").should("contain", fieldOfStudy[0].year).and("contain", fieldOfStudy[0].fos[0]).and("contain", fieldOfStudy[0].fos[1]);
    });

    it("Add a field of study for one winter semester", function () {
        cy.get("select[id=semesterType]").select(fieldOfStudy[1].semesterType);
        cy.get("select[id=semesterYear]").select(fieldOfStudy[1].year);
        cy.get("select[id=fieldsOfStudy-1]").select(fieldOfStudy[1].fos[0]);
        cy.get("button[id=addImmatriculationData]").click();
        cy.wait(40000);
    });

    it("Correct immatriculation entries are shown", () => {
        //No modal should be shown
        cy.get("div").should("contain", fieldOfStudy[1].year).and("contain", fieldOfStudy[1].fos[0]);
    });
});
