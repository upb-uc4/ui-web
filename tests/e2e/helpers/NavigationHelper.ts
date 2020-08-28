export function navigateToAccountList() {
    cy.get("div[id='menu_manageAccounts']").children().eq(1).should("not.be.visible");
    cy.get("div[id='menu_manageAccounts']").trigger("mouseover");
    cy.get("div[id='menu_manageAccounts']").children().eq(1).get("span").contains("All Users").should("be.visible");
    cy.get("div[id='menu_manageAccounts']").children().eq(1).get("a").contains("All Users").click();
    cy.get("div[id='menu_manageAccounts']").trigger("mouseleave");
}

export function navigateToAccountForm() {
    cy.get("div[id='menu_manageAccounts']").children().eq(1).should("not.be.visible");
    cy.get("div[id='menu_manageAccounts']").trigger("mouseover");
    cy.get("div[id='menu_manageAccounts']").children().eq(1).get("span").contains("New Account").should("be.visible");
    cy.get("div[id='menu_manageAccounts']").children().eq(1).get("a").contains("New Account").click();
    cy.get("div[id='menu_manageAccounts']").trigger("mouseleave");
    cy.url().should("contain", "/createAccount");
}

export function navigateToCourseList() {
    cy.get("div[id='menu_courses']").children().eq(1).should("not.be.visible");
    cy.get("div[id='menu_courses']").parents().eq(1).trigger("mouseover");
    cy.get("div[id='menu_courses']").children().eq(1).get("span").contains("My Courses").should("be.visible");
    cy.get("div[id='menu_courses']").children().eq(1).get("a").contains("My Courses").click();
    cy.get("div[id='menu_courses']").trigger("mouseleave");
    cy.url().should("contain", "course-management");
}

export function navigateToSettingsPage() {
    cy.get("div[id='menu_profile']").children().eq(1).should("not.be.visible");
    cy.get("div[id='menu_profile']").trigger("mouseover");
    cy.get("div[id='menu_profile']").children().eq(1).get("span").contains("Settings").should("be.visible");
    cy.get("div[id='menu_profile']").children().eq(1).get("a").contains("Settings").click();
    cy.get("div[id='menu_profile']").trigger("mouseleave");
    cy.url().should("contain", "/settings");
}

export function navigateToPrivateProfile() {
    cy.get("div[id='menu_profile']").children().eq(1).should("not.be.visible");
    cy.get("div[id='menu_profile']").trigger("mouseover");
    cy.get("div[id='menu_profile']").children().eq(1).get("span").contains("Profile").should("be.visible");
    cy.get("div[id='menu_profile']").children().eq(1).get("a").contains("Profile").click();
    cy.get("div[id='menu_profile']").trigger("mouseleave");
    cy.url().should("contain", "/profile");
}
