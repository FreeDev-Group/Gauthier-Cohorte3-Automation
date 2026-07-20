describe("UC Create Account", () => {

  const url = "https://student.michaelkentburns.com/wp-login.php?action=register";

  // =====================================================
  // CA-001 - Registration page loads correctly
  // =====================================================

  it("CA-001 - Registration page loads correctly", () => {

    cy.visit(url);

    cy.contains("Register For This Site")
      .should("be.visible");

    cy.get("#user_login")
      .should("be.visible");

    cy.get("#user_email")
      .should("be.visible");

    cy.get("#wp-submit")
      .should("be.visible");

    cy.screenshot("CA-001_page_loaded");

  });


  // =====================================================
  // CA-002 - Required fields validation
  // =====================================================

  it("CA-002 - Required fields validation", () => {

    cy.visit(url);

    cy.get("#wp-submit").click();

    cy.contains("Error: Please enter a username")
      .should("be.visible");

    cy.contains("Error: Please type your email address")
      .should("be.visible");

    cy.screenshot("CA-002_required_fields");

  });


  // =====================================================
  // CA-003 - Invalid username
  // =====================================================

  it("CA-003 - Invalid username", () => {

    cy.visit(url);

    cy.get("#user_login")
      .type("test@#!");

    cy.get("#user_email")
      .type("test@gmail.com");

    cy.get("#wp-submit").click();

    cy.contains("Error: This username is invalid")
      .should("be.visible");

    cy.screenshot("CA-003_invalid_username");

  });


  // =====================================================
  // CA-004 - Invalid email format
  // =====================================================

  it("CA-004 - Invalid email format", () => {

    cy.visit(url);

    cy.get("#user_login")
      .type("StudentTest");

    cy.get("#user_email")
      .type("invalid-email");

    cy.get("#wp-submit").click();

    cy.contains("Error")
      .should("be.visible");

    cy.screenshot("CA-004_invalid_email");

  });


  // =====================================================
  // CA-005 - Duplicate username/email
  // =====================================================

  it("CA-005 - Duplicate username/email", () => {

    cy.visit(url);

    cy.get("#user_login")
      .type("admin");

    cy.get("#user_email")
      .type("admin@gmail.com");

    cy.get("#wp-submit").click();

    cy.contains("already registered")
      .should("be.visible");

    cy.screenshot("CA-005_duplicate_user");

  });


  // =====================================================
  // CA-006 - Username minimum length
  // =====================================================

  it("CA-006 - Username minimum length", () => {

    cy.visit(url);

    cy.get("#user_login")
      .type("a");

    cy.get("#user_email")
      .type("student@gmail.com");

    cy.get("#wp-submit").click();

    cy.contains("Error")
      .should("be.visible");

    cy.screenshot("CA-006_short_username");

  });


  // =====================================================
  // CA-007 - Registration form remains available after validation error
  // =====================================================

  it("CA-007 - Registration form remains available after validation error", () => {

    cy.visit(url);

    cy.get("#wp-submit").click();

    cy.get("#user_login")
      .should("be.visible");

    cy.get("#user_email")
      .should("be.visible");

    cy.get("#wp-submit")
      .should("be.visible");

    cy.screenshot("CA-007_form_still_available");

  });


  // =====================================================
  // CA-008 - Successful account creation
  // =====================================================

  it("CA-008 - Successful account creation", () => {

    const unique = Date.now();

    cy.visit(url);

    cy.get("#user_login")
      .type(`user${unique}`);

    cy.get("#user_email")
      .type(`user${unique}@gmail.com`);

    cy.get("#wp-submit").click();

    cy.contains("Registration complete")
      .should("be.visible");

    cy.screenshot("CA-008_success_registration");

  });

});