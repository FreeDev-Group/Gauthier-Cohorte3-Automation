describe("Instructor - Create Survey", () => {

    beforeEach(() => {

        cy.loginAsInstructor();

    });

    // ==================================================
    // MS-001
    // ==================================================

    it("MS-001 - should open Dashboard page", () => {

        cy.location("pathname")
            .should("eq", "/wp-admin/");

        cy.contains("Dashboard")
            .should("be.visible");

    });

    // ==================================================
    // MS-002
    // ==================================================

    it("MS-002 - should open Create Survey page", () => {

        cy.openSurveyPage();

        cy.openCreateSurvey();

        cy.contains("Add New Survey")
            .should("be.visible");

    });


    describe("UC - Manage Survey : Create Survey", () => {

    beforeEach(() => {
        cy.loginAsInstructor();
        cy.openSurveyManagement();
    });

    // ====================================================
    // MS-003
    // ====================================================
    it("MS-003 - should open Add New Survey page", () => {

        cy.contains("Add New Survey")
            .click();

        cy.contains("Add New Survey")
            .should("be.visible");

        cy.url().should("include", "post-new");

    });

    // ====================================================
    // MS-004
    // ====================================================
    it("MS-004 - should display all required survey fields", () => {

        cy.contains("Add New Survey").click();

        cy.get("#title")
            .should("exist");

        cy.contains("Survey Details")
            .should("exist");

        cy.contains("Description")
            .should("exist");

        cy.contains("Start Date")
            .should("exist");

        cy.contains("End Date")
            .should("exist");

        cy.get("#publish")
            .should("exist");

    });

    // ====================================================
    // MS-005
    // ====================================================
    it("MS-005 - should not publish survey without title", () => {

        cy.contains("Add New Survey").click();

        cy.contains("Publish")
            .click();

        cy.contains("Title")
            .should("exist");

    });

    // ====================================================
    // MS-006 + MS-007
    // ====================================================
    it("MS-006/MS-007 - should create a new survey successfully", () => {

        const surveyTitle =
            `Cypress Survey ${Date.now()}`;

        cy.wrap(surveyTitle).as("surveyTitle");

        cy.contains("Add New Survey")
            .click();

        cy.get("#title")
            .type(surveyTitle);

        cy.get("textarea")
            .first()
            .type("Survey created automatically using Cypress.");

        cy.get("#publish")
            .click();

        cy.contains("Post published")
            .should("be.visible");

    });

    // ====================================================
    // MS-008
    // ====================================================
    it("MS-008 - should display created survey in Mine list", () => {

        const surveyTitle =
            `Survey ${Date.now()}`;

        cy.contains("Add New Survey")
            .click();

        cy.get("#title")
            .type(surveyTitle);

        cy.get("textarea")
            .first()
            .type("Survey created automatically.");

        cy.get("#publish")
            .click();

        cy.contains("Post published")
            .should("be.visible");

        cy.contains("Surveys")
            .click();

        cy.contains("Mine")
            .click();

        cy.contains(surveyTitle)
            .should("exist");

    });

});
});