import Course from "@/api/api_models/course_management/Course";
import CourseManagement from "@/api/CourseManagement";
import { Account } from "@/entities/Account";
import { loginAsUser } from "./AuthHelper";
import {
    navigateToCourseForm,
    navigateToCourseFormAdmin,
    navigateToCourseListAdmin,
    navigateToMyCoursesLecturer,
} from "./NavigationHelper";

export function createCourse(course: Course) {
    navigateToCourseForm();
    cy.wait(750);
    cy.get("button[id='courseType']").click();
    cy.get("li[id='courseTypeItem-" + course.courseType + "']").click();
    cy.get('input[id="courseName"]').type(course.courseName);
    cy.get("button[id='courseLanguage']").click();
    cy.get("li[id='courseLanguageItem-" + course.courseLanguage + "']").click();
    cy.get('input[id="ects"]').clear().type(course.ects.toString());
    cy.get('textarea[id="courseDescription"]').type(course.courseDescription);
    cy.get('input[id="maxParticipants"]').clear().type(course.maxParticipants.toString());
    cy.get('button[id="exReg"]').select("Bachelor Computer Science v3");
    cy.get(`input[id='modules_0']`).click();
    cy.get("div").contains(course.moduleIds[0]).click();
    cy.wait(100);
    cy.get('button[id="createCourse"]').click();
    cy.url().should("not.eq", Cypress.config().baseUrl + "createCourse");
    navigateToMyCoursesLecturer();
    cy.url().should("contain", "course-management");
    cy.wait(3000);
    cy.get("button[id='refresh']").click();
    cy.wait(3000);
    cy.get("label[id='courseName']").contains(course.courseName).should("exist");
}

export function createCourseAdmin(course: Course) {
    navigateToCourseFormAdmin();
    cy.wait(750);
    cy.get("input[id='lecturerId']").clear();
    cy.get("input[id='lecturerId']").click();
    cy.get("div[id='lecturerIdOptionDiv']").get("div").contains(`(@${course.lecturerId})`).click();
    cy.get("button[id='courseType']").click();
    cy.get("li[id='courseTypeItem-" + course.courseType + "']").click();
    cy.get('input[id="courseName"]').type(course.courseName);
    cy.get("button[id='courseLanguage']").click();
    cy.get("li[id='courseLanguageItem-" + course.courseLanguage + "']").click();
    cy.get('input[id="ects"]').clear().type(course.ects.toString());
    cy.get('textarea[id="courseDescription"]').type(course.courseDescription);
    cy.get('input[id="maxParticipants"]').clear().type(course.maxParticipants.toString());
    cy.get('button[id="exReg"]').click();
    cy.get("span").contains("Bachelor Computer Science v3").click();
    cy.get(`input[id='searchSelectInput']`).click();
    cy.get("span").contains("Math 1").click();
    cy.wait(100);
    cy.get('button[id="createCourse"]').click();
    cy.url().should("not.eq", Cypress.config().baseUrl + "createCourse");
    navigateToCourseListAdmin();
    cy.url().should("contain", "all-courses");
    cy.wait(3000);
    cy.get("button[id='refresh']").click();
    cy.wait(3000);
    cy.get("label[id='courseName']").contains(course.courseName).should("exist");
}

export async function createCourses(courses: Course[]) {
    const course_management = new CourseManagement();
    courses.forEach(async (course) => {
        await course_management.createCourse(course);
    });
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
    cy.get("label[id='courseName']").contains(course.courseName).parent().parent().find("button[id='editCourse']").click();
    cy.wait(100);
    cy.get("button[id='deleteCourse']").click();
    cy.wait(100);
    // show modal
    cy.get("#modal-wrapper").should("exist");
    cy.get("div").contains("Are you sure you want to delete this course?").should("exist");
    cy.get('button[id="deleteCourseModalDelete"]').click();
    cy.url().should("contain", "/all-courses");
    cy.get("label[id='courseName']").contains(course.courseName).should("not.exist");
}

export function deleteCourseAdmin(course: Course) {
    navigateToCourseListAdmin();
    cy.url().should("contain", "all-courses");
    cy.get("label[id='courseName']").contains(course.courseName).parent().parent().find("button[id='editCourse']").click();
    cy.wait(100);
    cy.get("button[id='deleteCourse']").click();
    cy.wait(100);
    // show modal
    cy.get("#modal-wrapper").should("exist");
    cy.get("div").contains("Are you sure you want to delete this course?").should("exist");
    cy.get('button[id="deleteCourseModalDelete"]').click();
    cy.url().should("contain", "/all-courses");
    cy.get("label[id='courseName']").contains(course.courseName).should("not.exist");
}

export async function deleteCourses(courses: Course[]) {
    const course_management = new CourseManagement();
    const existingCourses = (await course_management.getCourses()).returnValue;

    courses.forEach(async (course) => {
        existingCourses.forEach(async (existingCourse) => {
            if (existingCourse.courseName == course.courseName) {
                await course_management.deleteCourse(existingCourse.courseId);
            }
        });
    });
}
