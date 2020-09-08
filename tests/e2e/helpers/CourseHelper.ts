import Course from "@/api/api_models/course_management/Course";
import { Account } from "@/entities/Account";
import { loginAsUser } from "./AuthHelper";
import {
    navigateToCourseFormAdmin,
    navigateToCourseForm,
    navigateToMyCoursesLecturer,
    navigateToCourseListAdmin,
} from "./NavigationHelper";

export function createCourse(course: Course) {
    navigateToCourseForm();
    cy.get("input[type='radio']").get(`input[value='${course.courseType}']`).click();
    cy.get('input[id="courseName"]').type(course.courseName);
    cy.get("select").select(course.courseLanguage);
    cy.get('textarea[id="courseDescription"]').type(course.courseDescription);
    cy.get('input[id="maxParticipants"]').clear().type(course.maxParticipants.toString());
    cy.wait(100);
    cy.get('button[id="createCourse"]').click();
    navigateToMyCoursesLecturer();
    cy.url().should("contain", "course-management");
    cy.wait(3000);
    cy.get("button[title='Refresh']").click();
    cy.get("div").contains(course.courseName).should("exist");
}

export function createCourseAdmin(course: Course) {
    navigateToCourseFormAdmin();
    cy.get('input[id="lecturerId"]').type(course.lecturerId);
    cy.get("input[type='radio']").get(`input[value='${course.courseType}']`).click();
    cy.get('input[id="courseName"]').type(course.courseName);
    cy.get("select").select(course.courseLanguage);
    cy.get('textarea[id="courseDescription"]').type(course.courseDescription);
    cy.get('input[id="maxParticipants"]').clear().type(course.maxParticipants.toString());
    cy.wait(100);
    cy.get('button[id="createCourse"]').click();
    navigateToCourseListAdmin();
    cy.url().should("contain", "all-courses");
    cy.wait(3000);
    cy.get("button[title='Refresh']").click();
    cy.get("div").contains(course.courseName).should("exist");
}

export function loginAndCreateCourse(course: Course, lecturer: Account) {
    loginAsUser(lecturer);
    cy.wait(100);
    createCourse(course);
}

export function loginAndDeleteCourse(course: Course, lecturerAuthUser: Account) {
    loginAsUser(lecturerAuthUser);
    cy.wait(100);
    deleteCourse(course);
}

export function deleteCourse(course: Course) {
    navigateToMyCoursesLecturer();
    cy.url().should("contain", "course-management");
    cy.get("div").contains(course.courseName).parent().parent().find("button[id='editCourse']").click();
    cy.wait(100);
    cy.get("button[id='deleteCourse']").click();
    cy.wait(100);
    // show modal
    cy.get("#modal-wrapper").should("exist");
    cy.get("div").contains("Are you sure you want to delete this course?").should("exist");
    cy.get('button[id="deleteCourseModalDelete"]').click();
    cy.url().should("contain", "/course-management");
    cy.get("div").contains(course.courseName).should("not.exist");
}

export function deleteCourseAdmin(course: Course) {
    navigateToCourseListAdmin();
    cy.url().should("contain", "all-courses");
    cy.get("div").contains(course.courseName).parent().parent().find("button[id='editCourse']").click();
    cy.wait(100);
    cy.get("button[id='deleteCourse']").click();
    cy.wait(100);
    // show modal
    cy.get("#modal-wrapper").should("exist");
    cy.get("div").contains("Are you sure you want to delete this course?").should("exist");
    cy.get('button[id="deleteCourseModalDelete"]').click();
    cy.url().should("contain", "/all-courses");
    cy.get("div").contains(course.courseName).should("not.exist");
}
