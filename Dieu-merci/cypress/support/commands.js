/**
 * Custom Cypress Commands for Student Survey Application
 * Production-ready reusable commands for authentication, surveys, and feedback
 */

// ============================================================================
// AUTHENTICATION COMMANDS
// ============================================================================

/**
 * Login to the application with provided credentials
 * @param {string} username - WordPress username
 * @param {string} password - WordPress password
 */
Cypress.Commands.add("login", (username, password) => {
  cy.visit("/wp-login.php");
  cy.get("#loginform #user_login").clear().type(username);
  cy.get("#loginform #user_pass").clear().type(password);
  cy.get("#loginform #wp-submit").click();

  // Wait for successful login - verify URL and dashboard presence
  cy.url().should("not.include", "wp-login.php");
  cy.url().should("not.include", "redirect_to");
  cy.get("body").should("not.contain", "Invalid username");
  cy.get("body").should("not.contain", "incorrect password");
});

/**
 * Login with invalid credentials and verify error
 * @param {string} username - WordPress username
 * @param {string} password - WordPress password
 */
Cypress.Commands.add("loginWithError", (username, password) => {
  cy.visit("/wp-login.php");
  cy.get("#loginform #user_login").clear().type(username);
  cy.get("#loginform #user_pass").clear().type(password);
  cy.get("#loginform #wp-submit").click();

  // Verify error message displayed
  cy.get("#login_error").should("be.visible");
});

/**
 * Logout from the application
 */
Cypress.Commands.add("logout", () => {
  cy.visit("/wp-admin/");
  cy.get('a[href*="wp-logout.php"]').first().click();
  cy.url().should("include", "wp-login.php");
});

/**
 * Register a new user account
 * @param {string} email - Email address
 * @param {string} username - Username
 * @param {string} password - Password
 */
Cypress.Commands.add("register", (email, username, password) => {
  cy.visit("/wp-login.php?action=register");

  // Fill registration form
  cy.get("#registerform #user_email").clear().type(email);
  cy.get("#registerform #user_login").clear().type(username);
  cy.get("#registerform #user_pass").clear().type(password);
  cy.get("#registerform #user_confirm_password").clear().type(password);

  // Submit form
  cy.get("#registerform #wp-submit").click();

  // Verify success
  cy.get("body").should("contain", "Registration complete");
});

/**
 * Request password recovery
 * @param {string} identifier - Email or username
 */
Cypress.Commands.add("requestPasswordReset", (identifier) => {
  cy.visit("/wp-login.php?action=lostpassword");
  cy.get("#lostpasswordform #user_login").clear().type(identifier);
  cy.get("#lostpasswordform #wp-submit").click();

  // Verify confirmation message
  cy.get("body").should("contain", "Password reset");
});

// ============================================================================
// SURVEY MANAGEMENT COMMANDS
// ============================================================================

/**
 * Create a new survey via WordPress dashboard
 * @param {object} surveyData - Survey data object
 * @param {string} surveyData.title - Survey title
 * @param {string} surveyData.description - Survey description
 */
Cypress.Commands.add("createSurvey", (surveyData) => {
  cy.visit("/wp-admin/post-new.php?post_type=survey");

  // Fill survey title
  cy.get("#title").clear().type(surveyData.title);

  // Fill survey description if available
  if (surveyData.description) {
    cy.get("#content").clear().type(surveyData.description);
  }

  // Publish survey
  cy.get("#publish").click();

  // Verify success
  cy.get(".notice-success").should("be.visible");
  cy.url().should("include", "post=");
});

/**
 * Edit an existing survey
 * @param {object} surveyData - Updated survey data
 * @param {string} surveyData.title - New survey title
 * @param {string} surveyData.description - New survey description
 */
Cypress.Commands.add("editSurvey", (surveyData) => {
  if (surveyData.title) {
    cy.get("#title").clear().type(surveyData.title);
  }

  if (surveyData.description) {
    cy.get("#content").clear().type(surveyData.description);
  }

  cy.get("#publish").click();
  cy.get(".notice-success").should("be.visible");
});

/**
 * Delete a survey from the dashboard
 * @param {string} surveyTitle - Title of survey to delete
 */
Cypress.Commands.add("deleteSurvey", (surveyTitle) => {
  cy.visit("/wp-admin/edit.php?post_type=survey");

  // Find and hover over survey
  cy.get("a.row-title").each(($el) => {
    if ($el.text() === surveyTitle) {
      cy.wrap($el).parent().parent().trigger("mouseover");
      cy.wrap($el).parent().parent().find("a.submitdelete").click();
      cy.on("window:confirm", () => true);
    }
  });

  cy.get(".notice-success").should("be.visible");
});

// ============================================================================
// SURVEY COMPLETION COMMANDS
// ============================================================================

/**
 * Open a survey by slug
 * @param {string} surveySlug - Survey slug from URL
 */
Cypress.Commands.add("openSurvey", (surveySlug) => {
  cy.visit(`/survey/${surveySlug}/`);
  cy.get('form[id*="survey"]').should("be.visible");
});

/**
 * Submit a survey with provided answers
 * @param {object} answers - Object with field names as keys and values
 */
Cypress.Commands.add("submitSurvey", (answers) => {
  Object.entries(answers).forEach(([fieldName, fieldValue]) => {
    cy.get(`[name="${fieldName}"]`).then(($field) => {
      const fieldType = $field.attr("type");

      if (fieldType === "radio") {
        cy.get(`input[name="${fieldName}"][value="${fieldValue}"]`).click();
      } else if (fieldType === "checkbox") {
        cy.get(`input[name="${fieldName}"][value="${fieldValue}"]`).check();
      } else if ($field.is("textarea")) {
        cy.wrap($field).clear().type(fieldValue);
      } else if ($field.is("select")) {
        cy.wrap($field).select(fieldValue);
      } else {
        cy.wrap($field).clear().type(fieldValue);
      }
    });
  });

  // Submit form
  cy.get('form button[type="submit"]').click();

  // Verify submission success
  cy.get(".success-message, .survey-submitted").should("be.visible");
});

/**
 * Answer a radio button question
 * @param {string} questionName - Field name of the question
 * @param {string} answer - Value of the selected option
 */
Cypress.Commands.add("answerRadio", (questionName, answer) => {
  cy.get(`input[name="${questionName}"][value="${answer}"]`).check();
});

/**
 * Answer a checkbox question
 * @param {string} questionName - Field name of the question
 * @param {string|array} answers - Single value or array of values
 */
Cypress.Commands.add("answerCheckbox", (questionName, answers) => {
  const answerArray = Array.isArray(answers) ? answers : [answers];
  answerArray.forEach((answer) => {
    cy.get(`input[name="${questionName}"][value="${answer}"]`).check();
  });
});

/**
 * Answer a text field question
 * @param {string} questionName - Field name of the question
 * @param {string} answer - Text answer
 */
Cypress.Commands.add("answerText", (questionName, answer) => {
  cy.get(`[name="${questionName}"]`).clear().type(answer);
});

/**
 * Answer a dropdown question
 * @param {string} questionName - Field name of the question
 * @param {string} answer - Value to select
 */
Cypress.Commands.add("answerDropdown", (questionName, answer) => {
  cy.get(`select[name="${questionName}"]`).select(answer);
});

// ============================================================================
// FEEDBACK REVIEW COMMANDS
// ============================================================================

/**
 * Navigate to completed surveys page
 */
Cypress.Commands.add("openCompletedSurveys", () => {
  cy.visit("/my-completed-surveys/");
  cy.get("body").should("contain", "Completed Surveys");
});

/**
 * View responses for a survey
 * @param {string} surveyTitle - Title of the survey
 */
Cypress.Commands.add("viewSurveyResponses", (surveyTitle) => {
  cy.visit("/wp-admin/edit.php?post_type=survey");
  cy.get("a.row-title").contains(surveyTitle).click();
  cy.get(".survey-responses, .responses-list").should("be.visible");
});

// ============================================================================
// UTILITY COMMANDS
// ============================================================================

/**
 * Wait for and verify page load
 * @param {string} url - URL to visit
 */
Cypress.Commands.add("visitPage", (url) => {
  cy.visit(url);
  cy.get('main, .content, [role="main"]').should("be.visible");
});

/**
 * Check for validation error message
 * @param {string} fieldName - Name of the field
 * @param {string} errorMessage - Expected error message
 */
Cypress.Commands.add("shouldHaveError", (fieldName, errorMessage) => {
  cy.get(`[name="${fieldName}"]`).parent().should("contain", errorMessage);
});

/**
 * Fill a form field by label text
 * @param {string} labelText - Label text
 * @param {string} value - Value to fill
 */
Cypress.Commands.add("fillByLabel", (labelText, value) => {
  cy.contains("label", labelText)
    .parent()
    .find("input, textarea, select")
    .clear()
    .type(value);
});

/**
 * Clear all form fields
 */
Cypress.Commands.add("clearForm", () => {
  cy.get('form input[type="text"], form textarea, form select').each(
    ($field) => {
      cy.wrap($field).clear();
    },
  );
  cy.get('form input[type="radio"], form input[type="checkbox"]').each(
    ($field) => {
      cy.wrap($field).uncheck();
    },
  );
});

/**
 * Verify element is visible and enabled
 * @param {string} selector - CSS selector
 */
Cypress.Commands.add("shouldBeActive", (selector) => {
  cy.get(selector).should("be.visible").should("not.be.disabled");
});

/**
 * Generate unique test data
 * @returns {object} Object with unique email and username
 */
Cypress.Commands.add("generateTestUser", () => {
  const timestamp = Date.now();
  return {
    email: `test${timestamp}@example.com`,
    username: `testuser${timestamp}`,
    password: "TestPassword@2026",
  };
});
