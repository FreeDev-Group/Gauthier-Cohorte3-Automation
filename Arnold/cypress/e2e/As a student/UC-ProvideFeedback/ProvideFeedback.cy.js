describe("Provide Feedback", () => {
  it("should navigate through surveys and open Arnold Project Testing Survey", () => {
    // Visit the application homepage.
    cy.visit("https://student.michaelkentburns.com");

    // Accept the cookie consent banner.
    cy.get(".cky-notice-btn-wrapper > .cky-btn-accept").click({ force: true });

    // Verify that the homepage has loaded successfully.
    cy.url().should("include", "student.michaelkentburns.com");

    // Navigate to the login page.
    cy.contains("User").click();
    cy.contains("Login").click();

    // Enter valid credentials.
    cy.get('[name="log"]').should("be.visible").clear().type("arnold-test");

    cy.get('[name="pwd"]')
      .should("be.visible")
      .clear()
      .type("mypassword123useraccount");

    // Enable "Remember Me".
    cy.get('[name="rememberme"]').check({ force: true });

    // Submit login form.
    cy.get('[name="wp-submit"]').click();

    // Verify successful login.
    cy.contains("All Surveys", { timeout: 10000 }).should("be.visible");

    // Open All Surveys page.
    cy.contains("All Surveys").click();

    // Navigate through three pages.
    for (let i = 0; i < 3; i++) {
      // Scroll to pagination section.
      cy.scrollTo("bottom");

      // Click Next Page.
      cy.contains("Next", { timeout: 10000 }).should("be.visible").click();
    }

    // Open Arnold Project Testing Survey.
    cy.contains("Wise _Test_With_Playwright Updated", { timeout: 10000 })
      .should("be.visible")
      .click();

    // should response for all questions
    cy.get('[name="answer[747]"]').should("be.visible")
    .clear().type("This test is very very beautiful for me and a like it.", {delay: 200});
  });
});
