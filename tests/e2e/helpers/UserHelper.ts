import Lecturer from "@/api/api_models/user_management/Lecturer";
import { Account } from "@/entities/Account";
import { navigateToAccountForm, navigateToAccountList } from "./NavigationHelper";
import Student from "@/api/api_models/user_management/Student";
import { loginAsUser } from "./AuthHelper";
import User from "@/api/api_models/user_management/User";

export function createNewLecturer(lecturer: Lecturer, lecturerAuthUser: Account) {
    navigateToAccountForm();
    // create new Lecturer
    cy.get("input[type='radio']").eq(1).click();
    cy.get("input[id='userName']").type(lecturerAuthUser.username);
    cy.get("input[id='password']").should("exist");
    cy.get("input[id='password']").type(lecturerAuthUser.password);
    cy.get('select[id="country"]').select(lecturer.address.country);
    cy.get("input[id='firstName']").type(lecturer.firstName);
    cy.get("input[id='lastName']").type(lecturer.lastName);
    cy.get("input[id='street']").type(lecturer.address.street);
    cy.get("input[id='houseNumber']").type(lecturer.address.houseNumber);
    cy.get("input[id='zipCode']").type(lecturer.address.zipCode);
    cy.get("input[id='city']").type(lecturer.address.city);
    cy.get("input[id='phoneNumber']").type(lecturer.phoneNumber);
    cy.get("select").eq(0).select("15");
    cy.get("select").eq(1).select("November");
    cy.get("select").eq(2).select("1996");
    cy.get("input[id='email']").clear().type(lecturer.email);
    cy.get("textarea[id='researchArea']").type(lecturer.researchArea);
    cy.get("textarea[id='freeText']").type(lecturer.freeText);
    cy.get("button").contains("Create Account").should("be.enabled");
    cy.get("button").contains("Create Account").click();
    navigateToAccountList();
    cy.wait(3000);
    cy.get("button[title='Refresh']").click();
    cy.get(`div[id='user_${lecturer.username}']`).should("exist");
}

export function createNewStudent(student: Student, studentAuthUser: Account) {
    navigateToAccountForm();
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
    navigateToAccountList();
    cy.wait(3000);
    cy.get("button[title='Refresh']").click();
    cy.get(`div[id='user_${student.username}']`).should("exist");
}

export function loginAndCreateLecturer(lecturer: Lecturer, lecturerAuthUser: Account, adminAuth: Account) {
    loginAsUser(adminAuth);
    cy.wait(100);
    createNewLecturer(lecturer, lecturerAuthUser);
}

export function loginAndCreateStudent(student: Student, studentAuthUser: Account, adminAuth: Account) {
    loginAsUser(adminAuth);
    cy.wait(100);
    createNewStudent(student, studentAuthUser);
}

export function deleteUser(user: User) {
    navigateToAccountList();
    cy.url().should("contain", "accounts");
    cy.get(`div[id='user_${user.username}']`).click();
    cy.get("button[id='deleteAccount']").click();
    cy.wait(100);
    // show modal
    cy.get("#modal-wrapper").should("exist");
    cy.get("div").contains("Are you sure you want to delete this account").should("exist");
    // cancel
    cy.wait(100);
    cy.get('button[id="deleteAccountModalDelete"]').click();
    navigateToAccountList();
    cy.url().should("contain", "/accounts");
    cy.get(`div[id='user_${user.username}']`).should("not.exist");
    cy.get("div[id='user_student']").should("exist");
    cy.get("div[id='user_lecturer']").should("exist");
    cy.get("div[id='user_admin']").should("exist");
}

export function loginAndDeleteUser(user: User, adminAuth: Account) {
    loginAsUser(adminAuth);
    deleteUser(user);
}
