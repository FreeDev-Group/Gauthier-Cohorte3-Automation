describe("UC-CreateAccount / register-success", () => {
  const registrationUrl =
    "https://student.michaelkentburns.com/wp-login.php?action=register";

  const generateUser = () => {
    const id = Date.now();

    return {
      username: `testuser_${id}`,
      email: `testuser_${id}@example.com`,
    };
  };

  it("should successfully register a new user and redirect to confirmation page", () => {
    const user = generateUser();

    cy.visit(registrationUrl);

    // Registration form should be displayed
    cy.get("#registerform").should("be.visible");

    // Fill registration fields
    cy.get("#user_login").should("be.visible").type(user.username);

    cy.get("#user_email").should("be.visible").type(user.email);

    // Submit registration
    cy.get("#wp-submit")
      .should("be.visible")
      .and("have.value", "Register")
      .click();

    // Verify redirect
    cy.url().should("include", "wp-login.php?checkemail=registered");

    // Verify confirmation message
    cy.get("#login-message")
      .should("be.visible")
      .and("contain.text", "Registration complete. Please check your email");

    // Verify login link
    cy.get("#login-message a")
      .should(
        "have.attr",
        "href",
        "https://student.michaelkentburns.com/wp-login.php",
      )
      .and("contain.text", "login page");
  });
});
