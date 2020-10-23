import Admin from "@/api/api_models/user_management/Admin";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { getMachineUserAuth, loginAsDefaultAdmin, loginAsUser, logout } from "./helpers/AuthHelper";
import { navigateToPrivateProfile } from "./helpers/NavigationHelper";
import { getRandomMatriculationId, createUsers, deleteUsers } from "./helpers/UserHelper";
import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";
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
                    student.birthDate = "2011-01-01";
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

    it("Accountlist shows 'Not Immatriculated'", function () {
        cy.visit("/accounts");
        cy.get(`div[id=user_${student.username}`).should("contain", "Not Immatriculated");
    });

    it("Check matriculation history is empty in account form", function () {
        cy.visit(`editAccount/${student.username}`);
        cy.get("div").contains("There is no matriculation data, yet!").should("exist");
        logout();
    });

    it("Check matriculation history is empty in student's profile", function () {
        loginAsUser(studentAuthUser);
        navigateToPrivateProfile();
        cy.get("div").contains("Latest Immatriculation").should("not.exist");
        logout();
    });

    it("Valid FoS selection can be resetted ", function () {
        loginAsDefaultAdmin();
        cy.visit(`editAccount/${student.username}`);
        cy.get("button[id='removeFieldOfStudy-1']").should("not.exist");
        cy.get("select[id='semesterType']").select("SS");
        cy.get("select[id='semesterYear']").select("2010");
        cy.get("select[id='fieldsOfStudy-1']").select(FieldOfStudy.COMPUTER_SCIENCE);
        cy.get("button[id='removeFieldOfStudy-1']").click();
        cy.get("button[id='removeFieldOfStudy-1']").should("not.exist");
    });

    it("Input a FoS for a semester earlier than birthday results in error", function () {
        cy.get("button[id='addImmatriculationData']").should("be.disabled");
        cy.get("button[id='removeFieldOfStudy-1']").should("not.exist");
        cy.get("select[id='semesterType']").select("SS");
        cy.get("select[id='semesterYear']").select("2010");
        cy.get("select[id='fieldsOfStudy-1']").select(FieldOfStudy.COMPUTER_SCIENCE);
        cy.get("button[id='addImmatriculationData']").click();
        cy.wait(4000);
        cy.get("div[id='immatriculationOptions']").siblings().get("p").should("have.class", "error-message");
        cy.get("button[id='removeFieldOfStudy-1']").click();
    });

    it("Add two fields of studies for one summer semester", function () {
        cy.get("select[id=semesterType]").select("SS");
        cy.get("select[id=semesterYear]").select("2015");
        cy.get("select[id=fieldsOfStudy-1]").select(FieldOfStudy.COMPUTER_SCIENCE);
        cy.get("select[id=fieldsOfStudy-2]").select(FieldOfStudy.MATHEMATICS);
        cy.get("button[id=addImmatriculationData]").click();
        cy.wait(5000);
    });

    it("Check if summer semester FoS are shown in matriculation history", function () {
        cy.get("div").contains("Immatriculation History");
        cy.get("div").should("contain", "SS2015").and("contain", FieldOfStudy.COMPUTER_SCIENCE).and("contain", FieldOfStudy.MATHEMATICS);
    });

    it("Add two fields of studies for one winter semester", function () {
        cy.get("select[id=semesterType]").select("WS");
        cy.get("select[id=semesterYear]").select("2015/16");
        cy.get("select[id=fieldsOfStudy-1]").select(FieldOfStudy.COMPUTER_SCIENCE);
        cy.get("select[id=fieldsOfStudy-2]").select(FieldOfStudy.MATHEMATICS);
        cy.get("button[id=addImmatriculationData]").click();
        cy.wait(5000);
    });

    it("Check if winter semester FoS are shown in matriculation history", function () {
        cy.get("div").should("contain", "WS2015/16").and("contain", FieldOfStudy.COMPUTER_SCIENCE).and("contain", FieldOfStudy.MATHEMATICS);
    });

    it("Immatriculation correctly shown in accountlist", function () {
        cy.visit("/accounts");
        cy.get(`div[id=user_${student.username}`).should("contain", "Last Immatriculated");
        logout();
    });

    it("Check latest matriculation is filled correctly in student's profile", function () {
        loginAsUser(studentAuthUser);
        navigateToPrivateProfile();
        cy.get("div").contains("Latest Immatriculation");
        cy.get("input[id=latestImmatriculation]").should("have.value", "WS2015/16");
        cy.get("button[id=showHistoryButton]").click();
    });

    it("Check matriculation modal is filled correctly in student's profile", function () {
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Immatriculation History");
        cy.get("div").should("contain", "SS2015").and("contain", FieldOfStudy.COMPUTER_SCIENCE).and("contain", FieldOfStudy.MATHEMATICS);
        cy.get("div").should("contain", "WS2015/16").and("contain", FieldOfStudy.COMPUTER_SCIENCE).and("contain", FieldOfStudy.MATHEMATICS);

        cy.get("button[id='immatriculationHistoryClose']").click();
        cy.wait(100);
    });
});
