/*
 * Login as admin
 * check if admin, lecturer and student exist
 * create new account
 * check all input fields
 * check unsaved changes modal
 * create student account
 * edit student account
 * change fields of study
 * delete account
 * test account deletion modal
 */

import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { Role } from "@/entities/Role";
import { loginAsDefaultAdmin, logout } from "./helpers/AuthHelper";
import { navigateToAccountList, navigateToExamRegForm } from "./helpers/NavigationHelper";
import {
    createNewAdmin,
    createNewLecturer,
    createNewStudent,
    deleteUser,
    deleteUsers,
    getRandomMatriculationId,
} from "./helpers/UserHelper";

const random = Math.floor(Math.random() * 9999);
let admin: Admin;
let adminAuthUser: Account;
let student: Student;
let studentAuthUser: Account;
let lecturer: Lecturer;
let lecturerAuthUser: Account;

let adminAuth: Account;
let studentAuth: Account;
let lecturerAuth: Account;

describe("Account creation, edition and deletion", function () {
    before(function () {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });
    });

    after(() => {
        logout();
    });

    it("Login as admin", function () {
        loginAsDefaultAdmin();
    });

    it("Navigate to Create Exam Reg Form", function () {
        navigateToExamRegForm();
    });
});
