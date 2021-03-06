import Admin from "@/api/api_models/user_management/Admin";
import Student from "@/api/api_models/user_management/Student";
import OperationManagement from "@/api/OperationManagement";
import { Account } from "@/entities/Account";
import { getMachineUserAuth, loginAsDefaultAdmin, loginAsUser, logout } from "./helpers/AuthHelper";
import {
    navigateToAllOperationsPage,
    navigateToImmatriculationPage,
    navigateToPrivateProfile,
    navigateToWelcomePage,
} from "./helpers/NavigationHelper";
import { createUsers, deleteUsers, getRandomizedGovernmentId, getRandomMatriculationId } from "./helpers/UserHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";

const random = Math.floor(Math.random() * 9999);
let admin: Admin;
let adminAuthUser: Account;
let student: Student;
let studentAuthUser: Account;
let adminAuth: Account;
let studentAuth: Account;
let usersWithAuth: UserWithAuth[] = [];

let op1Id = "";
let op1IdShort = "";
let op2Id = "";
let op2IdShort = "";

let rejectReason = "test reason";

let fieldOfStudy = [
    { semesterType: "SS", year: "2020", fos: ["Bachelor Computer Science v3", "Bachelor Computer Science v4"] },
    { semesterType: "WS", year: "2019/20", fos: ["Bachelor Computer Science v3"] },
];

describe("Account creation, edition and deletion", function () {
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
            .then(async () => {
                await createUsers(usersWithAuth);
            })
            .then(() => {
                console.log("Setup finished");
            });
    });

    after(() => {
        getMachineUserAuth(adminAuth).then(() => {
            deleteUsers([studentAuthUser], adminAuth);
        });
        logout();
    });

    it("Login as admin", () => {
        loginAsDefaultAdmin();
    });

    it("Check matriculation history empty in student's account", () => {
        cy.visit(`editAccount/${student.username}`);
        cy.get("div").contains("There is no matriculation data yet!");
        logout();
    });

    it("Login as student", () => {
        loginAsUser(studentAuthUser);
    });

    it("Navigate to settings page", () => {
        navigateToImmatriculationPage();
    });

    it("Check matriculation history is empty", function () {
        cy.get("div").contains("There is no matriculation data yet!");
    });

    it("Valid FoS selection can be resetted ", function () {
        cy.get("button[id='immatriculationSelectSemesterCycle']").click();
        cy.get("li").contains(fieldOfStudy[0].semesterType).click();
        cy.get("button[id='immatriculationSelectSemesterYear']").click();
        cy.get("li").contains(fieldOfStudy[0].year).click();
        cy.get("input[id='searchSelectFieldsOfStudy']").click();
        cy.get("div").contains(fieldOfStudy[0].fos[0]).click();
        cy.get(`i[id='remove_${fieldOfStudy[0].fos[0]}']`).click();
        cy.get(`i[id='remove_${fieldOfStudy[0].fos[0]}']`).should("not.exist");
    });

    it("Add two fields of studies for one summer semester", function () {
        cy.get("button[id='immatriculationSelectSemesterCycle']").click();
        cy.get("li").contains(fieldOfStudy[0].semesterType).click();
        cy.get("button[id='immatriculationSelectSemesterYear']").click();
        cy.get("li").contains(fieldOfStudy[0].year).click();
        cy.get("input[id='searchSelectFieldsOfStudy']").click();
        cy.get("div").contains(fieldOfStudy[0].fos[0]).click();
        cy.get("input[id='searchSelectFieldsOfStudy']").click();
        cy.get("div").contains(fieldOfStudy[0].fos[1]).click();
        cy.get("button[id=addImmatriculationData]").click();
        cy.wait(2000);
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
        cy.get("button[id='addImmatriculationData']").click();
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

    it("Add a field of study for one winter semester", function () {
        cy.get("button[id='immatriculationSelectSemesterCycle']").click();
        cy.get("li").contains(fieldOfStudy[1].semesterType).click();
        cy.get("button[id='immatriculationSelectSemesterYear']").click();
        cy.get("li").contains(fieldOfStudy[1].year).click();
        cy.get("input[id='searchSelectFieldsOfStudy']").click();
        cy.get("div").contains(fieldOfStudy[1].fos[0]).click();
        cy.get("button[id=addImmatriculationData]").click();
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
                if (op.transactionInfo.parameters.includes(fieldOfStudy[0].year)) {
                    op1Id = op.operationId;
                    op1IdShort = op1Id.substring(0, 4);
                } else if (op.transactionInfo.parameters.includes(fieldOfStudy[1].year)) {
                    op2Id = op.operationId;
                    op2IdShort = op2Id.substring(0, 4);
                }
            }
            expect(op1IdShort).to.not.equal("");
            expect(op2IdShort).to.not.equal("");
        });
    });

    it("Operations correctly shown in student's dashboard", () => {
        navigateToWelcomePage();
        cy.wait(15000);
        cy.get("div[id='dashboard_pending']").get(`div[id='op_${op1IdShort}']`).click();
        cy.get("div[id='dashboard_pending']")
            .get(`div[id='op_${op1IdShort}']`)
            .should("contain", fieldOfStudy[0].year)
            .and("contain", fieldOfStudy[0].fos[0])
            .and("contain", fieldOfStudy[0].fos[1]);
        cy.get("div[id='dashboard_pending']").get(`div[id='op_${op2IdShort}']`).click();
        cy.get("div[id='dashboard_pending']")
            .get(`div[id='op_${op2IdShort}']`)
            .should("contain", fieldOfStudy[1].year)
            .and("contain", fieldOfStudy[1].fos[0]);
        logout();
    });

    it("Cancelling certificate creation does not result in displaying the board", () => {
        loginAsUser(adminAuthUser);
        cy.wait(2000);
        cy.get("button[id='createCertificate']").click();
        cy.wait(2000);
        cy.get("button[id='encryptPrivateKeyModalConfirm']").click();
        cy.get("button[id='createCertificate']").should("exist");
    });

    it("Create certificate for admin", () => {
        cy.get("button[id='createCertificate']").click();
        cy.wait(2000);
        const encryptionPassword = adminAuthUser.password;
        cy.get("input[id='enterEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("input[id='confirmEncryptionPassword']").clear().type(encryptionPassword);
        cy.get("button[id='encryptPrivateKeyModalConfirm']").click();
        cy.wait(15000);
    });

    it("Operations correctly shown in admin's dashboard", () => {
        cy.get("div[id='dashboard_actionRequired']").get(`div[id='op_${op1IdShort}']`).click();
        cy.get("div[id='dashboard_actionRequired']").get(`div[id='op_${op1IdShort}']`).should("contain", student.username);
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op1IdShort}']`)
            .should("contain", fieldOfStudy[0].year)
            .and("contain", fieldOfStudy[0].fos[0])
            .and("contain", fieldOfStudy[0].fos[1]);
        cy.get("div[id='dashboard_actionRequired']").get(`div[id='op_${op2IdShort}']`).click();
        cy.get("div[id='dashboard_actionRequired']").get(`div[id='op_${op2IdShort}']`).should("contain", student.username);
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op2IdShort}']`)
            .should("contain", fieldOfStudy[1].year)
            .and("contain", fieldOfStudy[1].fos[0]);
    });

    it("Transfer operations to watchlist works", () => {
        cy.get(`i[id='op_watch_${op1IdShort}']`).should("exist");
        cy.get(`i[id='op_watch_${op2IdShort}']`).click();
        cy.wait(1000);
        cy.get(`i[id='op_unwatch_${op2IdShort}']`).should("exist");

        navigateToAllOperationsPage();

        cy.wait(15000);

        cy.get(`i[id='op_watch_${op1IdShort}']`).click();
        cy.wait(1000);
        cy.get(`i[id='op_unwatch_${op2IdShort}']`).click();
        cy.wait(1000);

        cy.get(`i[id='op_unwatch_${op1IdShort}']`).should("exist");
        cy.get(`i[id='op_watch_${op2IdShort}']`).should("exist");

        navigateToWelcomePage();
        cy.wait(20000);

        cy.get(`i[id='op_unwatch_${op1IdShort}']`).should("exist");
        cy.get(`i[id='op_watch_${op2IdShort}']`).should("exist");
    });

    it("Approve first operation", () => {
        cy.get(`div[id='op_${op1IdShort}']`).get(`button[id='op_approve_${op1IdShort}']`).click();

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
    });

    it("Reject second operation", () => {
        cy.get(`div[id='op_${op2IdShort}']`).get(`button[id='op_startRejection_${op2IdShort}']`).click();
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op2IdShort}']`)
            .get(`select[id='op_select_reject_reason_${op2IdShort}']`)
            .select("Other");
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op2IdShort}']`)
            .get(`input[id='op_written_reject_reason_${op2IdShort}']`)
            .should("exist");
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op2IdShort}']`)
            .get(`button[id='op_cancelRejection_${op2IdShort}']`)
            .click();
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op2IdShort}']`)
            .get(`select[id='op_select_reject_reason_${op2IdShort}']`)
            .should("not.exist");
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op2IdShort}']`)
            .get(`input[id='op_written_reject_reason_${op2IdShort}']`)
            .should("not.exist");
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op2IdShort}']`)
            .get(`button[id='op_startRejection_${op2IdShort}']`)
            .click();
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op2IdShort}']`)
            .get(`select[id='op_select_reject_reason_${op2IdShort}']`)
            .select("Other");
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op2IdShort}']`)
            .get(`button[id='op_reject_${op2IdShort}']`)
            .should("be.disabled");
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op2IdShort}']`)
            .get(`input[id='op_written_reject_reason_${op2IdShort}']`)
            .type(rejectReason);
        cy.get("div[id='dashboard_actionRequired']").get(`div[id='op_${op2IdShort}']`).get(`button[id='op_reject_${op2IdShort}']`).click();
        cy.wait(8000);
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op2IdShort}']`)
            .get(`button[id='op_approve_${op2IdShort}']`)
            .should("not.be.visible");
        cy.get("div[id='dashboard_actionRequired']")
            .get(`div[id='op_${op2IdShort}']`)
            .get(`button[id='op_startRejection_${op2IdShort}']`)
            .should("be.disabled");
    });

    it("Watched operation is shown in finished dashboard", () => {
        cy.get("button[id='refresh']").click();
        cy.wait(10000);

        cy.get("div[id='dashboard_finished']").get(`div[id='op_${op1IdShort}']`).get(`i[id='op_markRead_${op2IdShort}']`).click();
        cy.wait(2000);

        cy.get("div[id='dashboard_finished']").get(`div[id='op_${op1IdShort}']`).should("not.exist");
        logout();
    });

    it("Operations correctly shown in student's dashboard", () => {
        loginAsUser(studentAuthUser);
        cy.wait(15000);

        cy.get("div[id='dashboard_finished']")
            .get(`div[id='op_${op1IdShort}']`)
            .get(`span[id='op_state_${op1IdShort}']`)
            .should("contain", "FINISHED");
        cy.get("div[id='dashboard_finished']")
            .get(`div[id='op_${op2IdShort}']`)
            .get(`span[id='op_state_${op2IdShort}']`)
            .should("contain", "REJECTED");
        cy.get("div[id='dashboard_finished']").get(`div[id='op_${op2IdShort}']`).click();
        cy.get("div[id='dashboard_finished']")
            .get(`div[id='op_${op2IdShort}']`)
            .get(`div[id='op_rejection_reason_${op2IdShort}']`)
            .should("contain", rejectReason);
    });

    it("Unwatching finished operations as student works", () => {
        cy.get("div[id='dashboard_finished']").get(`div[id='op_${op1IdShort}']`).get(`button[id=op_markRead_${op1IdShort}]`).click();
        cy.wait(2000);
        cy.get("div[id='dashboard_finished']").get(`div[id='op_${op2IdShort}']`).get(`button[id=op_markRead_${op2IdShort}]`).click();
        cy.wait(2000);

        cy.get("div[id='dashboard_finished']").get(`div[id='op_${op1IdShort}']`).should("not.exist");
        cy.get("div[id='dashboard_finished']").get(`div[id='op_${op2IdShort}']`).should("not.exist");
    });

    //AFTER OPERATION
    it("Correct immatriculation entries are shown", () => {
        navigateToImmatriculationPage();
        //No modal should be shown
        cy.get("div").should("contain", fieldOfStudy[0].year).and("contain", fieldOfStudy[0].fos[0]).and("contain", fieldOfStudy[0].fos[1]);
    });

    // latest immatriculation is currently bugged because lagom does not fill the user object
    it.skip("Check latest matriculation  in private profile", () => {
        navigateToPrivateProfile();
        cy.get("div").contains("Latest Immatriculation");
        cy.get("input[id=latestImmatriculation]").should("have.value", `${fieldOfStudy[0].semesterType}${fieldOfStudy[0].year}`);
        cy.get("button[id=showHistoryButton]").click();
    });

    it.skip("Check matriculation modal is filled correctly in privateprofile", function () {
        //Timeout needed for waiting for the data
        cy.wait(8000);
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Immatriculation History");
        cy.get("div")
            .should("contain", `${fieldOfStudy[0].semesterType}${fieldOfStudy[0].year}`)
            .and("contain", fieldOfStudy[0].fos[0])
            .and("contain", fieldOfStudy[0].fos[1]);

        cy.get("button[id='immatriculationHistoryClose']").click();
        cy.wait(100);
        logout();
    });

    // This test may be removed as the same component is tested again
    it("Check matriculation table filled correctly in account form", function () {
        logout(); // this line needs to be deleted as soon as the tests prior to this one are readded
        loginAsDefaultAdmin();
        cy.visit(`editAccount/${student.username}`);
        //Timeout needed for waiting for the data
        cy.wait(8000);
        cy.get("div").contains("Immatriculation History");
        cy.get("div")
            .should("contain", `${fieldOfStudy[0].semesterType}${fieldOfStudy[0].year}`)
            .and("contain", fieldOfStudy[0].fos[0])
            .and("contain", fieldOfStudy[0].fos[1]);
    });
});
