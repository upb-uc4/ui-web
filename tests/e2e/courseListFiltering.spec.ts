import Course from "@/api/api_models/course_management/Course";
import { Account } from "@/entities/Account";

describe("Course Filtering", function () {
    const random1 = Math.floor(Math.random() * 9999);
    const random2 = Math.floor(Math.random() * 9999);
    const random3 = Math.floor(Math.random() * 9999);

    let course1: Course;
    let course2: Course;
    let course3: Course;
    let lecturerAuth: Account;

    before(function () {
        cy.fixture("course.json").then((course) => {
            course1 = { ...(course as Course) };
            course1.courseName += random1;

            course2 = { ...(course as Course) };
            course2.courseName += random2;

            course3 = { ...(course as Course) };
            course3.courseName += random3;
        });

        cy.fixture("logins/lecturer.json").then((lecturer) => {
            lecturerAuth = lecturer;
        });
    });

    it("Login as Lecturer", function () {
        cy.visit("/");
        cy.get("input[id='email']").type(lecturerAuth.username);
        cy.get("input[id='password']").type(lecturerAuth.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Create Courses of each Type", function () {
        cy.get("div[id='menu_courses']").parents().eq(0).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(0).get("a").contains("My Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
        // create course1
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.get("input[type='radio']").eq(0).click();
        cy.get('input[id="courseName"]').type(course1.courseName);
        cy.get("select").select(course1.courseLanguage);
        cy.get('textarea[id="courseDescription"]').type(course1.courseDescription);
        cy.get('input[id="maxParticipants"]').clear().type(course1.maxParticipants.toString());
        cy.wait(100);
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "course-management");
        // create course2
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.get("input[type='radio']").eq(1).click();
        cy.get('input[id="courseName"]').type(course2.courseName);
        cy.get("select").select(course2.courseLanguage);
        cy.get('textarea[id="courseDescription"]').type(course2.courseDescription);
        cy.get('input[id="maxParticipants"]').clear().type(course2.maxParticipants.toString());
        cy.wait(100);
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "course-management");
        // create course3
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.get("input[type='radio']").eq(2).click();
        cy.get('input[id="courseName"]').type(course3.courseName);
        cy.get("select").select(course3.courseLanguage);
        cy.get('textarea[id="courseDescription"]').type(course3.courseDescription);
        cy.get('input[id="maxParticipants"]').clear().type(course3.maxParticipants.toString());
        cy.wait(100);
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "course-management");
        cy.wait(1000);
        cy.get("button[title='Refresh']").click();
        cy.wait(1000);
        cy.get("div").should("contain", course1.courseName);
        cy.get("div").should("contain", course2.courseName);
        cy.get("div").should("contain", course3.courseName);
    });

    it("Lecture filter working", function () {
        cy.get("button[id='courseType-Lecture']").click();
        cy.get("div").contains(course1.courseName).should("exist");
        cy.get("div").contains(course2.courseName).should("not.exist");
        cy.get("div").contains(course3.courseName).should("not.exist");
    });

    it("Seminar filter working", function () {
        cy.get("button[id='courseType-Seminar']").click();
        cy.get("div").contains(course1.courseName).should("not.exist");
        cy.get("div").contains(course2.courseName).should("exist");
        cy.get("div").contains(course3.courseName).should("not.exist");
    });

    it("PG filter working", function () {
        cy.get("button[id='courseType-Project Group']").click();
        cy.get("div").contains(course1.courseName).should("not.exist");
        cy.get("div").contains(course2.courseName).should("not.exist");
        cy.get("div").contains(course3.courseName).should("exist");
    });

    it("All filter working", function () {
        cy.get("button[id='courseType-All']").click();
        cy.get("div").contains(course1.courseName).should("exist");
        cy.get("div").contains(course2.courseName).should("exist");
        cy.get("div").contains(course3.courseName).should("exist");
    });

    it("Searchbar working", function () {
        cy.get("input[id='message']").type(random1.toString());
        cy.get("div").contains(course1.courseName).should("exist");
        cy.get("div").contains(course2.courseName).should("not.exist");
        cy.get("div").contains(course3.courseName).should("not.exist");
        cy.get("input[id='message']").clear();
        cy.get("div").contains(course1.courseName).should("exist");
        cy.get("div").contains(course2.courseName).should("exist");
        cy.get("div").contains(course3.courseName).should("exist");
    });

    it("Delete courses", function () {
        cy.get("div").contains(course1.courseName).parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.get('button[id="deleteCourseModalDelete"]').click();
        cy.get("div").contains(course2.courseName).parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.get('button[id="deleteCourseModalDelete"]').click();
        cy.get("div").contains(course3.courseName).parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.get('button[id="deleteCourseModalDelete"]').click();
    });
});
