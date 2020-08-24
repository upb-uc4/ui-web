import { waitForDebugger } from "inspector";

describe("Show public profile correctly", () => {
    const random = Math.floor(Math.random() * 500);

    it("Login as Lecturer to create a course", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Create a course", () => {
        cy.get("div[id='menu_courses']").parents().eq(0).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(0).get("a").contains("My Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.get("input[type='radio']").eq(0).click();
        cy.get('input[id="courseName"]').type("test-course-cypress" + random);
        cy.get("select").select("German");
        cy.get('textarea[id="courseDescription"]').type("test-courseDescription-cypress");
        cy.get('input[id="maxParticipants"]').clear().type("1");
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "course-management");
    });

    it("Login as Student", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("student");
        cy.get("input[id='password']").type("student");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Navigate to 'lecturer's public profile via created course", () => {
        cy.get("div[id='menu_courses']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_courses']").parents().eq(1).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(1).get("span").contains("All Courses").should("be.visible");
        cy.get("div[id='menu_courses']").children().eq(1).get("a").contains("All Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "/courses");
        cy.wait(2000);
        cy.get("div")
            .contains("test-course-cypress" + random)
            .parent()
            .parent()
            .find("a[id='showLecturer']")
            .click();
        cy.url().should("contain", "/user/lecturer");
    });

    it("Public Profile contains correct information", () => {
        cy.get("div").contains("firstName LastName").should("exist");
        cy.get("div").contains("(@lecturer)").should("exist");
        cy.get("div").contains("Research Area").parent().parent().should("contain", "Mathematics");
        cy.get("div").contains("Description").parent().parent().should("contain", "Heute kommt der kleine Gauss dran.");
    });

    it("Back button works", () => {
        cy.get("button[id='navigateBack']").click();
        cy.url().should("contain", "courses");
    });

    it("Login as Lecturer to delete the course", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Delete course", () => {
        cy.get("div[id='menu_courses']").parents().eq(0).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(0).get("a").contains("My Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
        cy.get("div")
            .contains("test-course-cypress" + random)
            .parent()
            .parent()
            .find("button[id='editCourse']")
            .click();
        cy.get("button[id='deleteCourse']").click();
        cy.get('button[id="deleteCourseModalDelete"]').click();
    });
});
