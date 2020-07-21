describe("Student course view", () => {
    it("Create Course as lecturer", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "lecturer");

        // create course
        cy.get('a[href*="/createCourse"]').click({ force: true });
        cy.get("input[type='radio']").eq(0).click();
        cy.get('input[id="courseName"]').type("test-courseName-cypress");
        cy.get("select").select("German");
        cy.get('textarea[id="courseDescription"]').type("test-courseDescription-cypress");
        cy.get('input[id="maxParticipants"]').clear().type("1");
        cy.get('button[id="createCourse"]').click();
        cy.url().should("contain", "lecturer");
        cy.wait(1000)
        cy.reload()
    });

    it("Login as student", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("student");
        cy.get("input[id='password']").type("student");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "student");
    })

    it("Course exists", () => {
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains("test-courseName-cypress");
        cy.reload()
    });

    it("Delete course as lecturer", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "lecturer");        

        cy.get("div").contains("test-courseName-cypress").parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.get('button[id="deleteCourseModalDelete"]').click();
    })
});
