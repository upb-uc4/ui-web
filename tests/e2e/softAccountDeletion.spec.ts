import Course from "@/api/api_models/course_management/Course";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import { Account } from "@/entities/Account";
import { CourseType } from "../fixtures/CourseType";
import { getMachineUserAuth, loginAsDefaultAdmin, loginAsDefaultStudent, logout } from "./helpers/AuthHelper";
import { createCourses, deleteCourses } from "./helpers/CourseHelper";
import { navigateToAccountList, navigateToCourseListStudent } from "./helpers/NavigationHelper";
import { createUsers, deleteUsers, getRandomizedGovernmentId } from "./helpers/UserHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";

describe("Course Filtering", function () {
    const random = Math.floor(Math.random() * 9999);

    let course1: Course;

    let adminAuth: Account;
    let lecturer: Lecturer;
    let lecturerGovId: string;
    let lecturerAuth: Account;
    let usersWithAuth: UserWithAuth[] = [];

    before(function () {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });

        cy.fixture("course.json")
            .then((course) => {
                course1 = { ...(course as Course) };
                course1.courseName += random;
                course1.courseType = CourseType.LECTURE;
            })
            .then(() => {
                cy.fixture("logins/admin.json").then((admin) => {
                    adminAuth = admin;
                });
            })
            .then(async () => {
                await getMachineUserAuth(adminAuth);
            })
            .then(() => {
                cy.fixture("lecturer.json").then((l) => {
                    (l as Lecturer).username += random;
                    lecturer = l as Lecturer;
                    course1.lecturerId = lecturer.username;
                });
            })
            .then(() => {
                cy.fixture("lecturerAuthUser.json").then((l) => {
                    (l as Account).username += random;
                    lecturerAuth = l as Account;
                    lecturerGovId = getRandomizedGovernmentId();
                    usersWithAuth.push({ governmentId: lecturerGovId, userInfo: lecturer, auth: lecturerAuth });
                });
            })
            .then(async () => {
                await createUsers(usersWithAuth);
                await new Promise((r) => setTimeout(r, 3000));
                await createCourses([course1]);
                await deleteUsers([lecturerAuth], adminAuth);
            })
            .then(() => {
                console.log("Setup finished");
            });
    });

    after(() => {
        deleteCourses([course1]);
        logout();
    });

    it("Login as student and navigate to course list", () => {
        loginAsDefaultStudent();
        navigateToCourseListStudent();
        cy.wait(20000);
    });

    it("Course of deleted lecturer is shown", () => {
        cy.get("div").contains(course1.courseName).should("exist");
        cy.get("div")
            .contains(course1.courseName)
            .parent()
            .parent()
            .find("label[id='showLecturer']")
            .should("contain", `${lecturer.firstName} ${lecturer.lastName}`);
    });

    it("Public profile is shown correctly", () => {
        cy.get("div").contains(course1.courseName).parent().parent().find("label[id='showLecturer']").click();
        cy.url().should("contain", `/user/${lecturer.username}`);
        cy.get("div").contains("Inactive").should("exist");
        cy.get("div").contains(`${lecturer.firstName} ${lecturer.lastName}`).should("exist");
        cy.get("div").contains(`@${lecturer.username}`).should("exist");
        cy.get("div").contains("Research Area").should("not.exist");
        cy.get("div").contains("Description").should("not.exist");
    });

    it("Logout and login as admin", () => {
        logout();
        loginAsDefaultAdmin();
    });

    it("Deleted lecturer is shown in account list after checking 'inactive'", () => {
        navigateToAccountList();

        cy.get("button[id='selectFilterStatus']").click();
        cy.get("li[id='selectFilterStatusItem-Active']").click();
        cy.get("button[id='selectFilterStatus']").should("contain", "Active");

        cy.get("button[id='selectFilterStatus']").click();
        cy.get("li[id='selectFilterStatusItem-Inactive']").click();
        cy.get("button[id='selectFilterStatus']").should("contain", "Inactive");

        cy.wait(1000);
        cy.get(`div[id='user_${lecturer.username}']`).should("exist");
        cy.get(`div[id='user_${lecturer.username}']`).should("contain", "Inactive");
    });
});
