describe("Course Filtering", () => {
    const random1 = Math.floor(Math.random() * 500);
    const random2 = Math.floor(Math.random() * 500);
    const random3 = Math.floor(Math.random() * 500);
    const courseName1 = "test-course-cypress" + random1;
    const courseName2 = "test-course-cypress" + random2;
    const courseName3 = "test-course-cypress" + random3;

    it("Login as Lecturer", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Create Courses of each Type", () => {
        cy.get("div[id='menu_courses']").parents().eq(0).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(0).get("a").contains("All Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
        // create course1
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.get("input[type='radio']").eq(0).click();
        cy.get('input[id="courseName"]').type(courseName1);
        cy.get("select").select("German");
        cy.get('textarea[id="courseDescription"]').type("test-courseDescription-cypress");
        cy.get('input[id="maxParticipants"]').clear().type("1");
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "course-management");
        // create course2
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.get("input[type='radio']").eq(1).click();
        cy.get('input[id="courseName"]').type(courseName2);
        cy.get("select").select("German");
        cy.get('textarea[id="courseDescription"]').type("test-courseDescription-cypress");
        cy.get('input[id="maxParticipants"]').clear().type("1");
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "course-management");
        // create course3
        cy.get('button[id="addCourse"]').click({ force: true });
        cy.get("input[type='radio']").eq(2).click();
        cy.get('input[id="courseName"]').type(courseName3);
        cy.get("select").select("German");
        cy.get('textarea[id="courseDescription"]').type("test-courseDescription-cypress");
        cy.get('input[id="maxParticipants"]').clear().type("1");
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "course-management");
        cy.wait(1000);
        cy.get("button[title='Refresh']").click();
        cy.wait(1000);
        cy.get("div").should("contain", courseName1);
        cy.get("div").should("contain", courseName2);
        cy.get("div").should("contain", courseName3);
    });

    it("Lecture filter working", () => {
        cy.get("button[id='courseType-Lecture']").click();
        cy.get("div").contains(courseName1).should("exist");
        cy.get("div").contains(courseName2).should("not.exist");
        cy.get("div").contains(courseName3).should("not.exist");
    });

    it("Seminar filter working", () => {
        cy.get("button[id='courseType-Seminar']").click();
        cy.get("div").contains(courseName1).should("not.exist");
        cy.get("div").contains(courseName2).should("exist");
        cy.get("div").contains(courseName3).should("not.exist");
    });

    it("PG filter working", () => {
        cy.get("button[id='courseType-Project Group']").click();
        cy.get("div").contains(courseName1).should("not.exist");
        cy.get("div").contains(courseName2).should("not.exist");
        cy.get("div").contains(courseName3).should("exist");
    });

    it("All filter working", () => {
        cy.get("button[id='courseType-All']").click();
        cy.get("div").contains(courseName1).should("exist");
        cy.get("div").contains(courseName2).should("exist");
        cy.get("div").contains(courseName3).should("exist");
    });

    it("Searchbar working", () => {
        cy.get("input[id='message']").type(random1.toString());
        cy.get("div").contains(courseName1).should("exist");
        cy.get("div").contains(courseName2).should("not.exist");
        cy.get("div").contains(courseName3).should("not.exist");
        cy.get("input[id='message']").clear();
        cy.get("div").contains(courseName1).should("exist");
        cy.get("div").contains(courseName2).should("exist");
        cy.get("div").contains(courseName3).should("exist");
    });

    it("Delete courses", () => {
        cy.get("div").contains(courseName1).parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.get('button[id="deleteCourseModalDelete"]').click();
        cy.get("div").contains(courseName2).parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.get('button[id="deleteCourseModalDelete"]').click();
        cy.get("div").contains(courseName3).parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.get('button[id="deleteCourseModalDelete"]').click();
    });
});
