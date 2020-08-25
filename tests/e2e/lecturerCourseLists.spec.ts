describe("Course List Behavior", () => {
    const random = Math.floor(Math.random() * 500);
    const otherLecturer = "cy-lecturer" + random;
    const password = "testpassword";
    const courseName = "cy-my-course" + random;
    const otherCourseName = "cy-course" + random;

    it("Login as Admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("admin");
        cy.get("input[id='password']").type("admin");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Create a new lecturer account", () => {
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
        cy.get("input[id='userName']").type(otherLecturer);
        cy.get("input[id='password']").should("exist");
        cy.get("input[id='password']").type(password);
        cy.get('select[id="country"]').select("United States");
        cy.get("input[id='firstName']").type("firstName");
        cy.get("input[id='lastName']").type("lastName");
        cy.get("input[id='street']").type("test-street-cypress");
        cy.get("input[id='houseNumber']").type("1a");
        cy.get("input[id='zipCode']").type("12345");
        cy.get("input[id='city']").type("test-city-cypress");
        cy.get("input[id='phoneNumber']").type("+49 123456789");
        cy.get("select").eq(0).select("15");
        cy.get("select").eq(1).select("November");
        cy.get("select").eq(2).select("1996");
        cy.get("input[id='email']").clear().type("valid@valid.de");
        cy.get("button").contains("Create Account").should("be.enabled");
        cy.get("button").contains("Create Account").click();
        cy.wait(3000);
    });

    it("Login as other lecturer", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(otherLecturer);
        cy.get("input[id='password']").type(password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Create a course of other lecturer", () => {
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

        cy.get('input[id="courseName"]').type(otherCourseName);
        cy.get("select").select("German");
        cy.get('textarea[id="courseDescription"]').type("test-courseDescription-cypress");
        cy.get('input[id="maxParticipants"]').clear().type("1");
        cy.get('button[id="createCourse"]').click();
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains(otherCourseName).should("exist");
    });

    it("Create an own course", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("lecturer");
        cy.get("input[id='password']").type("lecturer");
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

        cy.get('input[id="courseName"]').type(courseName);
        cy.get("select").select("German");
        cy.get('textarea[id="courseDescription"]').type("test-courseDescription-cypress");
        cy.get('input[id="maxParticipants"]').clear().type("1");
        cy.get('button[id="createCourse"]').click();
        cy.wait(3000);
        cy.get("button[title='Refresh']").click();
        cy.get("div").contains(courseName).should("exist");
    });

    it("Tab All Courses should contain both courses", () => {
        cy.get("div[id='menu_courses']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_courses']").parents().eq(1).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(1).get("span").contains("All Courses").should("be.visible");
        cy.get("div[id='menu_courses']").children().eq(1).get("a").contains("All Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "all-courses");
        cy.get("div").contains(courseName).should("exist");
        cy.get("div").contains(courseName).parent().parent().find("button[id='editCourse']").should("exist");
        cy.get("div").contains(otherCourseName).should("exist");
        cy.get("div").contains(otherCourseName).parent().parent().find("button[id='editCourse']").should("not.exist");
    });

    it("Tab my course should just contain my courses", () => {
        cy.get("div[id='menu_courses']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_courses']").parents().eq(1).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(1).get("span").contains("My Courses").should("be.visible");
        cy.get("div[id='menu_courses']").children().eq(1).get("a").contains("My Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
        cy.get("div").contains(courseName).should("exist");
        cy.get("div").contains(courseName).parent().parent().find("button[id='editCourse']").should("exist");
        cy.get("div").contains(otherCourseName).should("not.exist");
    });

    it("Delete own course", () => {
        cy.get("div").contains(courseName).parent().parent().find("button[id='editCourse']").click();
        cy.get("button[id='deleteCourse']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this course?").should("exist");
        cy.get('button[id="deleteCourseModalDelete"]').click();
        cy.url().should("contain", "/course-management");
        cy.get("div").contains(courseName).should("not.exist");
    });

    it("Delete the course of other lecturer", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(otherLecturer);
        cy.get("input[id='password']").type(password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
        cy.get("div[id='menu_courses']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_courses']").parents().eq(1).trigger("mouseover");
        cy.get("div[id='menu_courses']").children().eq(1).get("span").contains("My Courses").should("be.visible");
        cy.get("div[id='menu_courses']").children().eq(1).get("a").contains("My Courses").click();
        cy.get("div[id='menu_courses']").trigger("mouseleave");
        cy.url().should("contain", "course-management");
        cy.get("div").contains(otherCourseName).parent().parent().find("button[id='editCourse']").click();
        cy.wait(100);
        cy.get("button[id='deleteCourse']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this course?").should("exist");
        cy.get('button[id="deleteCourseModalDelete"]').click();
        cy.url().should("contain", "/course-management");
        cy.get("div").contains(otherCourseName).should("not.exist");
    });

    it("Delete other lecturer account", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("admin");
        cy.get("input[id='password']").type("admin");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_manageAccounts']").trigger("mouseover");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("span").contains("All Users").should("be.visible");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("a").contains("All Users").click();
        cy.get("div[id='menu_manageAccounts']").trigger("mouseleave");
        cy.url().should("contain", "accounts");
        cy.get(`div[id='user_${otherLecturer}']`).click();
        cy.get("button[id='deleteAccount']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this account").should("exist");
        // cancel
        cy.wait(100);
        cy.get('button[id="deleteAccountModalDelete"]').click();
        cy.url().should("contain", "/accounts");
        cy.get(`div[id='user_${otherLecturer}']`).should("not.exist");
        cy.get("div[id='user_student']").should("exist");
        cy.get("div[id='user_lecturer']").should("exist");
        cy.get("div[id='user_admin']").should("exist");
    });
});
