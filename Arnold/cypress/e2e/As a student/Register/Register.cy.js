describe("Register Page", () => {

  beforeEach(() => {
    // Visit the application's homepage.
    cy.visit("https://student.michaelkentburns.com");

    // Accept the cookie consent banner to avoid blocking user interactions.
    cy.get(".cky-notice-btn-wrapper > .cky-btn-accept").click({ force: true });

    // Verify that the homepage has loaded successfully.
    cy.url().should("include", "student.michaelkentburns.com");

    // Navigate to the registration page.
    cy.contains("User").click();
    cy.contains("Register").click();
  });


  it("should not fill the registration form", () => {

    // Leave the username field effectively empty.
    cy.get('[name="user_login"]')
      .should("be.visible")
      .clear()
      .type(' ', { delay: 50 });

    // Leave the email field effectively empty.
    cy.get('[name="user_email"]')
      .should("be.visible")
      .clear()
      .type(' ', { delay: 50 });

    // Attempt to submit the registration form.
    cy.get('[name="wp-submit"]').click();

  });


  it("should reject the username is already registered", () => {

    // Enter an existing username.
    cy.get('[name="user_login"]')
      .should("be.visible")
      .clear()
      .type("leonce", { delay: 50 });

    // Leave the email field empty.
    cy.get('[name="user_email"]')
      .should("be.visible")
      .clear()
      .type(" ", { delay: 50 });

    // Submit the registration request.
    cy.get('[name="wp-submit"]').click();

  });


  it("should reject an email address", () => {

    // Enter a unique username.
    cy.get('[name="user_login"]')
      .should("be.visible")
      .clear()
      .type("Aleonce", { delay: 50 });

    // Enter an email address that is already registered.
    cy.get('[name="user_email"]')
      .should("be.visible")
      .clear()
      .type("leoncenarnolde@gmail.com", { delay: 50 });

    // Submit the registration request.
    cy.get('[name="wp-submit"]').click();

  });


  it("should register a new user with valid credentials", () => {

    // Enter a unique username.
    cy.get('[name="user_login"]')
      .should("be.visible")
      .clear()
      .type("arnold-test", { delay: 50 });

    // Enter a valid email address.
    cy.get('[name="user_email"]')
      .should("be.visible")
      .clear()
      .type("arnoldtesting@gmail.com", { delay: 50 });

    // Submit the registration form.
    cy.get('[name="wp-submit"]').click();

  });

});