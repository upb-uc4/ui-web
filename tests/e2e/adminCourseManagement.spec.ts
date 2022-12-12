import Course from "@/api/api_models/course_management/Course";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import { Account } from "@/entities/Account";
import { getMachineUserAuth, loginAsDefaultAdmin, loginAsDefaultLecturer, logout } from "./helpers/AuthHelper";
import { createCourseAdmin, deleteCourseAdmin, deleteCourses } from "./helpers/CourseHelper";
import { navigateToCourseListAdmin, navigateToMyCoursesLecturer } from "./helpers/NavigationHelper";
import { createUsers, deleteUsers, getRandomizedGovernmentId } from "./helpers/UserHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";

describe("Course creation, edition and deletion", () => {
    const random = Math.floor(Math.random() * 9999);

    let course: Course;
    let secondLecturer: Lecturer;
    let secondLecturerAuth: Account;
    let adminAuth: Account;
    let lecturerAuth: Account;
    let usersWithAuth: UserWithAuth[] = [];
    let newModule: String = "Math 2";
    let lecturerName = "Jane Doe";

    before(function () {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });
        cy.fixture("course.json").then((c) => {
            course = c as Course;
            course.courseName += random;
        });

        cy.fixture("logins/admin.json")
            .then((admin) => {
                adminAuth = admin;
            })
            .then(async () => {
                await getMachineUserAuth(adminAuth);
            })
            .then(() => {
                cy.fixture("lecturer.json").then((l) => {
                    (l as Lecturer).username += random;
                    secondLecturer = l as Lecturer;
                });
            })
            .then(() => {
                cy.fixture("lecturerAuthUser.json").then((lAuth) => {
                    (lAuth as Account).username += random;
                    secondLecturerAuth = lAuth as Account;
                    let governmentId = getRandomizedGovernmentId();
                    usersWithAuth.push({ governmentId, userInfo: secondLecturer, auth: secondLecturerAuth });
                });
            })
            .then(async () => {
                await createUsers(usersWithAuth);
            })
            .then(() => {
                console.log("Setup finished");
            });

        cy.fixture("logins/lecturer.json").then((lecturer) => {
            lecturerAuth = lecturer;
        });
    });

    after(() => {
        deleteUsers([secondLecturerAuth], adminAuth);
        deleteCourses([course]);
        logout();
    });

    it("Login as admin", () => {
        loginAsDefaultAdmin();
    });

    it("Navigate to course list", () => {
        navigateToCourseListAdmin();
    });

    it("Show new course page", () => {
        cy.get('a[id="addCourse"]').click({ force: true });
        cy.url().should("contain", "/createCourse");
    });

    it("Check existence of all fields", () => {
        cy.get("input[id='lecturerId']").should("exist");
        cy.get("button[id='courseType']").should("exist");
        cy.get("input[id='courseName']").should("exist");
        cy.get("button[id='courseLanguage']").should("exist");
        cy.get("button[id='exReg']").should("exist");
        cy.get("textarea[id='courseDescription']").should("exist");
        cy.get("input[id='ects']").should("exist");
        cy.get("input[id='maxParticipants']").should("exist");
        cy.get("input[id='startDate']").should("exist");
        cy.get("input[id='endDate']").should("exist");
    });

    it("Can not submit empty course", () => {
        cy.get('button[id="createCourse"]').should("be.disabled");
    });

    it("Can change courseType", () => {
        cy.get("button[id='courseType']").should("be.enabled");
    });

    it("Show validation errors", () => {
        cy.get("input[id='courseName']").type("test");
        cy.get('button[id="createCourse"]').click();
        cy.get("label[id='lecturerIdErrorLabel']").should("have.class", "input-label-error");
        cy.get("button[id='courseType']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("button[id='courseLanguage']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[id='ects']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[id='maxParticipants']").siblings().get("label").should("have.class", "input-label-error");
        cy.get("input[id='courseName']").clear();
        cy.get("button[id='courseType']").click();
        cy.get("li[id='courseTypeItem-Lecture']").click();
        cy.get('button[id="createCourse"]').click();
        cy.get("input[id='courseName']").siblings().get("label").should("have.class", "input-label-error");
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
        cy.get('a[id="addCourse"]').click({ force: true });
        cy.url().should("contain", "/createCourse");
        cy.wait(750);
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
        cy.get("div[id='lecturerIdOptionDiv']").get("div").contains(`(@${lecturerAuth.username})`).click();
        cy.get("input[id='lecturerId']").should("contain.value", lecturerAuth.username);
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
        cy.get("label[id='courseName']").contains(course.courseName).should("exist");
        logout();
    });

    it("Login as Admin", () => {
        loginAsDefaultAdmin();
    });

    // edit course
    it("Show course edit page", () => {
        navigateToCourseListAdmin();
        cy.get("label[id='courseName']").contains(course.courseName).parent().parent().find("button[id='editCourse']").click();

        cy.get('input[id="courseName"]').should("have.value", course.courseName);
    });

    it("Display of lecturer found works", () => {
        // initially the default lecturer is loaded
        cy.get("label").should("contain", lecturerName);
        cy.get("a").contains("lecturer").should("have.attr", "href").and("include", "/user/lecturer");
        cy.get("a").contains("lecturer").should("have.attr", "target").and("include", "_blank");
        // TODO find good alternative for new ui
        cy.get("input[id='lecturerId']").clear();
        cy.get("input[id='lecturerId']").click();
        cy.get("div[id='lecturerIdOptionDiv']").get("div").contains(`(@${course.lecturerId})`).click();
        cy.get("label").should("contain", lecturerName);
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

    it("Can edit modules", () => {
        cy.get("span").contains("Math 1").get(".remove-tag").click();
        cy.get("input[id='searchSelectInput']").click();
        cy.get("div").contains(`${newModule}`).click();
    });

    it("Can save course", () => {
        cy.get('button[id="saveChanges"]').should("be.enabled");
        cy.get('button[id="saveChanges"]').click();
    });

    it("Edit worked", () => {
        cy.wait(3000);
        cy.get("button[id='refresh']").click();
        cy.wait(5000);
        cy.get("label[id='courseName']").contains(course.courseName).parent().parent().find("button[id='editCourse']").click();
        cy.wait(5000);
        cy.get("div[id='moduleSection']").get("span").contains("Mathe 1").should("not.exist");
        cy.get("div[id='moduleSection']").get("span").contains(`${newModule}`).should("exist");
    });

    it("Delete course", () => {
        deleteCourseAdmin(course);
    });
});
