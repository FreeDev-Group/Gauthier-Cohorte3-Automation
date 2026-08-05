describe("Provide Feedback", () => {

  it("should navigate through surveys and open Arnold Project Testing Survey", () => {


    // Visit the application homepage.
    cy.visit("https://student.michaelkentburns.com");


    // Accept the cookie consent banner.
    cy.get(".cky-notice-btn-wrapper > .cky-btn-accept")
      .click({ force: true });


    // Verify that the homepage has loaded successfully.
    cy.url()
      .should("include", "student.michaelkentburns.com");


    // Navigate to the login page.
    cy.contains("User")
      .click();

    cy.contains("Login")
      .click();



    // Enter valid credentials.
    cy.get('[name="log"]')
      .should("be.visible")
      .clear()
      .type("Leonce");


    cy.get('[name="pwd"]')
      .should("be.visible")
      .clear()
      .type("Lephare-bukavu0970005782");



    // Enable "Remember Me".
    cy.get('[name="rememberme"]')
      .check({ force: true });



    // Submit login form.
    cy.get('[name="wp-submit"]')
      .click();



    // Wait for the dashboard page to load.
    cy.wait(5000);



    // Verify successful login.
    cy.contains("Posts", { timeout: 10000 })
      .should("be.visible");



    // Open Dashboard.
    cy.contains("Posts")
      .click();



    // Wait for Dashboard content to load.
    cy.wait(3000);



    // Open Posts page.
    cy.contains("Posts", { timeout: 10000 })
      .should("be.visible")
      .click();



  });

});