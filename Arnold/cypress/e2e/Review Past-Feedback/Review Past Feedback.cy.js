describe("Review Past Feedback", () => {

  beforeEach(() => {

    // Open the application
    cy.visit("https://student.michaelkentburns.com");

    // Accept the cookie banner
    cy.get(".cky-notice-btn-wrapper > .cky-btn-accept").click({ force: true });

    // Navigate to the login page
    cy.contains("User").click();
    cy.contains("Login").click();

    // Login with a valid student account
    cy.get('[name="log"]').type("arnold-test");
    cy.get('[name="pwd"]').type("mypassword123useraccount");
    cy.get('[name="wp-submit"]').click();

  });

  it("should allow a student to review past feedback", () => {

    // Open Feedback History
    cy.contains("My Completed Surveys").click();

    // Open My Completed Surveys
    cy.contains("Completed Surveys").should("be.visible");
  });

});