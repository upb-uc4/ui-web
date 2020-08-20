describe("Change Profile Information", () => {
    const random = Math.floor(Math.random() * 500);
    const studentUsername = "cy-student" + random;
    const newCountry = "United States";
    const newStreet = "test-street-cypress-updated";
    const newHouseNumber = "1ab";
    const newZipCode = "54321";
    const newCity = "test-city-cypress-updated";
    const newEmail = "updated@valid.de";
    

    it("Login as admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("admin");
        cy.get("input[id='password']").type("admin");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Show new account page", () => {
        cy.get("div[id='menu_manageAccounts']").trigger("mouseover");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("a").contains("New Account").click();
        cy.get("div[id='menu_manageAccounts']").trigger("mouseleave");
        cy.url().should("contain", "/createAccount");
    });

    it("Create account works", () => {
        cy.get("input[type='radio']").eq(2).click();
        cy.get("input[id='userName']").type(studentUsername);
        cy.get("input[id='password']").type("test-password-cypress");
        cy.get('select[id="country"]').select("Germany");
        cy.get("input[id='firstName']").type("firstName");
        cy.get("input[id='lastName']").type("lastName");
        cy.get("input[id='street']").type("test-street-cypress");
        cy.get("input[id='houseNumber']").type("1a");
        cy.get("input[id='zipCode']").type("12345");
        cy.get("input[id='city']").type("test-city-cypress");
        cy.get("select[id='day']").select("15");
        cy.get("select[id='month']").select("November");
        cy.get("select[id='year']").select("1996");
        cy.get("input[id='email']").clear().type("valid@valid.de");
        cy.get("input[id='matriculationId']").type("1234567");
        cy.get("input[id='semesterCount']").clear().type("1");

        cy.get("button").contains("Create Account").click();
        cy.wait(300);
    });

    it("Login with new student account", () => {
        cy.visit("/");
        cy.get("input[id='email']").type(studentUsername);
        cy.get("input[id='password']").type("test-password-cypress");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");        
    });

    it("Navigate to private profile", () => {
        cy.get("div[id='menu_profile']").children().eq(1).should("not.be.visible");
        cy.get("div[id='menu_profile']").trigger("mouseover");
        cy.get("div[id='menu_profile']").children().eq(1).get("span").contains("Profile").should("be.visible");
        cy.get("div[id='menu_profile']").children().eq(1).get("a").contains("Profile").click();
        cy.get("div[id='menu_profile']").trigger("mouseleave");
        cy.url().should("contain", "/profile");
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

    it("Reset contacts inputs on cancel", () => {
        cy.get("button[id='editContact']").click();
        cy.get("input[id='email']").clear().type("test");
        //TODO include as soon as phone number is supported by API
        //cy.get("input[id='phoneNumber']").should("be.enabled");
        cy.get("button[id='cancelEditContact']").click();
        cy.get("input[id='email']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='phoneNumber']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='email']").should("have.value", "valid@valid.de");
    })

    it("Change contact information", () => {
        cy.get("button[id='editContact']").click();
        cy.get("input[id='email']").clear().type(newEmail);
        cy.get("button[id='saveContact']").click();
        cy.get("input[id='email']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='phoneNumber']").invoke("attr", "readonly").should("exist");
    })

    it("Check address information section", () => {
        cy.get("select[id='country']").should("be.disabled");
        cy.get("input[id='city']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='zipCode']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='street']").invoke("attr", "readonly").should("exist");
    });

    it("Reset address inputs on cancel", () => {
        cy.get("button[id='editAddress']").click();
        cy.get("select[id='country']").select("United States");
        cy.get("input[id='city']").clear().type("test");
        cy.get("input[id='zipCode']").clear().type("test");
        cy.get("input[id='street']").clear().type("test");
        cy.get("button[id='cancelEditAddress']").click();
        cy.get("select[id='country']").should("be.disabled");
        cy.get("input[id='city']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='zipCode']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='street']").invoke("attr", "readonly").should("exist");
        cy.get("select[id='country']").should("have.value", "Germany")
        cy.get("input[id='city']").should("have.value", "test-city-cypress");
        cy.get("input[id='zipCode']").should("have.value", "test-city-cypress");
        cy.get("input[id='street']").should("have.value", "test-street-cypress");
    })

    it("Change address information", () => {
        cy.get("button[id='editAddress']").click();
        cy.get("select[id='country']").select(newCountry);
        cy.get("input[id='city']").clear().type(newCity);
        cy.get("input[id='zipCode']").clear().type(newZipCode);
        cy.get("input[id='street']").clear().type(newStreet);
        cy.get("button[id='saveAddress']").click();
        cy.get("select[id='country']").should("be.disabled");
        cy.get("input[id='city']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='zipCode']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='street']").invoke("attr", "readonly").should("exist");
    })

    it("Check course of study information section", () => {
        cy.get("input[id='matriculationId']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='degreeSought']").invoke("attr", "readonly").should("exist");
        cy.get("input[id='semesterCount']").invoke("attr", "readonly").should("exist");
    })

    it("Refresh", () => {
        cy.reload();
        cy.get("input[id='loginModalEmail']").type(studentUsername);
        cy.get("input[id='loginModalPassword']").type("test-password-cypress");
        cy.get("button[id='loginModalConfirm']").click();
        cy.url().should("contain", "/profile");
    });

    it("Check changed information", () => {
        cy.get("input[id='email']").should("have.value", newEmail);
        cy.get("select[id='country']").should("have.value", newCountry);
        cy.get("input[id='city']").should("have.value", newCity);
        cy.get("input[id='zipCode']").should("have.value", newZipCode);
        cy.get("input[id='street']").should("have.value", newStreet);
    });

    it("Login as admin", () => {
        cy.visit("/");
        cy.get("input[id='email']").type("admin");
        cy.get("input[id='password']").type("admin");
        cy.get('button[id="login"]').click();
        cy.url().should("contain", "welcome");
    });

    it("Delete account", () => {
        cy.get("div[id='menu_manageAccounts']").trigger("mouseover");
        cy.get("div[id='menu_manageAccounts']").children().eq(1).get("a").contains("All Users").click();
        cy.get("div[id='menu_manageAccounts']").trigger("mouseleave");

        cy.get(`div[id='user_${studentUsername}']`).click();
        cy.wait(100);
        cy.get("button[id='deleteAccount']").click();
        cy.wait(100);
        // show modal
        cy.get("#modal-wrapper").should("exist");
        cy.get("div").contains("Are you sure you want to delete this account").should("exist");
        // cancel
        cy.wait(100);
        cy.get('button[id="deleteAccountModalDelete"]').click();
    });
})