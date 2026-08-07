describe("Login Page", () => {

  beforeEach(() => {

    // Open the Student Survey application
    cy.visit("https://student.michaelkentburns.com");

    // Accept the cookie consent banner
    cy.get(".cky-notice-btn-wrapper > .cky-btn-accept").click({ force: true });

    // Verify that the application homepage is loaded successfully
    cy.url().should("include", "student.michaelkentburns.com");

    // Open the User menu from the navigation bar
    cy.contains("User").click();

    // Navigate to the WordPress login page
    cy.contains("Login").click();

  });

  it("should block login when both username and password fields are empty", () => {

    // Leave both username and password fields empty
    cy.get('[name="log"]').clear();
    cy.get('[name="pwd"]').clear();

    // Enable the "Remember Me" option
    cy.get('[name="rememberme"]').check({ force: true });

    // Attempt to log in with empty credentials
    cy.get('[name="wp-submit"]').click();

  });

  it("should block login when the username field is empty", () => {

    // Leave the username field empty
    cy.get('[name="log"]').clear();

    // Enter a password only
    cy.get('[name="pwd"]')
      .clear()
      .type("user123", { delay: 50 });

    // Enable the "Remember Me" option
    cy.get('[name="rememberme"]').check({ force: true });

    // Attempt to log in
    cy.get('[name="wp-submit"]').click();

  });

  it("should block login when the password field is empty", () => {

    // Enter a username
    cy.get('[name="log"]')
      .clear()
      .type("username", { delay: 50 });

    // Leave the password field empty
    cy.get('[name="pwd"]').clear();

    // Enable the "Remember Me" option
    cy.get('[name="rememberme"]').check({ force: true });

    // Attempt to log in
    cy.get('[name="wp-submit"]').click();

  });

  it("should reject an unknown username", () => {

    // Enter a username that does not exist
    cy.get('[name="log"]')
      .clear()
      .type("username", { delay: 50 });

    // Enter a password
    cy.get('[name="pwd"]')
      .clear()
      .type("user123", { delay: 50 });

    // Enable the "Remember Me" option
    cy.get('[name="rememberme"]').check({ force: true });

    // Submit the login form
    cy.get('[name="wp-submit"]').click();

  });

  it("should reject an invalid password", () => {

    // Enter a valid username
    cy.get('[name="log"]')
      .clear()
      .type("arnold-test", { delay: 50 });

    // Enter an incorrect password
    cy.get('[name="pwd"]')
      .clear()
      .type("wrongpassword", { delay: 50 });

    // Enable the "Remember Me" option
    cy.get('[name="rememberme"]').check({ force: true });

    // Submit the login form
    cy.get('[name="wp-submit"]').click();

  });

  it("should login successfully with valid credentials", () => {

    // Enter a valid username
    cy.get('[name="log"]')
      .clear()
      .type("arnold-test", { delay: 50 });

    // Enter the correct password
    cy.get('[name="pwd"]')
      .clear()
      .type("mypassword123useraccount", { delay: 50 });

    // Enable the "Remember Me" option
    cy.get('[name="rememberme"]').check({ force: true });

    // Submit the login form
    cy.get('[name="wp-submit"]').click();

  });

});