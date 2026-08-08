describe("Application Menu Navigation - Student Survey", () => {

  it("should successfully login and navigate through all dashboard menus", () => {


    // ============================================================
    // Step 1: Launch Student Survey Application
    // ============================================================

    // Open application homepage
    cy.visit("https://student.michaelkentburns.com");


    // Accept cookie consent banner
    cy.get(".cky-notice-btn-wrapper > .cky-btn-accept")
      .should("be.visible")
      .click({ force: true });


    // Verify application is accessible
    cy.url()
      .should("include", "student.michaelkentburns.com");



    // ============================================================
    // Step 2: Access Login Page
    // ============================================================


    // Open User navigation menu
    cy.contains("User")
      .should("be.visible")
      .click();


    // Select Login option
    cy.contains("Login")
      .should("be.visible")
      .click();



    // ============================================================
    // Step 3: Authenticate User
    // ============================================================


    // Enter username
    cy.get('[name="log"]')
      .should("be.visible")
      .clear()
      .type("Leonce");


    // Enter password
    cy.get('[name="pwd"]')
      .should("be.visible")
      .clear()
      .type("Lephare-bukavu0970005782");


    // Enable Remember Me option
    cy.get('[name="rememberme"]')
      .should("exist")
      .check({ force: true });


    // Submit login form
    cy.get('[name="wp-submit"]')
      .should("be.visible")
      .click();



    // ============================================================
    // Step 4: Verify Successful Authentication
    // ============================================================


    // Confirm user is redirected to WordPress dashboard
    cy.url()
      .should("include", "/wp-admin");


    // Verify dashboard availability
    cy.contains("Dashboard")
      .should("be.visible");


    cy.wait(3000);



    // ============================================================
    // Step 5: Validate Dashboard Menu Navigation
    // ============================================================


    // ------------------------------------------------------------
    // Open Dashboard
    // ------------------------------------------------------------

    cy.log("Opening Dashboard menu");

    cy.contains("Dashboard")
      .should("be.visible")
      .click();

    cy.wait(2000);



    // ------------------------------------------------------------
    // Open Posts Section
    // ------------------------------------------------------------

    cy.log("Opening Posts menu");

    cy.contains("Posts")
      .should("be.visible")
      .click();

    cy.wait(2000);



    // ------------------------------------------------------------
    // Open Questions Section
    // ------------------------------------------------------------

    cy.log("Opening Questions menu");

    cy.get(".wp-first-item > .wp-menu-name")
      .should("be.visible")
      .click();

    cy.wait(2000);



    // ------------------------------------------------------------
    // Open Survey Responses Section
    // ------------------------------------------------------------

    cy.log("Opening Survey Responses menu");

    cy.contains("Survey Responses")
      .should("be.visible")
      .click();

    cy.wait(2000);



    // ------------------------------------------------------------
    // Open Surveys Section
    // ------------------------------------------------------------

    cy.log("Opening Surveys menu");

    cy.contains("Surveys")
      .should("be.visible")
      .click();

    cy.wait(2000);



    // ------------------------------------------------------------
    // Open Comments Section
    // ------------------------------------------------------------

    cy.log("Opening Comments menu");

    cy.contains("Comments")
      .should("be.visible")
      .click();

    cy.wait(2000);



    // ------------------------------------------------------------
    // Open Profile Section
    // ------------------------------------------------------------

    cy.log("Opening Profile menu");

    cy.contains("Profile")
      .should("be.visible")
      .click();

    cy.wait(2000);



    // ------------------------------------------------------------
    // Open Tools Section
    // ------------------------------------------------------------

    cy.log("Opening Tools menu");

    cy.contains("Tools")
      .should("be.visible")
      .click();

    cy.wait(2000);



    // ------------------------------------------------------------
    // Return to Dashboard
    // ------------------------------------------------------------

    cy.log("Returning back to Dashboard");

    cy.contains("Dashboard")
      .should("be.visible")
      .click();

    cy.wait(3000);



    // ============================================================
    // Step 6: Test Completion Confirmation
    // ============================================================

    cy.log("All application menus were successfully accessed");

  });

});