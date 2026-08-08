describe("Survey Management - Edit Survey", () => {

  it("should successfully edit an existing survey", () => {

    // ============================================================
    // Step 1: Access the Student Survey Application
    // ============================================================

    // Open the Student Survey application
    cy.visit("https://student.michaelkentburns.com");

    // Accept the cookie consent banner
    cy.get(".cky-notice-btn-wrapper > .cky-btn-accept")
      .should("be.visible")
      .click({ force: true });

    // Verify that the application homepage has loaded successfully
    cy.url()
      .should("include", "student.michaelkentburns.com");


    // ============================================================
    // Step 2: Navigate to the Login Page
    // ============================================================

    // Open the User menu
    cy.contains("User")
      .should("be.visible")
      .click();

    // Select the Login option
    cy.contains("Login")
      .should("be.visible")
      .click();


    // ============================================================
    // Step 3: Authenticate with Valid Credentials
    // ============================================================

    // Enter the valid username
    cy.get('[name="log"]')
      .should("be.visible")
      .clear()
      .type("Leonce");

    // Enter the valid password
    cy.get('[name="pwd"]')
      .should("be.visible")
      .clear()
      .type("Lephare-bukavu0970005782");

    // Enable the "Remember Me" option
    cy.get('[name="rememberme"]')
      .should("exist")
      .check({ force: true });

    // Submit the login form
    cy.get('[name="wp-submit"]')
      .should("be.visible")
      .click();


    // ============================================================
    // Step 4: Verify Successful Authentication
    // ============================================================

    // Verify that the user is redirected to the WordPress admin area
    cy.url()
      .should("include", "/wp-admin");

    // Confirm that the WordPress Dashboard is displayed
    cy.contains("Dashboard")
      .should("be.visible");


    // ============================================================
    // Step 5: Navigate to Survey Management
    // ============================================================

    // Open the Surveys management section
    cy.contains("Surveys")
      .should("be.visible")
      .click();

    // Verify that the Surveys management page is displayed
    cy.contains("All Surveys")
      .should("be.visible");


    // ============================================================
    // Step 6: Open the Survey List
    // ============================================================

    // Open the list of existing surveys
    cy.contains("All Surveys")
      .click();

    // Verify that the target survey is available
    cy.get('#post-2379 > .title > strong > .row-title')
      .should("be.visible");


    // ============================================================
    // Step 7: Open the Existing Survey for Editing
    // ============================================================

    // Open "Arnold Test Survey" for editing
    cy.get('#post-2379 > .title > strong > .row-title')
      .click();

    // Verify that the survey title field is available
    cy.get('[name="post_title"]')
      .should("be.visible");


    // ============================================================
    // Step 8: Update Survey Information
    // ============================================================

    // Update the survey title
    cy.get('[name="post_title"]')
      .clear()
      .type("Arnold Edit Test Survey", {
        delay: 100
      });

    // Update the survey description
    cy.get('[name="survey_description"]')
      .should("be.visible")
      .clear()
      .type(
        "This survey is updated for testing purposes by Arnold.",
        {
          delay: 30
        }
      );


    // ============================================================
    // Step 9: Update Survey Dates
    // ============================================================

    // Update the survey start date
    cy.get('[name="survey_start_date"]')
      .should("be.visible")
      .click()
      .clear()
      .type("2026-08-07", {
        delay: 30
      });

    // Update the survey end date
    cy.get('[name="survey_end_date"]')
      .should("be.visible")
      .click()
      .clear()
      .type("2026-11-07", {
        delay: 30
      });


    // ============================================================
    // Step 10: Save the Survey Changes
    // ============================================================

    // Verify that the Update/Save button is available
    cy.get('#publishing-action > [name="save"]')
      .should("be.visible")
      .click();


    // ============================================================
    // Step 11: Verify the Survey Was Successfully Updated
    // ============================================================

    // Verify that the updated survey title is displayed
    cy.get('[name="post_title"]')
      .should("have.value", "Arnold Edit Test Survey");

    // Verify that the updated description is displayed
    cy.get('[name="survey_description"]')
      .should(
        "have.value",
        "This survey is updated for testing purposes by Arnold."
      );

    // Verify that the updated start date is displayed
    cy.get('[name="survey_start_date"]')
      .should("have.value", "2026-08-07");

    // Verify that the updated end date is displayed
    cy.get('[name="survey_end_date"]')
      .should("have.value", "2026-11-07");


    // ============================================================
    // Step 12: Verify the Updated Survey in the Survey List
    // ============================================================

    // Return to the list of all surveys
    cy.contains("All Surveys")
      .should("be.visible")
      .click();

    // Verify that the updated survey appears in the survey list
    cy.contains("Arnold Edit Test Survey")
      .should("be.visible");


  });

});