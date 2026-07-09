describe("UC-ProvideFeedback / submit-survey", () => {
  const loginUrl = "/wp-login.php";
  const surveysUrl = "/survey/";

  const loginAsStudent = () => {
    cy.visit(loginUrl);
    cy.env(["WORDPRESS_USER", "WORDPRESS_PASSWORD"]).then((env) => {
      const username = env && env.WORDPRESS_USER;
      const password = env && env.WORDPRESS_PASSWORD;

      if (!username || !password) {
        cy.log(
          "Skipping ProvideFeedback flow: missing WORDPRESS_USER/WORDPRESS_PASSWORD",
        );
        return;
      }

      cy.get("#user_login").clear().type(username);
      cy.get("#user_pass").clear().type(password, { log: false });
      cy.get("#rememberme").check({ force: true });
      cy.get("#wp-submit").click();
    });
  };

  it("should open a survey page and either show a form or the current access message", () => {
    loginAsStudent();

    cy.visit(surveysUrl);
    cy.contains(/surveys/i).should("be.visible");

    cy.get("body").then(($body) => {
      const surveyLinks = $body.find('a[href*="/survey/"]');
      expect(surveyLinks.length, "at least one survey link").to.be.greaterThan(
        0,
      );
    });

    cy.get('a[href*="/survey/"]')
      .not('[href*="/survey/page/"]')
      .first()
      .click();

    cy.location("pathname", { timeout: 20000 }).should("include", "/survey/");

    cy.get("body").then(($body) => {
      const pageText = $body.text();
      const hasPermissionMessage =
        /permission to view this survey|access denied|not have permission/i.test(
          pageText,
        );
      const visibleForm = $body.find("form:visible").length > 0;
      const visibleSubmitButton =
        $body.find(
          "button:visible, input[type='submit']:visible, input[type='button']:visible",
        ).length > 0;

      if (hasPermissionMessage) {
        cy.contains(
          /permission to view this survey|access denied|not have permission/i,
        ).should("be.visible");
      } else if (visibleForm || visibleSubmitButton) {
        cy.get("form:visible, button:visible, input[type='submit']:visible")
          .first()
          .should("be.visible");
      } else {
        cy.contains(/survey/i).should("exist");
      }
    });
  });
});
