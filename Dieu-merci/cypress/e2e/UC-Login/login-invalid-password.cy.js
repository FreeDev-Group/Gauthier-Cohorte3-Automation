describe("UC-Login / login-invalid-password", () => {
  const loginUrl = "/wp-login.php";

  it("should show an error when the password is invalid", () => {
    cy.visit(loginUrl);
    cy.get("#loginform").should("be.visible");
    // Use provided username from cy.env if available, otherwise a placeholder
    cy.env(["WORDPRESS_USER"]).then((env) => {
      const username = (env && env.WORDPRESS_USER) || "testuser";

      cy.get("#user_login").clear().type(username);
      cy.get("#user_pass").clear().type("invalidpassword", { log: false });
      cy.get("#wp-submit").click();

      cy.get("#login_error")
        .should("be.visible")
        .and("contain", "incorrect")
        .and("contain", "Lost your password?");
    });
  });
});
