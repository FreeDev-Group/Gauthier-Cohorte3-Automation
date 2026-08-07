describe("Provide Feedback - Survey Management", () => {

  it("should successfully Create-surveys", () => {


    // ============================================================
    // Step 1: Create instructor's Surveys Application
    // ============================================================

    // Open the application homepage
    cy.visit("https://student.michaelkentburns.com");


    // Accept cookie consent banner if displayed
    cy.get(".cky-notice-btn-wrapper > .cky-btn-accept")
      .should("be.visible")
      .click({ force: true });


    // Verify application homepage is successfully loaded
    cy.url()
      .should("include", "student.michaelkentburns.com");



    // ============================================================
    // Step 2: Navigate to WordPress Login Page
    // ============================================================


    // Open User menu
    cy.contains("User")
      .should("be.visible")
      .click();


    // Select Login option
    cy.contains("Login")
      .should("be.visible")
      .click();



    // ============================================================
    // Step 3: Login Authentication
    // ============================================================


    // Enter valid username
    cy.get('[name="log"]')
      .should("be.visible")
      .clear()
      .type("Leonce");


    // Enter valid password
    cy.get('[name="pwd"]')
      .should("be.visible")
      .clear()
      .type("Lephare-bukavu0970005782");


    // Activate "Remember Me" checkbox
    cy.get('[name="rememberme"]')
      .should("exist")
      .check({ force: true });


    // Submit login form
    cy.get('[name="wp-submit"]')
      .should("be.visible")
      .click();



    // ============================================================
    // Step 4: Verify Successful Login
    // ============================================================


    // Verify redirection to WordPress dashboard
    cy.url()
      .should("include", "/wp-admin");


    // Confirm dashboard is loaded
    cy.contains("Dashboard")
      .should("be.visible");



    // ============================================================
    // Step 5: Access Survey Management Section
    // ============================================================


    // Open Surveys menu
    cy.contains("Surveys")
      .should("be.visible")
      .click();


    // Verify Survey page is displayed
    cy.contains("Add New Survey")
      .should("be.visible");



    // ============================================================
    // Step 6: Create New Survey
    // ============================================================


    // Open survey creation page
    cy.contains("Add New Survey")
      .click();


    // Verify survey title field is available
    cy.get('[name="post_title"]')
      .should("be.visible")
      .clear()
      .type("Arnold Test Survey", {
        delay: 100
      });



    // Enter survey description
    cy.get('[name="survey_description"]')
      .should("be.visible")
      .clear()
      .type(
        "This survey is created by Arnold for testing purposes.",
        {
          delay: 30
        }
      );



    // ============================================================
    // Step 7: Configure Survey Dates
    // ============================================================


    // Set survey start date
    cy.get('[name="survey_start_date"]')
      .should("be.visible")
      .click()
      .clear()
      .type("2026-08-07", {
        delay: 30
      });



    // Set survey end date
    cy.get('[name="survey_end_date"]')
      .should("be.visible")
      .click()
      .clear()
      .type("2026-11-07", {
        delay: 30
      });



    // ============================================================
    // Step 8: Save Survey Draft
    // ============================================================


    // Click Save button
    cy.get('#save-action > [name="save"]')
      .should("be.visible")
      .click();



    // Wait for save operation completion
    cy.wait(1000);



    // ============================================================
    // Step 9: Verify Survey Creation
    // ============================================================


    // Verify Publish button is available after saving
    cy.get('[name="publish"]')
      .should("be.visible");

  });

});