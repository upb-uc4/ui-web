import Course from "@/api/api_models/course_management/Course";

describe("Course Filtering", function () {
    const random1 = Math.floor(Math.random() * 9999);
    const random2 = Math.floor(Math.random() * 9999);
    const random3 = Math.floor(Math.random() * 9999);

    beforeEach(function () {
        cy.fixture("course.json").then((course) => {
            this.course1 = { ...(course as Course) };
            this.course1.courseName += random1;

            this.course2 = { ...(course as Course) };
            this.course2.courseName += random2;

            this.course3 = { ...(course as Course) };
            this.course3.courseName += random3;
        });
    });

    it("Login as Lecturer", function () {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
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
        cy.get('input[id="courseName"]').type(this.course1.courseName);
        cy.get("select").select(this.course1.courseLanguage);
        cy.get('textarea[id="courseDescription"]').type(this.course1.courseDescription);
        cy.get('input[id="maxParticipants"]').clear().type(this.course1.maxParticipants);
        cy.wait(100);
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "course-management");
        // create course2
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.get("input[type='radio']").eq(1).click();
        cy.get('input[id="courseName"]').type(this.course2.courseName);
        cy.get("select").select(this.course2.courseLanguage);
        cy.get('textarea[id="courseDescription"]').type(this.course2.courseDescription);
        cy.get('input[id="maxParticipants"]').clear().type(this.course2.maxParticipants);
        cy.wait(100);
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "course-management");
        // create course3
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.get("input[type='radio']").eq(2).click();
        cy.get('input[id="courseName"]').type(this.course3.courseName);
        cy.get("select").select(this.course3.courseLanguage);
        cy.get('textarea[id="courseDescription"]').type(this.course3.courseDescription);
        cy.get('input[id="maxParticipants"]').clear().type(this.course3.maxParticipants);
        cy.wait(100);
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "course-management");
        cy.wait(1000);
        cy.get("button[title='Refresh']").click();
        cy.wait(1000);
        cy.get("div").should("contain", this.course1.courseName);
        cy.get("div").should("contain", this.course2.courseName);
        cy.get("div").should("contain", this.course3.courseName);
    });

    it("Lecture filter working", function () {
        cy.get("button[id='courseType-Lecture']").click();
        cy.get("div").contains(this.course1.courseName).should("exist");
        cy.get("div").contains(this.course2.courseName).should("not.exist");
        cy.get("div").contains(this.course3.courseName).should("not.exist");
    });

    it("Seminar filter working", function () {
        cy.get("button[id='courseType-Seminar']").click();
        cy.get("div").contains(this.course1.courseName).should("not.exist");
        cy.get("div").contains(this.course2.courseName).should("exist");
        cy.get("div").contains(this.course3.courseName).should("not.exist");
    });

    it("PG filter working", function () {
        cy.get("button[id='courseType-Project Group']").click();
        cy.get("div").contains(this.course1.courseName).should("not.exist");
        cy.get("div").contains(this.course2.courseName).should("not.exist");
        cy.get("div").contains(this.course3.courseName).should("exist");
    });

    it("All filter working", function () {
        cy.get("button[id='courseType-All']").click();
        cy.get("div").contains(this.course1.courseName).should("exist");
        cy.get("div").contains(this.course2.courseName).should("exist");
        cy.get("div").contains(this.course3.courseName).should("exist");
    });

    it("Searchbar working", function () {
        cy.get("input[id='message']").type(random1.toString());
        cy.get("div").contains(this.course1.courseName).should("exist");
        cy.get("div").contains(this.course2.courseName).should("not.exist");
        cy.get("div").contains(this.course3.courseName).should("not.exist");
        cy.get("input[id='message']").clear();
        cy.get("div").contains(this.course1.courseName).should("exist");
        cy.get("div").contains(this.course2.courseName).should("exist");
        cy.get("div").contains(this.course3.courseName).should("exist");
    });

    it("Delete courses", function () {
        cy.get("div").contains(this.course1.courseName).parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.get('button[id="deleteCourseModalDelete"]').click();
        cy.get("div").contains(this.course2.courseName).parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.get('button[id="deleteCourseModalDelete"]').click();
        cy.get("div").contains(this.course3.courseName).parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.get('button[id="deleteCourseModalDelete"]').click();
    });
});
