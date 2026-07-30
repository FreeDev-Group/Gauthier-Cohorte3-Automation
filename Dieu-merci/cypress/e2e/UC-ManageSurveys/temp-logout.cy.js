describe("Temp logout test", () => {
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

  it("logs out and lands on login page", () => {
    cy.login(username, password);
    cy.visit("/wp-admin/");
    cy.visit("/wp-login.php?action=logout", { failOnStatusCode: false });
    cy.location("href").then((href) => {
      cy.log("href=" + href);
    });
    cy.get("body").then(($body) => {
      cy.log($body.text().slice(0, 2000));
    });
    cy.get("body").should("contain", "login");
  });
});
