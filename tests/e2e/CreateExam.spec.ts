import Course from "@/api/api_models/course_management/Course";
import Admin from "@/api/api_models/user_management/Admin";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import OperationManagement from "@/api/OperationManagement";
import { Account } from "@/entities/Account";
import { months } from "@/entities/Month";
import { dateFormatOptions } from "@/use/helpers/DateFormatOptions";
import numberZeroPad from "@/use/helpers/NumberToZeroPaddedString";
import { CourseType } from "tests/fixtures/CourseType";
import { getMachineUserAuth, loginAsUser, logout } from "./helpers/AuthHelper";
import { createCourse } from "./helpers/CourseHelper";
import { navigateToExamList } from "./helpers/NavigationHelper";
import { createUsers, deleteUsers, getRandomizedGovernmentId, getRandomMatriculationId } from "./helpers/UserHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";

const random = Math.floor(Math.random() * 9999);
let admin: Admin;
let adminAuthUser: Account;
let student: Student;
let studentAuthUser: Account;
let lecturer: Lecturer;
let lecturerAuthUser: Account;
let adminAuth: Account;
let studentAuth: Account;
let usersWithAuth: UserWithAuth[] = [];

let course: Course;

let examDate: Date;
let admittableUntilDate: Date;
let droppableUntilDate: Date;

let examDateOffsetInSeconds = 120;

let opId = "";
let opIdShort = "";

let ects = 42;

describe.skip("Account creation, edition and deletion", function () {
    before(function () {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });

        cy.fixture("logins/admin.json")
            .then((ad) => {
                adminAuth = ad;
            })
            .then(async () => {
                await getMachineUserAuth(adminAuth);
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
                cy.fixture("student.json").then((s) => {
                    (s as Student).username += random;
                    student = s as Student;
                    student.matriculationId = getRandomMatriculationId();
                });
            })
            .then(() => {
                cy.fixture("studentAuthUser.json").then((s) => {
                    (s as Account).username += random;
                    studentAuthUser = s as Account;
                    let governmentId = getRandomizedGovernmentId();
                    usersWithAuth.push({ governmentId, userInfo: student, auth: studentAuthUser });
                });
            })
            .then(() => {
                cy.fixture("lecturer.json").then((l) => {
                    (l as Lecturer).username += random;
                    lecturer = l as Lecturer;
                });
            })
            .then(() => {
                cy.fixture("lecturerAuthUser.json").then((l) => {
                    (l as Account).username += random;
                    lecturerAuthUser = l as Account;
                    let governmentId = getRandomizedGovernmentId();
                    usersWithAuth.push({ governmentId, userInfo: lecturer, auth: lecturerAuthUser });
                });
            })
            .then(() => {
                cy.fixture("course.jsom").then((c) => {
                    course = { ...(c as Course) };
                    course.courseName += random;
                    course.lecturerId = lecturer.username;
                    course.courseType = CourseType.LECTURE;
                });
            })
            .then(async () => {
                await createUsers(usersWithAuth);
            })
            .then(async () => {
                await createCourse(course);
            })
            .then(() => {
                console.log("Setup finished");
            });
    });

    after(() => {
        getMachineUserAuth(adminAuth).then(() => {
            deleteUsers([studentAuthUser, adminAuthUser, lecturerAuthUser], adminAuth);
        });
        logout();
    });

    it("Login as lecturer", () => {
        loginAsUser(lecturerAuthUser);
    });

    it("Navigate to exam list", () => {
        navigateToExamList();
    });

    it("Open create exam view via button", function () {
        cy.get("a[id='addExam']").click();
        cy.url().should("contain", "create-exam");
    });

    it("Enter exam information", () => {
        cy.get("button[id='createExam']").should("be.disabled");
        cy.get("button[id='select_course']").click();
        cy.get("span").contains(course.courseName).click();

        cy.get("button[id='select_module']").click();
        cy.get("span").contains(course.moduleIds[0]).click();

        cy.get("input[id=ects]").clear().type(`${ects}`);

        examDate = new Date();
        examDate.setSeconds(examDate.getSeconds() + examDateOffsetInSeconds);

        admittableUntilDate = examDate;
        admittableUntilDate.setSeconds(admittableUntilDate.getSeconds() - 1);

        droppableUntilDate = examDate;
        droppableUntilDate.setSeconds(droppableUntilDate.getSeconds() - 1);

        //Set exam date
        cy.get("button[id='examDate_day']").click();
        cy.get(`li[id='examDate_dayItem-${examDate.getDay()}']`).click();
        cy.get("button[id='examDate_month']").click();
        cy.get(`li[id='examDate_monthItem-${months[examDate.getMonth() - 1]}']`).click();
        cy.get("button[id='examDate_year']").click();
        cy.get(`li[id='examDate_dayItem-${examDate.getFullYear()}']`).click();
        cy.get("button[id='examDate_hour']").click();
        cy.get(`li[id='examDate_hourItem-${numberZeroPad(examDate.getHours())}']`).click();
        cy.get("button[id='examDate_minutes']").click();
        cy.get(`li[id='examDate_minutesItem-${numberZeroPad(examDate.getMinutes())}']`).click();

        //set deadlines for admission and drop
        cy.get("button[id='admitUntilDate_day']").click();
        cy.get(`li[id='admitUntilDate_dayItem-${admittableUntilDate.getDay()}']`).click();
        cy.get("button[id='admitUntilDate_month']").click();
        cy.get(`li[id='admitUntilDate_monthItem-${months[admittableUntilDate.getMonth() - 1]}']`).click();
        cy.get("button[id='admitUntilDate_year']").click();
        cy.get(`li[id='admitUntilDate_dayItem-${admittableUntilDate.getFullYear()}']`).click();
        cy.get("button[id=admitUntilDate_hour']").click();
        cy.get(`li[id='admitUntilDate_hourItem-${numberZeroPad(admittableUntilDate.getHours())}']`).click();
        cy.get("button[id='admitUntilDate_minutes']").click();
        cy.get(`li[id='admitUntilDate_minutesItem-${numberZeroPad(admittableUntilDate.getMinutes())}']`).click();

        cy.get("button[id='dropUntilDate_day']").click();
        cy.get(`li[id='dropUntilDate_dayItem-${droppableUntilDate.getDay()}']`).click();
        cy.get("button[id='dropUntilDate_month']").click();
        cy.get(`li[id='dropUntilDate_monthItem-${months[droppableUntilDate.getMonth() - 1]}']`).click();
        cy.get("button[id='dropUntilDate_year']").click();
        cy.get(`li[id='dropUntilDate_dayItem-${droppableUntilDate.getFullYear()}']`).click();
        cy.get("button[id='dropUntilDate_hour']").click();
        cy.get(`li[id='dropUntilDate_hourItem-${numberZeroPad(droppableUntilDate.getHours())}']`).click();
        cy.get("button[id='dropUntilDate_minutes']").click();
        cy.get(`li[id='dropUntilDate_minutesItem-${numberZeroPad(droppableUntilDate.getMinutes())}']`).click();

        cy.get("button[id='createExam']").click();
    });

    it("Encryption modal should be shown", () => {
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains(
            "Please choose a password to encrypt your private key, so it can be securely stored on our servers. Ensure that you do not lose this password as it cannot be restored."
        );
    });

    it("Canceling the modal does not result in error", () => {
        cy.get("button[id='encryptPrivateKeyModalCancel']").click();
        cy.get("button[id='encryptPrivateKeyModalCancel']").should("not.be.visible");
        cy.get("button[id='createExam']").click();
    });

    it("Enter encryption password to proceed", () => {
        const encryptionPassword = studentAuthUser.password;
        cy.get("input[id='enterEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("input[id='confirmEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("button[id='encryptPrivateKeyModalConfirm']").click();
    });

    it("Decryption modal shown", () => {
        cy.get("input[id='enterDecryptionPassword']").type(studentAuthUser.password);
        cy.get("button[id='decryptPrivateKeyModalConfirm']").click();
        cy.wait(5000);
    });

    it("Get operation-ID", () => {
        cy.wait(15000).then(async () => {
            await getMachineUserAuth(lecturerAuthUser);

            const operationManagement = new OperationManagement();
            let response = await operationManagement.getOperations(true, undefined, undefined, true);

            let ops = response.returnValue;
            for (var op of ops) {
                if (op.transactionInfo.parameters.includes(course.moduleIds[0])) {
                    opId = op.operationId;
                    opIdShort = opId.substring(0, 4);
                }
            }
            expect(opIdShort).to.not.equal("");
        });
    });

    it("Create certificate for admin", () => {
        loginAsUser(adminAuthUser);
        cy.get("button[id='createCertificate']").click();
        cy.wait(2000);
        const encryptionPassword = adminAuthUser.password;
        cy.get("input[id='enterEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("input[id='confirmEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("button[id='encryptPrivateKeyModalConfirm']").click();
        cy.wait(15000);
    });

    it("Approve operation", () => {
        cy.get(`div[id='op_${opIdShort}']`).get(`button[id='op_approve_${opIdShort}']`).click();

        cy.get("input[id='enterDecryptionPassword']").type(adminAuthUser.password);
        cy.get("button[id='decryptPrivateKeyModalConfirm']").click();
        cy.wait(8000);

        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${opIdShort}']`)
            .get(`button[id='op_approve_${opIdShort}']`)
            .should("be.disabled");
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${opIdShort}']`)
            .get(`button[id='op_startRejection_${opIdShort}']`)
            .should("not.be.visible");
    });

    it("Operations correctly shown in lecturer's dashboard", () => {
        loginAsUser(lecturerAuthUser);
        cy.wait(15000);

        cy.get("div[id='dashboard_finished']")
            .get(`div[id='op_${opIdShort}']`)
            .get(`span[id='op_state_${opIdShort}']`)
            .should("contain", "FINISHED");
    });

    //AFTER OPERATION

    it("Exam shown in lecturer's exam list", () => {
        navigateToExamList();
        cy.wait(5000);
        cy.get("div")
            .contains(`Exam: ${course.courseName}`)
            .should("contain", course.moduleIds[0])
            .and("contain", examDate.toLocaleString("en-GB", dateFormatOptions));
    });
});
