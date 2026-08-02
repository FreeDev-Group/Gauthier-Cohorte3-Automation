describe("Instructor - Admin Navigation", () => {

    // ==================================================
    // IGNORE WORDPRESS JSON EXCEPTION
    // ==================================================

    before(() => {

        Cypress.on("uncaught:exception", (err) => {

            if (
                err.message.includes(
                    "The response is not a valid JSON response"
                )
            ) {
                return false;
            }

        });

    });




    // ==================================================
    // COMMON SETUP
    // ==================================================

    beforeEach(() => {

        cy.loginAsInstructor();

    });





    // ==================================================
    // AN-001
    // Dashboard
    // ==================================================

    it("AN-001 - should open Dashboard", () => {

        cy.contains(".wp-menu-name", "Dashboard")
            .click();

        cy.url()
            .should("include", "/wp-admin/");

    });





    // ==================================================
    // AN-002
    // Posts
    // ==================================================

    it("AN-002 - should open Posts", () => {

        cy.contains(".wp-menu-name", "Posts")
            .click();

        cy.url()
            .should("include", "edit.php");

    });





    // ==================================================
    // AN-003
    // Questions
    // ==================================================

    it("AN-003 - should open Questions", () => {

        cy.contains(".wp-menu-name", "Questions")
            .click();

        cy.url()
            .should("include", "post_type=question");

    });





    // ==================================================
    // AN-004
    // Survey Responses
    // ==================================================

    it("AN-004 - should open Survey Responses", () => {

        cy.contains(".wp-menu-name", "Survey Responses")
            .click();

        cy.url()
            .should("include", "page=survey-responses");

        cy.contains("Survey Responses")
            .should("be.visible");

    });





    // ==================================================
    // AN-005
    // Surveys
    // ==================================================

    it("AN-005 - should open Surveys", () => {

        cy.contains(".wp-menu-name", "Surveys")
            .click();

        cy.url()
            .should("include", "post_type=survey");

    });





    // ==================================================
    // AN-006
    // Comments
    // ==================================================

    it("AN-006 - should open Comments", () => {

        cy.contains(".wp-menu-name", "Comments")
            .click();

        cy.url()
            .should("include", "edit-comments.php");

    });





    // ==================================================
    // AN-007
    // Profile
    // ==================================================

    it("AN-007 - should open Profile", () => {

        cy.contains(".wp-menu-name", "Profile")
            .click();

        cy.url()
            .should("include", "profile.php");

    });





    // ==================================================
    // AN-008
    // Tools
    // ==================================================

    it("AN-008 - should open Tools", () => {

        cy.contains(".wp-menu-name", "Tools")
            .click();

        cy.url()
            .should("include", "tools.php");

    });



});