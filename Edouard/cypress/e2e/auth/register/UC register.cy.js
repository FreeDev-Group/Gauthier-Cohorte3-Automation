describe("MKB - Create Account (UC CA-001 → CA-017)", () => {

  const url = "https://student.michaelkentburns.com/wp-login.php?action=register";

  // =========================
  // CA-001 / CA-002 / CA-003
  // =========================
  it("should load registration page correctly", () => {
    cy.visit(url);

    cy.contains("Register For This Site").should("be.visible");
    cy.get("#user_login").should("be.visible");
    cy.get("#user_email").should("be.visible");
    cy.get("#wp-submit").should("be.visible");

    cy.screenshot("CA-001_page_loaded");
  });

  // =========================
  // CA-007 / CA-008 / CA-009
  // =========================
  it("should show validation errors for empty fields", () => {
    cy.visit(url);

    cy.get("#wp-submit").click();

    cy.contains("Error: Please enter a username").should("be.visible");
    cy.contains("Error: Please type your email address").should("be.visible");

    cy.screenshot("CA-007_empty_fields_errors");
  });

  // =========================
  // CA-011 / CA-012
  // =========================
  it("should reject invalid username (special characters)", () => {
    cy.visit(url);

    cy.get("#user_login").type("test@#!");
    cy.get("#user_email").type("test@gmail.com");
    cy.get("#wp-submit").click();

    cy.contains("Error: This username is invalid").should("be.visible");

    cy.screenshot("CA-011_invalid_username");
  });

  // =========================
  // CA-013 / CA-014
  // =========================
  it("should reject duplicate username/email", () => {
    cy.visit(url);

    cy.get("#user_login").type("admin"); // probable existing user
    cy.get("#user_email").type("admin@gmail.com");
    cy.get("#wp-submit").click();

    cy.contains("already registered").should("be.visible");

    cy.screenshot("CA-013_duplicate_user");
  });

  // =========================
  // CA-015 / CA-017 (SUCCESS FLOW)
  // =========================
  it("should successfully create account with valid data", () => {

    const uniqueUser = `user_${Date.now()}`;
    const uniqueEmail = `user_${Date.now()}@gmail.com`;

    cy.visit(url);

    cy.get("#user_login").type(uniqueUser);
    cy.get("#user_email").type(uniqueEmail);
    cy.get("#wp-submit").click();

    cy.contains("Registration complete").should("be.visible");

    cy.screenshot("CA-015_success_registration");
  });

});
const random = (Math.random() + 1).toString(36).substring(7);