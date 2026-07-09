describe("UC-CreateAccount / register-validation", () => {
  const registrationUrl =
    "https://student.michaelkentburns.com/wp-login.php?action=register";

  it("should validate required fields and show errors", () => {
    cy.visit(registrationUrl);
    cy.get("#registerform").should("be.visible");
    cy.get("#wp-submit").click();

    cy.get("#login_error").should("be.visible");
    cy.get("#login_error").within(() => {
      cy.contains("Please enter a username.").should("be.visible");
      cy.contains("Please type your email address.").should("be.visible");
    });
  });
});
