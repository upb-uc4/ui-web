import Admin from "@/api/api_models/user_management/Admin";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { loginAsDefaultAdmin, loginAsUser, logout } from "./helpers/AuthHelper";
import { navigateToPrivateProfile } from "./helpers/NavigationHelper";
import { createNewStudent, deleteUsers } from "./helpers/UserHelper";
import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";

const random = Math.floor(Math.random() * 9999);
let admin: Admin;
let adminAuthUser: Account;
let student: Student;
let studentAuthUser: Account;

let adminAuth: Account;
let studentAuth: Account;

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
        cy.fixture("adminAuthUser.json").then((a) => {
            (a as Account).username += random;
            adminAuthUser = a as Account;
        });

        cy.fixture("student.json").then((s) => {
            (s as Student).username += random;
            student = s as Student;
            var today = new Date();
            var monthPadded = ("00" + (today.getMonth() + 1)).substr(-2);
            var dayPadded = ("00" + today.getDate()).substr(-2);
            var random2 = Math.floor(Math.random() * 999).toString();
            var randomPadded = ("000" + random2).substr(-3);
            student.matriculationId = monthPadded + dayPadded + randomPadded;
        });
        cy.fixture("studentAuthUser.json").then((s) => {
            (s as Account).username += random;
            studentAuthUser = s as Account;
        });

        cy.fixture("logins/admin.json").then((admin) => {
            adminAuth = admin;
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

    it("Create student account", () => {
        createNewStudent(student, studentAuthUser);
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

    it("FoS multiselect changes are detected", function () {
        loginAsDefaultAdmin();
        cy.visit(`editAccount/${student.username}`);
        cy.get("select[id=semesterType]").select("SS");
        cy.get("button[id=cancel]").click();
        cy.wait(100);
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Do you really want to continue and leave this page? You have unsaved changes.");

        cy.get("button[id='unsavedChangesModalCancel']").click();
        cy.wait(100);
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
