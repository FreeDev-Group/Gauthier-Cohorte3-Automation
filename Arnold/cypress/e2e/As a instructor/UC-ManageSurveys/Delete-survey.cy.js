describe("Survey Management - Delete Survey", () => {

  it("should successfully delete an existing survey", () => {

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

    // Allow the Surveys page to load
    cy.wait(1000);


    // ============================================================
    // Step 6: Create a Survey for the Delete Test
    // ============================================================

    // Open the Add New Survey form
    cy.get(".page-title-action")
      .should("be.visible")
      .click();

    // Allow the survey creation form to load
    cy.wait(1000);

    // Enter the survey title
    cy.get('[name="post_title"]')
      .should("be.visible")
      .clear()
      .type("Arnold Test Survey deleted", {
        delay: 100
      });

    // Enter the survey description
    cy.get('[name="survey_description"]')
      .should("be.visible")
      .clear()
      .type(
        "This survey is created by Arnold for testing purposes to delete.",
        {
          delay: 30
        }
      );


    // ============================================================
    // Step 7: Configure Survey Dates
    // ============================================================

    // Set the survey start date
    cy.get('[name="survey_start_date"]')
      .should("be.visible")
      .click()
      .clear()
      .type("2026-08-08", {
        delay: 30
      });

    // Set the survey end date
    cy.get('[name="survey_end_date"]')
      .should("be.visible")
      .click()
      .clear()
      .type("2026-10-08", {
        delay: 30
      });


    // ============================================================
    // Step 8: Save and Publish the Survey
    // ============================================================

    // Save the survey
    cy.get('#save-action > [name="save"]')
      .should("be.visible")
      .click();

    // Allow the survey to be saved
    cy.wait(1000);

    // Verify that the Publish button is available
    cy.get('[name="publish"]')
      .should("be.visible");

    // Publish the survey so it can be managed from the survey list
    cy.get('[name="publish"]')
      .click();


    // ============================================================
    // Step 9: Return to the Survey Management List
    // ============================================================

    // Open the Surveys section again
    cy.contains("Surveys")
      .should("be.visible")
      .click();

    // Allow the survey list to load
    cy.wait(1000);


    // ============================================================
    // Step 10: Select the Survey to Be Deleted
    // ============================================================

    // Locate the survey created specifically for this delete test
    cy.contains("Arnold Test Survey deleted")
      .should("be.visible")
      .closest("tr")
      .find('[name="post[]"]')
      .check({ force: true });


    // ============================================================
    // Step 11: Select the Move to Trash Action
    // ============================================================

    // Open the bulk action menu
    cy.get('[name="action"]')
      .should("be.visible")
      .select("Move to Trash", {
        force: true
      });


    // ============================================================
    // Step 12: Apply the Delete Action
    // ============================================================

    // Apply the selected bulk action
    cy.get('.top > .bulkactions > [name="bulk_action"]')
      .should("be.visible")
      .click();




  });

});