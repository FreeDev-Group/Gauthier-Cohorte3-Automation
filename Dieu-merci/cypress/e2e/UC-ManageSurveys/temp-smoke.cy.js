describe("Temp smoke check", () => {
  let username = "devmerci";
  let password = "Merci@2026";

  before(() => {
    cy.env(["WORDPRESS_INSTRUCTOR_USER", "WORDPRESS_INSTRUCTOR_PASSWORD"]).then(
      ({ WORDPRESS_INSTRUCTOR_USER, WORDPRESS_INSTRUCTOR_PASSWORD }) => {
        username = WORDPRESS_INSTRUCTOR_USER || "devmerci";
        password = WORDPRESS_INSTRUCTOR_PASSWORD || "Merci@2026";
      },
    );
  });

  it("creates a survey with the resilient action helper", () => {
    cy.login(username, password);
    const title = `Smoke ${Date.now()}`;
    cy.visit("/wp-admin/post-new.php?post_type=survey");
    cy.get("#post_title, #title").clear().type(title);
    cy.fillWpEditor("Smoke test content");
    cy.get("body").then(($body) => {
      const candidates = Cypress.$(
        "#publish, #save-post, button[type='submit'], input[type='submit']",
        $body,
      ).filter(":visible");
      const target = candidates.filter((_, el) => {
        const text = Cypress.$(el).text().trim().toLowerCase();
        const value = (el.value || "").trim().toLowerCase();
        return text.includes("publish") || value.includes("publish");
      });
      const action = target.length ? target.first() : candidates.first();
      cy.wrap(action).click({ force: true });
    });
    cy.get(".notice-success, .updated, .is-success").should("be.visible");
  });
});
