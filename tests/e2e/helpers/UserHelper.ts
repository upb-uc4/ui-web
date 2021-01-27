import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import User from "@/api/api_models/user_management/User";
import UserManagement from "@/api/UserManagement";
import { Account } from "@/entities/Account";
import MachineUserAuthenticationManagement from "../../helper/MachineUserAuthenticationManagement";
import { loginAsUser } from "./AuthHelper";
import { navigateToAccountForm, navigateToAccountList } from "./NavigationHelper";
import { UserWithAuth } from "./UserWithAuth";

export function createNewLecturer(governmentId: string, lecturer: Lecturer, lecturerAuthUser: Account) {
    navigateToAccountForm();
    // create new Lecturer
    cy.get("input[type='radio']").eq(1).click();
    cy.get("input[id='userName']").type(lecturerAuthUser.username);
    cy.get("input[id='securitySectionPassword']").should("exist");
    cy.get("input[id='securitySectionPassword']").type(lecturerAuthUser.password);
    cy.get("input[id='governmentId']").type(governmentId);
    cy.get('button[id="country"]').click();
    cy.get('li[id="countryItem-' + lecturer.address.country + '"]').click();
    cy.get("input[id='firstName']").type(lecturer.firstName);
    cy.get("input[id='lastName']").type(lecturer.lastName);
    cy.get("input[id='street']").type(lecturer.address.street);
    cy.get("input[id='houseNumber']").type(lecturer.address.houseNumber);
    cy.get("input[id='zipCode']").type(lecturer.address.zipCode);
    cy.get("input[id='city']").type(lecturer.address.city);
    cy.get("input[id='phoneNumber']").type(lecturer.phoneNumber);
    cy.get("button[id='day']").click();
    cy.get("li[id='dayItem-15']").click();
    cy.get("button[id='month']").click();
    cy.get("li[id='monthItem-November']").click();
    cy.get("button[id='year']").click();
    cy.get("li[id='yearItem-1996']").click();
    cy.get("input[id='email']").clear().type(lecturer.email);
    cy.get("textarea[id='researchArea']").type(lecturer.researchArea);
    cy.get("textarea[id='freeText']").type(lecturer.freeText);
    cy.get("button").contains("Create Account").should("be.enabled");
    cy.get("button").contains("Create Account").click();
    cy.url().should("not.eq", Cypress.config().baseUrl + "createAccount");
    navigateToAccountList();
    cy.wait(3000);
    cy.get("button[id='refresh']").click();
    cy.get(`div[id='user_${lecturer.username}']`).should("exist");
}

export function createNewStudent(governmentId: string, student: Student, studentAuthUser: Account) {
    navigateToAccountForm();
    cy.wait(10000);
    cy.get("#role-Student").click();
    cy.get("input[id='userName']").type(student.username);
    cy.get("input[id='securitySectionPassword']").type(studentAuthUser.password);
    cy.get("input[id='governmentId']").type(governmentId);
    cy.get('button[id="country"]').click();
    cy.get('li[id="countryItem-' + student.address.country + '"]').click();
    cy.get("input[id='firstName']").type(student.firstName);
    cy.get("input[id='lastName']").type(student.lastName);
    cy.get("input[id='street']").type(student.address.street);
    cy.get("input[id='houseNumber']").type(student.address.houseNumber);
    cy.get("input[id='zipCode']").type(student.address.zipCode);
    cy.get("input[id='city']").type(student.address.city);
    cy.get("button[id='day']").click();
    cy.get("li[id='dayItem-15']").click();
    cy.get("button[id='month']").click();
    cy.get("li[id='monthItem-November']").click();
    cy.get("button[id='year']").click();
    cy.get("li[id='yearItem-1996']").click();
    cy.get("input[id='email']").clear().type(student.email);
    cy.get("input[id='matriculationId']").type(student.matriculationId);
    cy.get("input[id='phoneNumber']").type(student.phoneNumber);

    cy.get("button").contains("Create Account").click();
    cy.url().should("not.eq", Cypress.config().baseUrl + "createAccount");
    navigateToAccountList();
    cy.wait(3000);
    cy.get("button[id='refresh']").click();
    cy.get(`div[id='user_${student.username}']`).should("exist");
}

export function createNewAdmin(governmentId: string, admin: Admin, adminAuthUser: Account) {
    navigateToAccountForm();
    cy.get("input[type='radio']").eq(0).click();
    cy.get("input[id='userName']").type(admin.username);
    cy.get("input[id='securitySectionPassword']").type(adminAuthUser.password);
    cy.get("input[id='governmentId']").type(governmentId);
    cy.get('button[id="country"]').click();
    cy.get('li[id="countryItem-' + admin.address.country + '"]').click();
    cy.get("input[id='firstName']").type(admin.firstName);
    cy.get("input[id='lastName']").type(admin.lastName);
    cy.get("input[id='street']").type(admin.address.street);
    cy.get("input[id='houseNumber']").type(admin.address.houseNumber);
    cy.get("input[id='zipCode']").type(admin.address.zipCode);
    cy.get("input[id='city']").type(admin.address.city);
    cy.get("button[id='day']").click();
    cy.get("li[id='dayItem-15']").click();
    cy.get("button[id='month']").click();
    cy.get("li[id='monthItem-November']").click();
    cy.get("button[id='year']").click();
    cy.get("li[id='yearItem-1996']").click();
    cy.get("input[id='email']").clear().type(admin.email);
    cy.get("input[id='phoneNumber']").type(admin.phoneNumber);

    cy.get("button").contains("Create Account").click();
    cy.url().should("not.eq", Cypress.config().baseUrl + "createAccount");
    navigateToAccountList();
    cy.wait(3000);
    cy.get("button[id='refresh']").click();
    cy.get(`div[id='user_${admin.username}']`).should("exist");
}

export function loginAndCreateLecturer(governmentId: string, lecturer: Lecturer, lecturerAuthUser: Account, adminAuth: Account) {
    loginAsUser(adminAuth);
    cy.wait(100);
    createNewLecturer(governmentId, lecturer, lecturerAuthUser);
}

export function loginAndCreateStudent(governmentId: string, student: Student, studentAuthUser: Account, adminAuth: Account) {
    loginAsUser(adminAuth);
    cy.wait(100);
    createNewStudent(governmentId, student, studentAuthUser);
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
    cy.url().should("not.eq", Cypress.config().baseUrl + "createAccount");
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

export async function createUsers(users: UserWithAuth[]) {
    const user_management = new UserManagement();
    users.forEach(async (user) => {
        await user_management.createUser(user.governmentId, user.auth, user.userInfo);
    });
}

export async function deleteUsers(users: Account[], adminAuth: Account) {
    let userNames: string[] = [];
    users.forEach((user) => userNames.push(user.username));
    MachineUserAuthenticationManagement.setVueEnvVariable(Cypress.env("NODE_ENV"));
    await MachineUserAuthenticationManagement._getRefreshToken(adminAuth);

    const user_management = new UserManagement();
    const existingUsers = await user_management.getUsers(undefined, userNames);
    Object.values(existingUsers.returnValue)
        .flat()
        .forEach(async (user) => {
            await user_management.deleteUser(user.username);
        });
}

export function getRandomMatriculationId(): string {
    var today = new Date();
    var monthPadded = ("00" + (today.getMonth() + 1)).substr(-2);
    var dayPadded = ("00" + today.getDate()).substr(-2);
    var random2 = Math.floor(Math.random() * 999).toString();
    var randomPadded = ("000" + random2).substr(-3);
    return monthPadded + dayPadded + randomPadded;
}

export function getRandomizedGovernmentId(): string {
    const random = Math.floor(Math.random() * 999).toString();
    var randomPadded = ("000" + random).substr(-3);
    return new Date().toISOString() + "" + randomPadded;
}
