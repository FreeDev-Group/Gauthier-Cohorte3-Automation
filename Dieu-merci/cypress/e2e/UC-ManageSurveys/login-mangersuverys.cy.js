describe("UC-ManageSurveys / login", () => {
  it("should log in with the instructor credentials", () => {
    cy.visit("/wp-login.php");

    cy.get("#loginform").should("be.visible");
    cy.get("#user_login").clear().type("devmerci");
    cy.get("#user_pass").clear().type("Merci@2026", { log: false });
    cy.get("#wp-submit").click();

    cy.location("pathname", { timeout: 30000 }).should(
      "not.include",
      "wp-login.php",
    );
    cy.contains("a, span", /Howdy|Dashboard|devmerci/i).should("be.visible");
  });
});
