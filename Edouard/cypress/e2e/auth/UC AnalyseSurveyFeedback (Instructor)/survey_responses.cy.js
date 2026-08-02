describe("Instructor - Survey Responses", () => {

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
    // SR-001
    // Instructor login
    // ==================================================

    it("SR-001 - Instructor should login successfully", () => {

        cy.url()
            .should("include", "/wp-admin/");

    });



    // ==================================================
    // SR-002
    // Open Survey Responses page
    // ==================================================

    it("SR-002 - Instructor should open Survey Responses page", () => {

        cy.visit(
            "https://student.michaelkentburns.com/wp-admin/admin.php?page=survey-responses"
        );

        cy.url()
            .should("include", "page=survey-responses");

        cy.contains("Survey Responses")
            .should("be.visible");

    });



    // ==================================================
    // SR-003
    // Display survey titles
    // ==================================================

    it("SR-003 - Survey titles should be displayed", () => {

        cy.visit(
            "https://student.michaelkentburns.com/wp-admin/admin.php?page=survey-responses"
        );

        cy.contains(
            "Participant Program Expectations Survey - Edo"
        ).should("exist");

    });



    // ==================================================
    // SR-004
    // Display responses table
    // ==================================================

    it("SR-004 - Responses table should be displayed", () => {

        cy.visit(
            "https://student.michaelkentburns.com/wp-admin/admin.php?page=survey-responses"
        );

        cy.contains("Student").should("exist");
        cy.contains("Answers").should("exist");
        cy.contains("Date").should("exist");
        cy.contains("Feedback").should("exist");

    });



    // ==================================================
    // SR-005
    // Display student responses
    // ==================================================

    it("SR-005 - Student responses should be displayed", () => {

        cy.visit(
            "https://student.michaelkentburns.com/wp-admin/admin.php?page=survey-responses"
        );

        cy.contains("EdouardKN")
            .should("exist");

        cy.contains(
            "edouardkizandengo@gmail.com"
        ).should("exist");

        cy.contains(
            "Backend Development"
        ).should("exist");

        cy.contains(
            "true"
        ).should("exist");

    });



    // ==================================================
    // SR-006
    // Display uploaded file name
    // ==================================================

    it("SR-006 - Uploaded file name should be displayed", () => {

        cy.visit(
            "https://student.michaelkentburns.com/wp-admin/admin.php?page=survey-responses"
        );

        cy.contains(
            "attestation-domicile-exemple.docx"
        ).should("exist");

    });



    // ==================================================
    // SR-007
    // Feedback textarea should exist
    // ==================================================

    it("SR-007 - Feedback textarea should exist", () => {

        cy.visit(
            "https://student.michaelkentburns.com/wp-admin/admin.php?page=survey-responses"
        );

        cy.get("textarea")
            .should("have.length.at.least", 1);

    });



    // ==================================================
    // SR-008
    // Instructor should edit feedback
    // ==================================================

    it("SR-008 - Instructor should edit feedback", () => {

        cy.visit(
            "https://student.michaelkentburns.com/wp-admin/admin.php?page=survey-responses"
        );

        cy.get("textarea")
            .first()
            .clear()
            .type(
                "Excellent participation during testing."
            );

    });



    // ==================================================
    // SR-009
    // Save button should exist
    // ==================================================

    it("SR-009 - Save button should exist", () => {

        cy.visit(
            "https://student.michaelkentburns.com/wp-admin/admin.php?page=survey-responses"
        );

        cy.contains("Save")
            .first()
            .should("be.visible");

    });



    // ==================================================
    // SR-010
    // Instructor should save feedback
    // ==================================================

    it("SR-010 - Instructor should save feedback", () => {

        cy.visit(
            "https://student.michaelkentburns.com/wp-admin/admin.php?page=survey-responses"
        );

        cy.get("textarea")
            .first()
            .clear()
            .type(
                "Excellent participation during testing."
            );

        cy.contains("Save")
            .first()
            .click();

    });



    // ==================================================
    // SR-011
    // Feedback should remain after saving
    // ==================================================

    it("SR-011 - Saved feedback should remain visible", () => {

        cy.visit(
            "https://student.michaelkentburns.com/wp-admin/admin.php?page=survey-responses"
        );

        cy.get("textarea")
            .first()
            .should("not.have.value", "");

    });



    // ==================================================
    // SR-012
    // Survey without responses
    // ==================================================

    it("SR-012 - Survey without responses should display 'No responses yet.'", () => {

        cy.visit(
            "https://student.michaelkentburns.com/wp-admin/admin.php?page=survey-responses"
        );

        cy.contains(
            "No responses yet."
        ).should("exist");

    });

});