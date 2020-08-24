describe("Student course view", () => {
    const navbar_student_menu_courses = "div[id='menu_courses']";
    const random = Math.floor(Math.random() * 500);
    const courseName = "test-course-cypress" + random;

    it("Create Course as lecturer", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
        cy.get("div[id='menu_courses']").parents().eq(0).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(0).get("a").contains("My Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
        // create course
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.get("input[type='radio']").eq(0).click();
        cy.get('input[id="courseName"]').type(courseName);
        cy.get("select").select("German");
        cy.get('textarea[id="courseDescription"]').type("test-courseDescription-cypress");
        cy.get('input[id="maxParticipants"]').clear().type("1");
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "course-management");
        cy.wait(1000);
    });

    it("Login as student", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("student");
        cy.get("input[id='password']").type("student");
        cy.wait(1000);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Navigate to course list", () => {
        cy.get(navbar_student_menu_courses).children().eq(1).should("not.be.visible");
        cy.get(navbar_student_menu_courses).parents().eq(1).trigger("mouseover");
        cy.get(navbar_student_menu_courses).children().eq(1).get("span").contains("All Courses").should("be.visible");
        cy.get(navbar_student_menu_courses).children().eq(1).get("a").contains("All Courses").click();
        cy.get(navbar_student_menu_courses).trigger("mouseleave");
        cy.url().should("contain", "courses");
    }); 

    it("Course exists", () => {
        cy.wait(2000);
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains(courseName);
        cy.reload();
    });

    it("Delete course as lecturer", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
        cy.get(navbar_student_menu_courses).parents().eq(0).trigger("mouseover");
        cy.get(navbar_student_menu_courses).children().eq(0).get("a").contains("My Courses").click();
        cy.get(navbar_student_menu_courses).trigger("mouseleave");
        cy.url().should("contain", "course-management");
        cy.get("div").contains(courseName).parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.get('button[id="deleteCourseModalDelete"]').click();
    });
});
