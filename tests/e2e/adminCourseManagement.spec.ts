import Course from "@/api/api_models/course_management/Course";
import { Account } from "@/entities/Account";
import { loginAsDefaultAdmin, loginAsDefaultLecturer, logout } from "./helpers/AuthHelper";
import { navigateToAccountForm, navigateToCourseListAdmin, navigateToMyCoursesLecturer } from "./helpers/NavigationHelper";
import { createCourseAdmin, deleteCourseAdmin } from "./helpers/CourseHelper";
import { createNewLecturer, deleteUsers } from "./helpers/UserHelper";
import Lecturer from "@/api/api_models/user_management/Lecturer";

describe("Course creation, edition and deletion", () => {
    const random = Math.floor(Math.random() * 9999);

    let course: Course;
    let secondLecturer: Lecturer;
    let secondLecturerAuth: Account;
    let adminAuth: Account;
    let lecturerAuth: Account;

    before(function () {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });
        cy.fixture("course.json").then((c) => {
            course = c as Course;
            course.courseName += random;
        });

        cy.fixture("logins/admin.json").then((admin) => {
            adminAuth = admin;
        });

        cy.fixture("logins/lecturer.json").then((lecturer) => {
            lecturerAuth = lecturer;
        });
        cy.fixture("lecturer.json").then((l) => {
            (l as Lecturer).username += random;
            secondLecturer = l as Lecturer;
        });
        cy.fixture("lecturerAuthUser.json").then((l) => {
            (l as Account).username += random;
            secondLecturerAuth = l as Account;
        });
    });

    after(() => {
        deleteUsers([secondLecturerAuth], adminAuth);
        logout();
    });

    it("Login as admin", () => {
        loginAsDefaultAdmin();
    });

    it("Create second lecturer", () => {
        createNewLecturer(secondLecturer, secondLecturerAuth);
    });

    it("Navigate to course list", () => {
        navigateToCourseListAdmin();
    });

    it("Show new course page", () => {
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.url().should("contain", "/createCourse");
    });

    it("Check existence of all fields", () => {
        cy.get("input[id='lecturerId']").should("exist");
        cy.get("input[id='courseType']").should("exist");
        cy.get("input[id='courseName']").should("exist");
        cy.get("select[id='courseLanguage']").should("exist");
        cy.get("textarea[id='courseDescription']").should("exist");
        cy.get("input[id='maxParticipants']").should("exist");
        cy.get("input[id='startDate']").should("exist");
        cy.get("input[id='endDate']").should("exist");
    });

    it("Can not submit empty course", () => {
        cy.get('button[id="createCourse"]').should("be.disabled");
    });

    it("Can change courseType", () => {
        cy.get("input[type='radio']").should("be.enabled");
    });

    it("Show validation errors", () => {
        // TODO include as soon as error feedback implemented in backend
        //cy.get("input[id='lecturerId']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='courseName']").type("test");
        cy.get('button[id="createCourse"]').click();
        cy.get("input[id='courseType']").siblings().get("p").should("have.class", "error-message");
        cy.get("select[id='courseLanguage']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='maxParticipants']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='courseName']").clear();
        cy.get("input[type='radio']").eq(0).click();
        cy.get('button[id="createCourse"]').click();
        cy.get("input[id='courseName']").siblings().get("p").should("have.class", "error-message");
    });

    it("Show unsaved changes modal", () => {
        cy.get("button[id='cancel']").click();
        cy.wait(100);
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Do you really want to continue and leave this page? You have unsaved changes.");

        cy.get("button[id='unsavedChangesModalCancel']").click();
        cy.wait(100);
        cy.get("button[id='cancel']").click();
        cy.get("button[id='unsavedChangesModalConfirmLeave']").click();
    });

    it("Show new course page", () => {
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.url().should("contain", "/createCourse");
    });

    it("Filtering lecturer list in selection works", () => {
        cy.get("input[id='lecturerId']").clear().type(lecturerAuth.username);
        cy.get("div").contains(`(@${lecturerAuth.username})`).should("exist");
        cy.get("div")
            .contains("(@" + secondLecturer.username + ")")
            .should("not.exist");
    });

    it("Can select default lecturer", () => {
        cy.get("input[id='lecturerId']").clear();
        cy.get("input[id='lecturerId']").click();
        cy.get("div").contains(`(@${lecturerAuth.username})`).click();
        cy.get("input[id='lecturerId']").should("have.value", lecturerAuth.username);
    });

    it("Create course", () => {
        createCourseAdmin(course);
    });

    it("Logout as Admin", () => {
        logout();
    });

    it("Lecturer sees his new course", () => {
        loginAsDefaultLecturer();
        navigateToMyCoursesLecturer();
        cy.get("div").contains(course.courseName).should("exist");
        logout();
    });

    it("Login as Admin", () => {
        loginAsDefaultAdmin();
    });

    // edit course
    it("Show course edit page", () => {
        navigateToCourseListAdmin();
        cy.get("div").contains(course.courseName).parent().parent().find("button[id='editCourse']").click();

        cy.get('input[id="courseName"]').should("have.value", course.courseName);
    });

    it("Display of lecturer found works", () => {
        // initially the default lecturer is loaded
        cy.get("label").should("contain", "firstName LastName");
        cy.get("a").contains("lecturer").should("have.attr", "href").and("include", "/user/lecturer");
        cy.get("a").contains("lecturer").should("have.attr", "target").and("include", "_blank");

        cy.get("input[id='lecturerId']").type("some nonsense");
        cy.get("label").should("contain", "Lecturer-ID not found!");

        cy.get("input[id='lecturerId']").clear().type(course.lecturerId);
        cy.get("label").should("contain", "firstName LastName");
        cy.get("a").contains("lecturer").should("have.attr", "href").and("include", "/user/lecturer");
        cy.get("a").contains("lecturer").should("have.attr", "target").and("include", "_blank");
    });

    it("Can not save unchanged course", () => {
        cy.get('button[id="saveChanges"]').should("be.disabled");
    });

    it("Can edit courseName", () => {
        course.courseName += "-updated";
        cy.get('input[id="courseName"]').clear().type(course.courseName);
    });

    it("Can save course", () => {
        cy.get('button[id="saveChanges"]').should("be.enabled");
        cy.get('button[id="saveChanges"]').click();
    });

    it("Edit worked", () => {
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains(course.courseName).parent().parent().find("button[id='editCourse']").should("exist");
    });

    it("Delete course", () => {
        deleteCourseAdmin(course);
    });
});
