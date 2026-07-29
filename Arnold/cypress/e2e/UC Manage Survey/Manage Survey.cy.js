describe("Manage Survey", () => {

  beforeEach(() => {

    // Open the application
    cy.visit("https://student.michaelkentburns.com");

    // Accept the cookie banner
    cy.get(".cky-notice-btn-wrapper > .cky-btn-accept").click({ force: true });

    // Navigate to the login page
    cy.contains("User").click();
    cy.contains("Login").click();

    // Login with a valid student account
    cy.get('[name="log"]').clear() .should("be.visible") .type("Leonce", { delay: 100 });
    cy.get('[name="pwd"]').clear() .should("be.visible") .type("Lephare-bukavu0970005782", { delay: 100 });
    cy.get('[name="wp-submit"]').click();

    // Enable "Remember Me".
    cy.get('[name="rememberme"]').check({ force: true });

  });

  it("the homepage for the instructor should be  visible", () => {

    // the homepage for the instructor should be  visible
    cy.url('https://student.michaelkentburns.com/wp-admin/').should('include', 'wp-admin');

  });

   

});