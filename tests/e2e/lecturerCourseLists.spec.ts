import Lecturer from "@/api/api_models/user_management/Lecturer";
import { Account } from "@/entities/Account";
import Course from "@/api/api_models/course_management/Course";

let lecturer: Lecturer;
let lecturerAuthUser: Account;
let course1: Course;
let course2: Course;
let adminAuth: Account;
let lecturerAuth: Account;

describe("Course List Behavior", function () {
    const random = Math.floor(Math.random() * 9999);

    before(function () {
        cy.fixture("lecturer.json").then((l) => {
            (l as Lecturer).username += random;
            lecturer = l as Lecturer;
        });
        cy.fixture("lecturerAuthUser.json").then((lecturer) => {
            (lecturer as Account).username += random;
            lecturerAuthUser = lecturer as Account;
        });
        cy.fixture("course.json").then((course) => {
            course1 = { ...(course as Course) };
            course1.courseName += "1-" + random;

            course2 = { ...(course as Course) };
            course2.courseName += "2-" + random;
        });

        cy.fixture("logins/admin.json").then((admin) => {
            adminAuth = admin;
        });
        cy.fixture("logins/lecturer.json").then((lecturer) => {
            lecturerAuth = lecturer;
        });
    });

    it("Login as Admin", function () {
        cy.visit("/");
        cy.get("input[id='email']").type(adminAuth.username);
        cy.get("input[id='password']").type(adminAuth.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Create a new lecturer account", function () {
        // Navigate to Account Form
        cy.get("div[id='menu_manageAccounts']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_manageAccounts']").trigger("mouseover");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("span").contains("New Account").should("be.visible");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("a").contains("New Account").click();
        cy.get("div[id='menu_manageAccounts']").trigger("mouseleave");
        cy.url().should("contain", "/createAccount");

        // create new Lecturer
        cy.get("input[type='radio']").eq(1).click();
        cy.get("textarea[id='freeText']").should("exist");
        cy.get("textarea[id='researchArea']").should("exist");
        cy.get("input[id='userName']").type(lecturerAuthUser.username);
        cy.get("input[id='password']").should("exist");
        cy.get("input[id='password']").type(lecturerAuthUser.password);
        cy.get('select[id="country"]').select(lecturer.address.country);
        cy.get("input[id='firstName']").type(lecturer.firstName);
        cy.get("input[id='lastName']").type(lecturer.lastName);
        cy.get("input[id='street']").type(lecturer.address.street);
        cy.get("input[id='houseNumber']").type(lecturer.address.houseNumber);
        cy.get("input[id='zipCode']").type(lecturer.address.zipCode);
        cy.get("input[id='city']").type(lecturer.address.city);
        cy.get("input[id='phoneNumber']").type(lecturer.phoneNumber);
        cy.get("select").eq(0).select("15");
        cy.get("select").eq(1).select("November");
        cy.get("select").eq(2).select("1996");
        cy.get("input[id='email']").clear().type(lecturer.email);
        cy.get("button").contains("Create Account").should("be.enabled");
        cy.get("button").contains("Create Account").click();
        cy.wait(3000);
    });

    it("Login as other lecturer", function () {
        cy.visit("/");
        cy.get("input[id='email']").type(lecturerAuthUser.username);
        cy.get("input[id='password']").type(lecturerAuthUser.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Create a course of other lecturer", function () {
        cy.get("div[id='menu_courses']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_courses']").parents().eq(1).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(1).get("span").contains("My Courses").should("be.visible");
        cy.get("div[id='menu_courses']").children().eq(1).get("a").contains("My Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.url().should("contain", "/createCourse");

        cy.get("input[type='radio']").should("be.enabled");
        cy.get("input[type='radio']").eq(0).click();

        cy.get('input[id="courseName"]').type(course2.courseName);
        cy.get("select").select(course2.courseLanguage);
        cy.get('textarea[id="courseDescription"]').type(course2.courseDescription);
        cy.get('input[id="maxParticipants"]').clear().type(course2.maxParticipants.toString());
        cy.get('button[id="createCourse"]').click();
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains(course2.courseName).should("exist");
    });

    it("Create an own course", function () {
        cy.visit("/");
        cy.get("input[id='email']").type(lecturerAuth.username);
        cy.get("input[id='password']").type(lecturerAuth.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
        cy.get("div[id='menu_courses']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_courses']").parents().eq(1).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(1).get("span").contains("My Courses").should("be.visible");
        cy.get("div[id='menu_courses']").children().eq(1).get("a").contains("My Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.url().should("contain", "/createCourse");

        cy.get("input[type='radio']").should("be.enabled");
        cy.get("input[type='radio']").eq(0).click();

        cy.get('input[id="courseName"]').type(course1.courseName);
        cy.get("select").select(course1.courseLanguage);
        cy.get('textarea[id="courseDescription"]').type(course1.courseDescription);
        cy.get('input[id="maxParticipants"]').clear().type(course1.maxParticipants.toString());
        cy.get('button[id="createCourse"]').click();
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains(course1.courseName).should("exist");
    });

    it("Tab All Courses should contain both courses", function () {
        cy.get("div[id='menu_courses']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_courses']").parents().eq(1).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(1).get("span").contains("All Courses").should("be.visible");
        cy.get("div[id='menu_courses']").children().eq(1).get("a").contains("All Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "all-courses");
        cy.get("div").contains(course1.courseName).should("exist");
        cy.get("div").contains(course1.courseName).parent().parent().find("button[id='editCourse']").should("exist");
        cy.get("div").contains(course2.courseName).should("exist");
        cy.get("div").contains(course2.courseName).parent().parent().find("button[id='editCourse']").should("not.exist");
    });

    it("Tab my course should just contain my courses", function () {
        cy.get("div[id='menu_courses']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_courses']").parents().eq(1).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(1).get("span").contains("My Courses").should("be.visible");
        cy.get("div[id='menu_courses']").children().eq(1).get("a").contains("My Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
        cy.get("div").contains(course1.courseName).should("exist");
        cy.get("div").contains(course1.courseName).parent().parent().find("button[id='editCourse']").should("exist");
        cy.get("div").contains(course2.courseName).should("not.exist");
    });

    it("Delete own course", function () {
        cy.get("div").contains(course1.courseName).parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this course?").should("exist");
        cy.get('button[id="deleteCourseModalDelete"]').click();
        cy.url().should("contain", "/course-management");
        cy.get("div").contains(course1.courseName).should("not.exist");
    });

    it("Delete the course of other lecturer", function () {
        cy.visit("/");
        cy.get("input[id='email']").type(lecturerAuthUser.username);
        cy.get("input[id='password']").type(lecturerAuthUser.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
        cy.get("div[id='menu_courses']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_courses']").parents().eq(1).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(1).get("span").contains("My Courses").should("be.visible");
        cy.get("div[id='menu_courses']").children().eq(1).get("a").contains("My Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
        cy.get("div").contains(course2.courseName).parent().parent().find("button[id='editCourse']").click();
        cy.wait(100);
        cy.get("button[id='deleteCourse']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this course?").should("exist");
        cy.get('button[id="deleteCourseModalDelete"]').click();
        cy.url().should("contain", "/course-management");
        cy.get("div").contains(course2.courseName).should("not.exist");
    });

    it("Delete other lecturer account", function () {
        cy.visit("/");
        cy.get("input[id='email']").type(adminAuth.username);
        cy.get("input[id='password']").type(adminAuth.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_manageAccounts']").trigger("mouseover");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("span").contains("All Users").should("be.visible");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("a").contains("All Users").click();
        cy.get("div[id='menu_manageAccounts']").trigger("mouseleave");
        cy.url().should("contain", "accounts");
        cy.get(`div[id='user_${lecturer.username}']`).click();
        cy.get("button[id='deleteAccount']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this account").should("exist");
        // cancel
        cy.wait(100);
        cy.get('button[id="deleteAccountModalDelete"]').click();
        cy.url().should("contain", "/accounts");
        cy.get(`div[id='user_${lecturer.username}']`).should("not.exist");
        cy.get("div[id='user_student']").should("exist");
        cy.get("div[id='user_lecturer']").should("exist");
        cy.get("div[id='user_admin']").should("exist");
    });
});
