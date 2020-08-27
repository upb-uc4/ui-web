import Course from "@/api/api_models/course_management/Course";
import { Account } from "@/entities/Account";

describe("Student course view", () => {
    const random = Math.floor(Math.random() * 9999);

    let studentAuth: Account;
    let lecturerAuth: Account;
    let course: Course;

    before(() => {
        cy.fixture("logins/student.json").then((student) => {
            studentAuth = student;
        });

        cy.fixture("logins/lecturer.json").then((lecturer) => {
            lecturerAuth = lecturer;
        });

        cy.fixture("course.json").then((c) => {
            course = c;
            course.courseName += "-" + random;
        });
    });

    it("Create Course as lecturer", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(lecturerAuth.username);
        cy.get("input[id='password']").type(lecturerAuth.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
        cy.get("div[id='menu_courses']").parents().eq(0).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(0).get("a").contains("My Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
        // create course
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.get("input[type='radio']").eq(0).click();
        cy.get('input[id="courseName"]').type(course.courseName);
        cy.get("select").select(course.courseLanguage);
        cy.get('textarea[id="courseDescription"]').type(course.courseDescription);
        cy.get('input[id="maxParticipants"]').clear().type(course.maxParticipants.toString());
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "course-management");
        cy.wait(1000);
    });

    it("Login as student", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(studentAuth.username);
        cy.get("input[id='password']").type(studentAuth.password);
        cy.wait(1000);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Navigate to course list", () => {
        cy.get("div[id='menu_courses']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_courses']").parents().eq(1).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(1).get("span").contains("All Courses").should("be.visible");
        cy.get("div[id='menu_courses']").children().eq(1).get("a").contains("All Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "courses");
    });

    it("Course exists", () => {
        cy.wait(2000);
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains(course.courseName);
        cy.reload();
    });

    it("Delete course as lecturer", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(lecturerAuth.username);
        cy.get("input[id='password']").type(lecturerAuth.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
        cy.get("div[id='menu_courses']").parents().eq(0).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(0).get("a").contains("My Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
        cy.get("div").contains(course.courseName).parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.get('button[id="deleteCourseModalDelete"]').click();
    });
});
