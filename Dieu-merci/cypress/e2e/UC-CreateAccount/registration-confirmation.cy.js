describe("UC-CreateAccount / registration-confirmation", () => {
  const confirmationUrl =
    "https://student.michaelkentburns.com/wp-login.php?checkemail=registered";

  it("should display the registration confirmation page", () => {
    cy.visit(confirmationUrl);

    cy.title().should("contain", "Check your email");

    cy.get(".screen-reader-text")
      .should("be.visible")
      .and("contain.text", "Check your email");

    cy.get("#login-message")
      .should("be.visible")
      .and("contain.text", "Registration complete. Please check your email");

    cy.get("#login-message a")
      .should(
        "have.attr",
        "href",
        "https://student.michaelkentburns.com/wp-login.php",
      )
      .and("contain.text", "login page");

    cy.get("#backtoblog")
      .should("be.visible")
      .find("a")
      .should("have.attr", "href", "https://student.michaelkentburns.com/");
  });
});
