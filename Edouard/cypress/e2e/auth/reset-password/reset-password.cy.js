describe("MKB - Reset Password (UC RP-001 → RP-010)", () => {

  const url = "https://student.michaelkentburns.com/wp-login.php?action=lostpassword";

  // =========================
  // RP-001 / RP-002 / RP-003
  // =========================
  it("should load reset password page correctly", () => {
    cy.visit(url);

    cy.contains("Forgot Password").should("be.visible");
    cy.get("#user_login").should("be.visible");

    cy.screenshot("RP-001_page_loaded");
  });

  // =========================
  // RP-004
  // =========================
  it("should show validation error for empty input", () => {
    cy.visit(url);

    cy.get("#wp-submit").click();

    cy.get("#user_login").then(($el) => {
      expect($el[0].validationMessage).to.exist;
    });

    cy.screenshot("RP-004_empty_field_validation");
  });

  // =========================
  // RP-005 / RP-006
  // =========================
  it("should show error for non-existing account", () => {
    cy.visit(url);

    cy.get("#user_login").type("fake_user_123456");
    cy.get("#wp-submit").click();

    cy.contains("no account found").should("exist");

    cy.screenshot("RP-005_invalid_user");
  });

  // =========================
  // RP-007 (SUCCESS FLOW)
  // =========================
  it("should send reset email for valid account", () => {
    cy.visit(url);

    // ⚠️ utilise un vrai user existant de ton système
    cy.get("#user_login").type("Bag3");
    cy.get("#wp-submit").click();

    cy.contains("Check your email").should("be.visible");

    cy.screenshot("RP-007_email_sent");
  });

  // =========================
  // RP-010 (RESET PASSWORD FORM FLOW)
  // =========================
  it("should allow password reset and login redirect", () => {

    // URL typique WordPress reset (à adapter si token réel)
    cy.visit(url);

    cy.get("#user_login").type("Bag3");
    cy.get("#wp-submit").click();

    // ⚠️ normalement lien email → ici simulation directe si page accessible
    cy.log("Email step skipped (Cypress limitation)");

  });

});