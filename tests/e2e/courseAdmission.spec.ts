import Course from "@/api/api_models/course_management/Course";
import Admin from "@/api/api_models/user_management/Admin";
import Student from "@/api/api_models/user_management/Student";
import OperationManagement from "@/api/OperationManagement";
import { Account } from "@/entities/Account";
import { getMachineUserAuth, loginAsUser, logout } from "./helpers/AuthHelper";
import { createCourses, deleteCourses } from "./helpers/CourseHelper";
import { navigateToAdmittedCourses, navigateToCourseListStudent, navigateToImmatriculationPage } from "./helpers/NavigationHelper";
import { createUsers, deleteUsers, getRandomizedGovernmentId, getRandomMatriculationId } from "./helpers/UserHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";

describe("Course Admission", () => {
    const random = Math.floor(Math.random() * 9999);

    let admin: Admin;
    let adminAuthUser: Account;
    let student: Student;
    let studentAuthUser: Account;
    let fieldOfStudy = { semesterType: "SS", year: "2020", fos: "Bachelor Computer Science v3" };
    let adminAuth: Account;
    let lecturerAuth: Account;
    let course: Course;
    let usersWithAuth: UserWithAuth[] = [];

    let op1Id = "";
    let op1IdShort = "";

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
                cy.fixture("admin.json").then((a) => {
                    (a as Admin).username += random;
                    admin = a as Admin;
                });
            })
            .then(() => {
                cy.fixture("adminAuthUser.json").then((a) => {
                    (a as Admin).username += random;
                    adminAuthUser = a as Account;
                    let governmentId = getRandomizedGovernmentId();
                    usersWithAuth.push({ governmentId, userInfo: admin, auth: adminAuthUser });
                });
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
        getMachineUserAuth(adminAuth).then(() => {
            deleteCourses([course]);
            deleteUsers([studentAuthUser], adminAuth);
        });
        logout();
    });

    it("Login as student", () => {
        loginAsUser(studentAuthUser);
    });

    it("Navigate to settings page", () => {
        navigateToImmatriculationPage();
        cy.wait(9000);
    });

    it("Check matriculation history is empty", function () {
        cy.get("div").contains("There is no matriculation data yet!");
    });

    it("Add two fields of studies for one summer semester", function () {
        cy.get("select[id=semesterType]").select(fieldOfStudy.semesterType);
        cy.get("select[id=semesterYear]").select(fieldOfStudy.year);
        cy.get("select[id=fieldsOfStudy-1]").select(fieldOfStudy.fos);
        cy.get("button[id=addImmatriculationData]").click();
        cy.wait(2000);
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
    });

    //TODO What happens if we cancel here?
    it("Decryption modal shown", () => {
        cy.get("input[id='enterDecryptionPassword']").type(studentAuthUser.password);
        cy.get("button[id='decryptPrivateKeyModalConfirm']").click();
        cy.wait(5000);
    });

    it("Get operation-IDs", () => {
        cy.wait(15000).then(async () => {
            await getMachineUserAuth(studentAuthUser);

            const operationManagement = new OperationManagement();
            let response = await operationManagement.getOperations(true, undefined, undefined, true);

            let ops = response.returnValue;
            console.log(ops);
            for (var op of ops) {
                console.log(op.operationId);
                if (op.transactionInfo.parameters.includes(fieldOfStudy.year)) {
                    op1Id = op.operationId;
                    op1IdShort = op1Id.substring(0, 4);
                }
            }
            expect(op1IdShort).to.not.equal("");
        });
    });

    it("Create certificate for admin", () => {
        logout();
        loginAsUser(adminAuthUser);
        cy.wait(2000);
        cy.get("button[id='createCertificate']").click();
        cy.wait(2000);
        const encryptionPassword = adminAuthUser.password;
        cy.get("input[id='enterEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("input[id='confirmEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("button[id='encryptPrivateKeyModalConfirm']").click();
        cy.wait(15000);
    });

    it("Approve first operation", () => {
        cy.get("div[id='dashboard_actionRequired']").get(`div[id='op_${op1IdShort}']`).get(`button[id='op_approve_${op1IdShort}']`).click();

        cy.get("input[id='enterDecryptionPassword']").type(adminAuthUser.password);
        cy.get("button[id='decryptPrivateKeyModalConfirm']").click();
        cy.wait(8000);

        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op1IdShort}']`)
            .get(`button[id='op_approve_${op1IdShort}']`)
            .should("be.disabled");
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op1IdShort}']`)
            .get(`button[id='op_startRejection_${op1IdShort}']`)
            .should("not.be.visible");
        logout();
    });

    it("Admitted Courses Page should be empty", () => {
        loginAsUser(studentAuthUser);
        navigateToAdmittedCourses();
        //Call on chain to get admissions
        cy.wait(5000);
        cy.get("div").contains(course.courseName).should("not.exist");
    });

    it("Navigate to available courses", () => {
        navigateToCourseListStudent();
        //Call on chain to get admissions
        cy.wait(5000);
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
        cy.get("input[id='selectModule']").click();
        for (let m of course.moduleIds) {
            cy.get("div").contains(m).should("exist");
        }
    });

    it("Select a module and join the course", () => {
        cy.get("input[id='selectModule']").clear().type(course.moduleIds[0]);
        cy.get("div[id='selectModule_options']").click();
        cy.get("button[id='joinCourse']").click();
    });

    it("Decryption modal shown", () => {
        cy.get("input[id='enterDecryptionPassword']").type(studentAuthUser.password);
        cy.get("button[id='decryptPrivateKeyModalConfirm']").click();

        //Call on chain (add admission + get admissions on course list)
        cy.wait(15000);
    });

    it("Course is flagged with admitted", () => {
        cy.url().should("contain", "courses");
        cy.get("div").contains(course.courseName).parent().should("contain", "registered");
    });

    it("Admitted courses list contains course", () => {
        navigateToAdmittedCourses();
        cy.wait(8000);
        cy.get("div").contains(course.courseName).should("exist");
    });

    it("Dropping course works", () => {
        cy.get("div").contains(course.courseName).click();
        cy.url().should("contain", "drop");
        //Call on chain to get admissions
        cy.wait(10000);

        cy.get("button[id='dropCourse']").click();

        //Call on chain (add admission + get admissions on course list)
        cy.get("input[id='enterDecryptionPassword']").type(studentAuthUser.password);
        cy.get("button[id='decryptPrivateKeyModalConfirm']").click();
        cy.wait(15000);
        cy.get("div").contains(course.courseName).should("not.exist");
    });
});
