describe("Survey Management - Add Question", () => {

  it("should successfully add and publish a new question", () => {

    // ============================================================
    // Step 1: Access the Student Survey Application
    // ============================================================

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

    // Enter the username
    cy.get('[name="log"]')
      .should("be.visible")
      .clear()
      .type("Leonce");

    // Enter the password
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
    // Step 5: Navigate to Questions Management
    // ============================================================

    // Open the Questions management section
    cy.contains("Questions")
      .should("be.visible")
      .click();

    // Wait for the Questions page to load
    cy.wait(1000);


    // ============================================================
    // Step 6: Open the Add New Question Form
    // ============================================================

    // Open the form used to create a new question
    cy.get(".page-title-action")
      .should("be.visible")
      .click();


    // ============================================================
    // Step 7: Enter Question Details
    // ============================================================

    // Enter the question text
    cy.get('[name="post_title"]')
      .should("be.visible")
      .clear()
      .type("How satisfied are you with this course?", {
        delay: 20
      });


    // ============================================================
    // Step 8: Associate the Question with a Survey
    // ============================================================

    // Select the existing survey that will contain this question
    cy.get('[name="question_parent_survey"]')
      .should("be.visible")
      .select("Arnold Test Survey", {
        force: true
      });


    // ============================================================
    // Step 9: Configure the Question Type
    // ============================================================

    // Set the question type to Multiple Choice
    cy.get('[name="question_type"]')
      .should("be.visible")
      .select("Multiple Choice", {
        force: true
      });


    // ============================================================
    // Step 10: Define the Answer Options
    // ============================================================

    // Enter all available answer choices
    cy.get('[name="answer_options"]')
      .should("be.visible")
      .clear()
      .type(
        "Very Satisfied, Satisfied, Neutral, Dissatisfied, Very Dissatisfied",
        {
          delay: 50
        }
      );


    // ============================================================
    // Step 11: Configure the Question as Required
    // ============================================================

    // Make the question mandatory for respondents
    cy.get('[name="question_required"]')
      .should("be.visible")
      .check({ force: true });


    // ============================================================
    // Step 12: Save the Question
    // ============================================================

    // Save the new question
    cy.get('#save-action > [name="save"]')
      .should("be.visible")
      .click({ force: true });


    // ============================================================
    // Step 13: Publish the Question
    // ============================================================

    // Verify that the Publish button is available
    cy.get('[name="publish"]')
      .should("be.visible");

    // Publish the newly created question
    cy.get('[name="publish"]')
      .click({ force: true });


    // ============================================================
    // Step 14: Verify Question Creation
    // ============================================================

    // Verify that the question was successfully created
    cy.get('#menu-posts-question > .wp-has-submenu > .wp-menu-name')
      .should("be.visible")
      .click();

  });

});