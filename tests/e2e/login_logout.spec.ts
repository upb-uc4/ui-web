import { Account } from "@/entities/Account";

describe("Login behaviour", () => {
    let adminAuth: Account;
    let studentAuth: Account;
    let lecturerAuth: Account;

    before(() => {
        cy.fixture("logins/admin.json").then((admin) => {
            adminAuth = admin;
        });
        cy.fixture("logins/student.json").then((student) => {
            studentAuth = student;
        });
        cy.fixture("logins/lecturer.json").then((lecturer) => {
            lecturerAuth = lecturer;
        });
    });

    it("Login as Lecturer", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(lecturerAuth.username);
        cy.get("input[id='password']").type(lecturerAuth.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Login as Admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(adminAuth.username);
        cy.get("input[id='password']").type(adminAuth.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Login as Student", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(studentAuth.username);
        cy.get("input[id='password']").type(studentAuth.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Logout works", () => {
        cy.get("div[id='menu_profile']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_profile']").trigger("mouseover");
        cy.get("div[id='menu_profile']").children().eq(1).get("span").contains("Sign out").should("be.visible");
        cy.get("div[id='menu_profile']").children().eq(1).get("a").contains("Sign out").click();
        cy.url().should("contain", "/");
        cy.go(-1);
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Please enter your authentication credentials.");
        cy.get("button[id='loginModalCancel']").click();
        cy.url().should("contain", "/login");
    });
});
