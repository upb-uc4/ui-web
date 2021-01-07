import Course from "@/api/api_models/course_management/Course";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { getMachineUserAuth, loginAsUser, logout } from "./helpers/AuthHelper";
import { createCourses, deleteCourses } from "./helpers/CourseHelper";
import { navigateToAdmittedCourses, navigateToCourseListStudent, navigateToImmatriculationPage } from "./helpers/NavigationHelper";
import { createUsers, deleteUsers, getRandomizedGovernmentId, getRandomMatriculationId } from "./helpers/UserHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";

describe("Course Admission", () => {
    const random = Math.floor(Math.random() * 9999);

    let student: Student;
    let studentAuthUser: Account;
    let fieldOfStudy = { semesterType: "SS", year: "2020", fos: "Bachelor Computer Science v3" };
    let adminAuth: Account;
    let lecturerAuth: Account;
    let course: Course;
    let usersWithAuth: UserWithAuth[] = [];

    before(() => {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });

        cy.fixture("logins/admin.json")
            .then((admin) => {
                adminAuth = admin;
            })
            .then(() => {
                cy.fixture("course.json").then((c) => {
                    course = c;
                    course.courseName += "-" + random;
                    course.maxParticipants = 6;
                });
            })
            .then(() => {
                cy.fixture("logins/lecturer.json").then((lecturer) => {
                    lecturerAuth = lecturer;
                    course.lecturerId = lecturerAuth.username;
                });
            })
            .then(() => {
                cy.fixture("student.json").then((s) => {
                    (s as Student).username += random;
                    student = s as Student;
                    student.matriculationId = getRandomMatriculationId();
                    student.birthDate = "2012-01-01";
                });
            })
            .then(() => {
                cy.fixture("studentAuthUser.json").then((s) => {
                    (s as Account).username += random;
                    studentAuthUser = s as Account;
                    const governmentId = getRandomizedGovernmentId();
                    usersWithAuth.push({ governmentId, userInfo: student, auth: studentAuthUser });
                });
            })
            .then(async () => {
                await getMachineUserAuth(adminAuth);
            })
            .then(async () => {
                await createUsers(usersWithAuth);
            })
            .then(async () => {
                await createCourses([course]);
            })
            .then(() => {
                console.log("Setup finished");
            });
    });

    after(() => {
        deleteCourses([course]);
        deleteUsers([studentAuthUser], adminAuth);
        logout();
    });

    it("Login as student", () => {
        loginAsUser(studentAuthUser);
    });

    //Immatriculate first
    it("Select a field of study", () => {
        navigateToImmatriculationPage();
        cy.wait(20000);
        cy.get("button[id='removeFieldOfStudy-1']").should("not.exist");
        cy.get("select[id='semesterType']").select(fieldOfStudy.semesterType);
        cy.get("select[id='semesterYear']").select(fieldOfStudy.year);
        cy.get("select[id='fieldsOfStudy-1']").select(fieldOfStudy.fos);
        cy.get("button[id=addImmatriculationData]").click();
        cy.wait(5000);
    });

    it("Encryption modal should be shown", () => {
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains(
            "Please choose a password to encrypt your private key, so it can be securely stored on our servers. Ensure that you do not lose this password as it cannot be restored."
        );
    });

    it("Enter encryption password to proceed", () => {
        const encryptionPassword = studentAuthUser.password;
        cy.get("input[id='enterEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("input[id='confirmEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("button[id='encryptPrivateKeyModalConfirm']").click();
        // wait for certificate to be created and the immatriculation data to be written
        cy.wait(40000);
    });

    it("Decryption modal shown", () => {
        cy.get("input[id='enterDecryptionPassword']").type(studentAuthUser.password);
        cy.get("button[id='decryptPrivateKeyModalConfirm']").click();
        cy.wait(60000);
    });

    it("Correct immatriculation entries are shown", () => {
        cy.get("div").contains("Immatriculation History");
        cy.get("div").should("contain", fieldOfStudy.year).and("contain", fieldOfStudy.fos);
    });

    it("Admitted Courses Page should be empty", () => {
        navigateToAdmittedCourses();
        //Call on chain to get admissions
        cy.wait(20000);
        cy.get("div").contains(course.courseName).should("not.exist");
    });

    it("Navigate to available courses", () => {
        navigateToCourseListStudent();
        //Call on chain to get admissions
        cy.wait(20000);
        cy.get("div").contains(course.courseName).should("exist");
    });

    it("Course info page contains all information", () => {
        cy.get("div").contains(course.courseName).click();
        cy.url().should("contain", "/join");

        cy.get("input[id='lecturerName']").should("have.value", "Jane Doe");
        cy.get("input[id='courseType']").should("have.value", course.courseType);
        cy.get("input[id='courseName']").should("have.value", course.courseName);
        cy.get("input[id='courseLanguage']").should("have.value", course.courseLanguage);
        cy.get("input[id='ects']").should("have.value", course.ects);
        cy.get("textarea[id='courseDescription']").should("have.value", course.courseDescription);
    });

    it("Select a module and join the course", () => {
        cy.get("input[id='selectModule']").clear().type(course.moduleIds[0]);
        cy.get("button[id='joinCourse']").click();
    });

    it("Decryption modal shown", () => {
        cy.get("input[id='enterDecryptionPassword']").type(studentAuthUser.password);
        cy.get("button[id='decryptPrivateKeyModalConfirm']").click();

        //Call on chain (add admission + get admissions on course list)
        cy.wait(60000);
    });

    it("Course is flagged with admitted", () => {
        cy.url().should("contain", "courses");
        cy.get("div").contains(course.courseName).parent().should("contain", "Registered");
    });

    it("Admitted courses list contains course", () => {
        navigateToAdmittedCourses();
        cy.wait(20000);
        cy.get("div").contains(course.courseName).should("exist");
    });

    it("Dropping course works", () => {
        cy.get("div").contains(course.courseName).click();
        cy.url().should("contain", "drop");
        //Call on chain to get admissions
        cy.wait(20000);

        cy.get("button[id='dropCourse']").click();

        //Call on chain (add admission + get admissions on course list)
        cy.get("input[id='enterDecryptionPassword']").type(studentAuthUser.password);
        cy.get("button[id='decryptPrivateKeyModalConfirm']").click();
        cy.wait(45000);
        cy.get("div").contains(course.courseName).should("not.exist");
    });
});
