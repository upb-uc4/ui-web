import Lecturer from "@/api/api_models/user_management/Lecturer";
import Student from "@/api/api_models/user_management/Student";
import { Account } from "@/entities/Account";
import { Country } from "@/entities/Country";
import { paths } from "@/use/router/paths";
import { getMachineUserAuth, loginAsUser, logout } from "./helpers/AuthHelper";
import { navigateToPrivateProfile } from "./helpers/NavigationHelper";
import { createUsers, deleteUsers, getRandomMatriculationId } from "./helpers/UserHelper";
import { UserWithAuth } from "./helpers/UserWithAuth";

describe("Change Profile Information", () => {
    const random = Math.floor(Math.random() * 9999);

    let student: Student;
    let studentAuthUser: Account;
    let lecturer: Lecturer;
    let lecturerAuthUser: Account;
    let adminAuth: Account;

    let usersWithAuth: UserWithAuth[] = [];

    before(() => {
        cy.clearCookies();
        Cypress.Cookies.defaults({
            preserve: ["refresh", "login"],
        });

        cy.fixture("student.json")
            .then((s) => {
                (s as Student).username += random;
                student = s as Student;
                student.matriculationId = getRandomMatriculationId();
            })
            .then(() => {
                cy.fixture("studentAuthUser.json").then((s) => {
                    (s as Account).username += random;
                    studentAuthUser = s as Account;
                    usersWithAuth.push({ userInfo: student, auth: studentAuthUser });
                });
            })
            .then(() => {
                cy.fixture("lecturer.json").then((l) => {
                    (l as Student).username += random;
                    lecturer = l as Lecturer;
                });
            })
            .then(() => {
                cy.fixture("lecturerAuthUser.json").then((l) => {
                    (l as Account).username += random;
                    lecturerAuthUser = l as Account;
                    usersWithAuth.push({ userInfo: lecturer, auth: lecturerAuthUser });
                });
            })
            .then(() => {
                cy.fixture("logins/admin.json").then((admin) => {
                    adminAuth = admin;
                });
            })
            .then(async () => {
                await getMachineUserAuth(adminAuth);
            })
            .then(async () => {
                await createUsers(usersWithAuth);
            })
            .then(() => {
                console.log("Setup finished");
            });
    });

    after(() => {
        deleteUsers([studentAuthUser, lecturerAuthUser], adminAuth);
        logout();
    });

    it("Login with new student account", () => {
        loginAsUser(studentAuthUser);
    });

    it("Navigate to private profile", () => {
        navigateToPrivateProfile();
    });

    //TODO check if right default information is shown when testdata is given
    it("Check personal information section", () => {
        cy.get("input[id='firstName']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='lastName']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='birthDate']").invoke("attr", "readonly").should("exist");
    });

    it("Check contact information section", () => {
        cy.get("input[id='email']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='phoneNumber']").invoke("attr", "readonly").should("exist");
    });

    it("Validation errors for contact section are shown correctly", () => {
        cy.get("button[id='editContact']").click();
        cy.get("input[id='email']").clear().type("test");
        cy.get("input[id='phoneNumber']").clear().type("test");
        cy.get("button[id='saveContact']").click();
        cy.get("input[id='email']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='phoneNumber']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='email']").clear();
        cy.get("input[id='phoneNumber']").clear();
    });

    it("Reset contacts inputs on cancel", () => {
        cy.get("button[id='cancelEditContact']").click();
        cy.get("input[id='email']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='phoneNumber']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='email']").should("not.contain", "test");
        cy.get("input[id='email']").should("have.value", student.email);
        cy.get("input[id='phoneNumber']").should("not.contain", "test");
        cy.get("input[id='phoneNumber']").should("have.value", student.phoneNumber);
    });

    it("Change contact information", () => {
        cy.get("button[id='editContact']").click();
        // TODO this is not a correct tdl!
        student.email += "a";
        cy.get("input[id='email']").clear().type(student.email);
        student.phoneNumber += "1";
        cy.get("input[id='phoneNumber']").clear().type(student.phoneNumber);
        cy.get("button[id='saveContact']").click();
        cy.get("input[id='email']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='phoneNumber']").invoke("attr", "readonly").should("exist");
    });

    it("Check address information section", () => {
        cy.get("select[id='country']").should("be.disabled");
        cy.get("input[id='city']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='zipCode']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='street']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='houseNumber']").invoke("attr", "readonly").should("exist");
    });

    it("Validation errors for address information section are shown correctly", () => {
        cy.get("button[id='editAddress']").click();
        cy.get("input[id='city']").clear().type("/");
        cy.get("input[id='zipCode']").clear().type("/");
        cy.get("input[id='street']").clear().type("/");
        cy.get("input[id='houseNumber']").clear().type("/");
        cy.get("button[id='saveAddress']").click();
        cy.get("input[id='city']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='zipCode']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='street']").siblings().get("p").should("have.class", "error-message");
        cy.get("input[id='houseNumber']").siblings().get("p").should("have.class", "error-message");
    });

    it("Reset address inputs on cancel", () => {
        let c: Country;
        if (student.address.country != Country.AUSTRIA) {
            c = Country.AUSTRIA;
        } else {
            c = Country.BELGIUM;
        }
        cy.get("select[id='country']").select(c);
        cy.get("button[id='cancelEditAddress']").click();
        cy.get("select[id='country']").should("be.disabled");
        cy.get("input[id='city']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='zipCode']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='street']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='houseNumber']").invoke("attr", "readonly").should("exist");
        cy.get("select[id='country']").should("have.value", student.address.country);
        cy.get("input[id='city']").should("have.value", student.address.city);
        cy.get("input[id='zipCode']").should("have.value", student.address.zipCode);
        cy.get("input[id='street']").should("have.value", student.address.street);
        cy.get("input[id='houseNumber']").should("have.value", student.address.houseNumber);
    });

    it("Change address information", () => {
        cy.get("button[id='editAddress']").click();
        if (student.address.country != Country.AUSTRIA) {
            student.address.country = Country.AUSTRIA;
        } else {
            student.address.country = Country.BELGIUM;
        }
        cy.get("select[id='country']").select(student.address.country);
        student.address.city += "a";
        cy.get("input[id='city']").clear().type(student.address.city);
        student.address.zipCode = "12345";
        cy.get("input[id='zipCode']").clear().type(student.address.zipCode);
        student.address.street += "a";
        cy.get("input[id='street']").clear().type(student.address.street);
        student.address.houseNumber = "12345b";
        cy.get("input[id='houseNumber']").clear().type(student.address.houseNumber);
        cy.get("button[id='saveAddress']").click();
        cy.get("select[id='country']").should("be.disabled");
        cy.get("input[id='city']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='zipCode']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='street']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='houseNumber']").invoke("attr", "readonly").should("exist");
    });

    it("Check course of study information section", () => {
        cy.get("input[id='matriculationId']").invoke("attr", "readonly").should("exist");
    });

    it("Refresh", () => {
        cy.reload();
        cy.url().should("contain", paths.PRIVATE_PROFILE);
    });

    it("Check changed information", () => {
        cy.get("input[id='email']").should("have.value", student.email);
        cy.get("input[id='phoneNumber']").should("have.value", student.phoneNumber);
        cy.get("select[id='country']").should("have.value", student.address.country);
        cy.get("input[id='city']").should("have.value", student.address.city);
        cy.get("input[id='zipCode']").should("have.value", student.address.zipCode);
        cy.get("input[id='street']").should("have.value", student.address.street);
        cy.get("input[id='houseNumber']").should("have.value", student.address.houseNumber);
    });

    it("Login with new lecturer account", () => {
        logout();
        loginAsUser(lecturerAuthUser);
        navigateToPrivateProfile();
    });

    it("Check research area information section", () => {
        cy.get("textarea[id='researchArea']").invoke("attr", "readonly").should("exist");
        cy.get("textarea[id='description']").invoke("attr", "readonly").should("exist");
    });

    it("Validation errors for research area information section are shown correctly", () => {
        cy.get("button[id='editResearchArea']").click();
        cy.get("textarea[id='researchArea']").invoke("val", "1".repeat(201)).trigger("input");
        cy.get("textarea[id='description']").invoke("val", "1".repeat(10001)).trigger("input");
        cy.get("button[id='saveResearchArea']").click();
        cy.get("textarea[id='researchArea']").siblings().get("p").should("have.class", "error-message");
        cy.get("textarea[id='description']").siblings().get("p").should("have.class", "error-message");
    });

    it("Reset research area inputs on cancel", () => {
        cy.get("button[id='cancelEditResearchArea']").click();
        cy.get("textarea[id='researchArea']").invoke("attr", "readonly").should("exist");
        cy.get("textarea[id='description']").invoke("attr", "readonly").should("exist");
        cy.get("textarea[id='researchArea']").should("have.value", lecturer.researchArea);
        cy.get("textarea[id='description']").should("have.value", lecturer.freeText);
    });

    it("Change research area information", () => {
        cy.get("button[id='editResearchArea']").click();
        lecturer.researchArea += " new";
        lecturer.freeText += " new";
        cy.get("textarea[id='researchArea']").clear().type(lecturer.researchArea);
        cy.get("textarea[id='description']").clear().type(lecturer.freeText);
        cy.get("button[id='saveResearchArea']").click();
        cy.get("textarea[id='researchArea']").invoke("attr", "readonly").should("exist");
        cy.get("textarea[id='description']").invoke("attr", "readonly").should("exist");
    });

    it("Refresh", () => {
        cy.reload();
        cy.url().should("contain", paths.PRIVATE_PROFILE);
    });

    it("Check changed information", () => {
        cy.get("textarea[id='researchArea']").should("have.value", lecturer.researchArea);
        cy.get("textarea[id='description']").should("have.value", lecturer.freeText);
    });
});
