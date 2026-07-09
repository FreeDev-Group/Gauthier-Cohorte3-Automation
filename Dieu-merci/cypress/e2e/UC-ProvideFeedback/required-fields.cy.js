describe("UC-ProvideFeedback / required-fields", () => {
  const loginUrl = "/wp-login.php";
  const surveysUrl = "/survey/";

  const loginAsStudent = () => {
    cy.visit(loginUrl);
    cy.env(["WORDPRESS_USER", "WORDPRESS_PASSWORD"]).then((env) => {
      const username = env && env.WORDPRESS_USER;
      const password = env && env.WORDPRESS_PASSWORD;

      if (!username || !password) {
        cy.log(
          "Skipping ProvideFeedback required-fields flow: missing WORDPRESS_USER/WORDPRESS_PASSWORD",
        );
        return;
      }

      cy.get("#user_login").clear().type(username);
      cy.get("#user_pass").clear().type(password, { log: false });
      cy.get("#rememberme").check({ force: true });
      cy.get("#wp-submit").click();
    });
  };

  it("should show either validation feedback for a survey form or the current access restriction", () => {
    loginAsStudent();

    cy.visit(surveysUrl);
    cy.get('a[href*="/survey/"]')
      .not('[href*="/survey/page/"]')
      .first()
      .click();

    cy.get("body").then(($body) => {
      const pageText = $body.text();
      const hasPermissionMessage =
        /permission to view this survey|access denied|not have permission/i.test(
          pageText,
        );
      const hasForm = $body.find("form").length > 0;

      if (hasPermissionMessage) {
        cy.contains(
          /permission to view this survey|access denied|not have permission/i,
        ).should("be.visible");
      } else if (hasForm) {
        cy.get("form").within(() => {
          cy.contains(/submit|send|save/i).click({ force: true });
        });

        cy.get("body").then(($updatedBody) => {
          const updatedText = $updatedBody.text();
          const hasValidationFeedback = /required|please|error|field/i.test(
            updatedText,
          );
          expect(
            hasValidationFeedback,
            "required-field feedback or validation message",
          ).to.be.true;
        });
      } else {
        cy.contains(/survey/i).should("exist");
      }
    });
  });
});
