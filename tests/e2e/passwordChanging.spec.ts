import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";

describe("Change password", () => {
    const random = Math.floor(Math.random() * 9999);
    let student: Student;
    let studentAuthUser: Account;
    let adminAuth: Account;

    before(() => {
        cy.fixture("student.json").then((s) => {
            (s as Student).username += random;
            student = s as Student;
        });

        cy.fixture("studentAuthUser.json").then((s) => {
            (s as Account).username += random;
            studentAuthUser = s as Account;
        });

        cy.fixture("logins/admin.json").then((admin) => {
            adminAuth = admin;
        });
    });

    it("Login as admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(adminAuth.username);
        cy.get("input[id='password']").type(adminAuth.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Show new account page", () => {
        cy.get("div[id='menu_manageAccounts']").trigger("mouseover");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("a").contains("New Account").click();
        cy.get("div[id='menu_manageAccounts']").trigger("mouseleave");
        cy.url().should("contain", "/createAccount");
    });

    it("Create account works", () => {
        cy.get("input[type='radio']").eq(2).click();
        cy.get("input[id='userName']").type(student.username);
        cy.get("input[id='password']").type(studentAuthUser.password);
        cy.get('select[id="country"]').select(student.address.country);
        cy.get("input[id='firstName']").type(student.firstName);
        cy.get("input[id='lastName']").type(student.lastName);
        cy.get("input[id='street']").type(student.address.street);
        cy.get("input[id='houseNumber']").type(student.address.houseNumber);
        cy.get("input[id='zipCode']").type(student.address.zipCode);
        cy.get("input[id='city']").type(student.address.city);
        cy.get("select[id='day']").select("15");
        cy.get("select[id='month']").select("November");
        cy.get("select[id='year']").select("1996");
        cy.get("input[id='email']").clear().type(student.email);
        cy.get("input[id='matriculationId']").type(student.matriculationId);
        cy.get("input[id='phoneNumber']").type(student.phoneNumber);

        cy.get("button").contains("Create Account").click();
        cy.wait(300);
    });

    it("Login with new student account", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(student.username);
        cy.get("input[id='password']").type(studentAuthUser.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Navigate to settings page", () => {
        cy.get("div[id='menu_profile']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_profile']").trigger("mouseover");
        cy.get("div[id='menu_profile']").children().eq(1).get("span").contains("Settings").should("be.visible");
        cy.get("div[id='menu_profile']").children().eq(1).get("a").contains("Settings").click();
        cy.get("div[id='menu_profile']").trigger("mouseleave");
        cy.url().should("contain", "/settings");
    });

    it("Open password change modal", () => {
        cy.get("#modal-wrapper").should("exist");
        cy.get("div[id='modal-wrapper']").children().should("not.be.visible");

        // open
        cy.get("button[id='updatePassword'").click();
        cy.get("div[id='modal-wrapper']").children().eq(0).should("be.visible");

        // close with cancel button
        cy.get("button[id='enterPasswordModalCancel']").click();
        cy.get("div[id='modal-wrapper']").children().should("not.be.visible");

        // open
        cy.get("button[id='updatePassword'").click();
        cy.get("div[id='modal-wrapper']").children().eq(0).should("be.visible");
    });

    it("Enter wrong password should show error", () => {
        cy.get("input[id='enterPasswordModalPassword']").type(studentAuthUser.password + "wrong!");
        cy.get("button[id='enterPasswordModalConfirm']").click();

        cy.get("p").should("have.class", "error-message").should("exist");
    });

    it("Enter correct password", () => {
        cy.get("input[id='enterPasswordModalPassword']").clear().type(studentAuthUser.password);
        cy.get("button[id='enterPasswordModalConfirm']").click();

        cy.get("p").invoke("hasClass", "error-message").should("not.be.visible");
        cy.get("div[id='modal-wrapper']").children().should("not.be.visible");
    });

    it("Password fields should be password fields", () => {
        cy.get("input[id='newPassword']").invoke("attr", "type").should("equal", "password");
        cy.get("input[id='confirmationPassword']").invoke("attr", "type").should("equal", "password");
    });

    it("Converting password fields to text fields works", () => {
        cy.get("button[id='toggleNewPassword']").click();

        cy.get("input[id='newPassword']").invoke("attr", "type").should("equal", "text");
        cy.get("input[id='confirmationPassword']").invoke("attr", "type").should("equal", "text");

        cy.get("button[id='toggleConfirmationPassword']").click();

        cy.get("input[id='newPassword']").invoke("attr", "type").should("equal", "password");
        cy.get("input[id='confirmationPassword']").invoke("attr", "type").should("equal", "password");
    });

    it("Entering different passwords should block button", () => {
        cy.get("button[id='changePassword']").should("be.disabled");
        cy.get("input[id='newPassword']").type("password-a");
        cy.get("input[id='confirmationPassword']").type("password-b");
        cy.get("button[id='changePassword']").should("be.disabled");
    });

    it("Entering the same password should be valid", () => {
        cy.get("button[id='changePassword']").should("be.disabled");
        studentAuthUser.password += "-new";
        cy.get("input[id='newPassword']").clear().type(studentAuthUser.password);
        cy.get("input[id='confirmationPassword']").clear().type(studentAuthUser.password);
        cy.get("button[id='changePassword']").should("not.be.disabled");
        cy.get("button[id='changePassword']").click();
    });

    it("Password change should hide inputs", () => {
        cy.get("input[id='newPassword']").should("not.exist");
        cy.get("input[id='confirmationPassword']").should("not.exist");
        cy.get("button[id='changePassword']").should("not.exist");
        cy.wait(300);
    });

    it("Login with new password", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(studentAuthUser.username);
        cy.get("input[id='password']").type(studentAuthUser.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Login as admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(adminAuth.username);
        cy.get("input[id='password']").type(adminAuth.password);
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Delete account", () => {
        cy.get("div[id='menu_manageAccounts']").trigger("mouseover");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("a").contains("All Users").click();
        cy.get("div[id='menu_manageAccounts']").trigger("mouseleave");

        cy.get(`div[id='user_${studentAuthUser.username}']`).click();
        cy.wait(100);
        cy.get("button[id='deleteAccount']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this account").should("exist");
        // cancel
        cy.wait(100);
        cy.get('button[id="deleteAccountModalDelete"]').click();
    });
});
