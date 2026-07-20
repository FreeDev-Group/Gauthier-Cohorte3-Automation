describe("UC Login", () => {

  const loginUrl =
    "https://student.michaelkentburns.com/wp-login.php";

  const forgotUrl =
    "https://student.michaelkentburns.com/wp-login.php?action=lostpassword";

  const username = "Bag3";
  const password = "kiza2001@";

  // =====================================================
  // LG-001 - Login page loads correctly
  // =====================================================

  it("LG-001 - Login page loads correctly", () => {

    cy.visit(loginUrl);

    cy.contains("Log In").should("be.visible");

    cy.get("#user_login").should("be.visible");

    cy.get("#user_pass").should("be.visible");

    cy.get("#wp-submit").should("be.visible");

    cy.screenshot("LG-001_page_loaded");

  });


  // =====================================================
  // LG-002 - Required fields validation
  // =====================================================

  it("LG-002 - Required fields validation", () => {

    cy.visit(loginUrl);

    cy.get("#wp-submit").click();

    cy.url().should("include", "wp-login.php");

    cy.get("#user_login").should("be.visible");

    cy.get("#user_pass").should("be.visible");

    cy.screenshot("LG-002_required_fields");

  });


  // =====================================================
  // LG-003 - Invalid username
  // =====================================================

  it("LG-003 - Invalid username", () => {

    cy.visit(loginUrl);

    cy.get("#user_login").type("wrongUser");

    cy.get("#user_pass").type(password);

    cy.get("#wp-submit").click();

    cy.get("#login_error")
      .should("contain.text", "Error");

    cy.screenshot("LG-003_invalid_username");

  });


  // =====================================================
  // LG-004 - Invalid password
  // =====================================================

  it("LG-004 - Invalid password", () => {

    cy.visit(loginUrl);

    cy.get("#user_login").type(username);

    cy.get("#user_pass").type("WrongPassword123");

    cy.get("#wp-submit").click();

    cy.get("#login_error")
      .should("contain.text", "Error");

    cy.screenshot("LG-004_invalid_password");

  });


  // =====================================================
  // LG-005 - Invalid credentials
  // =====================================================

  it("LG-005 - Invalid credentials", () => {

    cy.visit(loginUrl);

    cy.get("#user_login").type("UnknownUser");

    cy.get("#user_pass").type("UnknownPassword");

    cy.get("#wp-submit").click();

    cy.get("#login_error")
      .should("be.visible");

    cy.screenshot("LG-005_invalid_credentials");

  });


  // =====================================================
  // LG-006 - Forgot Password page opens
  // =====================================================

  it("LG-006 - Forgot Password page opens", () => {

    cy.visit(loginUrl);

    cy.contains("Lost your password?")
      .click();

    cy.url()
      .should("include", "lostpassword");

    cy.get("#user_login")
      .should("be.visible");

    cy.screenshot("LG-006_forgot_password_page");

  });


  // =====================================================
  // LG-007 - Reset request with valid username
  // =====================================================

  it("LG-007 - Reset request with valid username", () => {

    cy.visit(forgotUrl);

    cy.get("#user_login")
      .type(username);

    cy.get("#wp-submit")
      .click();

    cy.contains("Check your email")
      .should("be.visible");

    cy.screenshot("LG-007_reset_request_success");

  });


  // =====================================================
  // LG-008 - Reset request with invalid username
  // =====================================================

  it("LG-008 - Reset request with invalid username", () => {

    cy.visit(forgotUrl);

    cy.get("#user_login")
      .type("NoSuchUser123456");

    cy.get("#wp-submit")
      .click();

    cy.contains("Error")
      .should("be.visible");

    cy.screenshot("LG-008_reset_request_invalid");

  });


  // =====================================================
  // LG-009 - Successful login
  // =====================================================

  it("LG-009 - Successful login", () => {

    cy.loginAsStudent();

    cy.url()
      .should("not.include", "wp-login.php");

    cy.contains("Home")
      .should("be.visible");

    cy.screenshot("LG-009_login_success");

  });


  // =====================================================
  // LG-010 - User reaches Home Dashboard
  // =====================================================

  it("LG-010 - User reaches Home Dashboard", () => {

    cy.loginAsStudent();

    cy.url()
      .should("eq", "https://student.michaelkentburns.com/");

    cy.contains("Home")
      .should("be.visible");

    cy.contains("All Surveys")
      .should("be.visible");

    cy.contains("My Completed Surveys")
      .should("be.visible");

    cy.screenshot("LG-010_home_dashboard");

  });

});