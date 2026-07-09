describe("UC-Login / login-success", () => {
  const loginUrl = "/wp-login.php";

  beforeEach(() => {
    cy.visit(loginUrl);
  });

  it("should display the login form with required fields", () => {
    cy.get("#loginform").should("be.visible");
    cy.get("#user_login").should("exist");
    cy.get("#user_pass").should("exist");
    cy.get("#rememberme").should("exist");
    cy.get("#wp-submit").should("exist");
  });

  it("should login successfully with valid credentials (provided via cy.env)", function () {
    // Use cy.env([...]) because Cypress.env() is disabled via allowCypressEnv:false
    cy.env(["WORDPRESS_USER", "WORDPRESS_PASSWORD"]).then((env) => {
      const username = env && env.WORDPRESS_USER;
      const password = env && env.WORDPRESS_PASSWORD;

      if (!username || !password) {
        cy.log(
          "Skipping login-success: missing WORDPRESS_USER/WORDPRESS_PASSWORD",
        );
        return;
      }

      cy.get("#user_login").clear().type(username);
      cy.get("#user_pass").clear().type(password, { log: false });
      cy.get("#rememberme").check({ force: true });
      cy.get("#wp-submit").click();

      // Expect no login error and a redirect away from the login page
      cy.get("#login_error").should("not.exist");
      cy.url().should("not.include", "wp-login.php");
    });
  });
});
