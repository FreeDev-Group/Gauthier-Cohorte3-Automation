describe("UC-ManageSurveys / create-survey", () => {
  it("should create a new survey successfully", () => {
    cy.visit("/wp-login.php");

    cy.get("#user_login").clear().type("devmerci");
    cy.get("#user_pass").clear().type("Merci@2026", { log: false });
    cy.get("#wp-submit").click();

    cy.location("pathname", { timeout: 30000 }).should(
      "not.include",
      "wp-login.php",
    );

    cy.visit("/wp-admin/post-new.php?post_type=survey&classic-editor", {
      failOnStatusCode: false,
    });

    cy.get("#post", { timeout: 30000 }).should("be.visible");

    cy.get("form#post").then(($form) => {
      const action = new URL(
        "/wp-admin/post.php",
        Cypress.config("baseUrl"),
      ).toString();
      const formData = new URLSearchParams(new FormData($form[0]));

      formData.set("post_title", "Cypress Managed Survey");
      formData.set("content", "How satisfied are you with the platform?");
      formData.set("post_status", "publish");
      formData.set("publish", "Publish");

      cy.request({
        method: "POST",
        url: action,
        body: formData.toString(),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        followRedirect: true,
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 302]);
      });
    });

    cy.visit("/wp-admin/edit.php?post_type=survey", {
      failOnStatusCode: false,
    });
    cy.contains("Cypress Managed Survey", { timeout: 30000 }).should(
      "be.visible",
    );
  });
});
