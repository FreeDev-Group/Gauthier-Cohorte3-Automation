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
  cy.request({
    method: "POST",
    url: "/wp-login.php",
    form: true,
    body: {
      log: username,
      pwd: password,
      "wp-submit": "Log In",
      redirect_to: "/wp-admin/",
      testcookie: 1,
    },
    failOnStatusCode: false,
  }).then((response) => {
    expect([200, 302]).to.include(response.status);
  });
  cy.visit("/wp-admin/", { failOnStatusCode: false, timeout: 180000 });
  cy.get("body", { timeout: 20000 }).should(($body) => {
    const text = $body.text().toLowerCase();
    const hasAuthError =
      text.includes("invalid username") ||
      text.includes("incorrect password") ||
      text.includes("cookies are blocked");
    expect(
      hasAuthError,
      "Login should not remain on the login page with an authentication error",
    ).to.be.false;
  });
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
  cy.visit("/wp-admin/", { failOnStatusCode: false });
  cy.get("body").then(($body) => {
    const logoutLink = $body.find('a[href*="wp-logout.php"]');
    if (logoutLink.length > 0) {
      cy.wrap(logoutLink.first()).click();
      cy.url({ timeout: 20000 }).should("include", "wp-login.php");
    } else {
      cy.clearCookies();
      cy.visit("/wp-login.php", { failOnStatusCode: false });
    }
  });
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
 * Helper to fill the WordPress classic editor content.
 * Supports TinyMCE visual editor, visible textarea editor, and hidden textarea fallback.
 * @param {string} content - Survey/content text to set
 */
Cypress.Commands.add("fillWpEditor", (content) => {
  const attemptTinyMCE = () =>
    cy.window().then((win) => {
      const editor =
        (win.tinyMCE && win.tinyMCE.activeEditor) ||
        (win.tinymce && win.tinymce.activeEditor);

      if (editor && typeof editor.setContent === "function") {
        editor.setContent(content);
        if (typeof win.tinyMCE?.triggerSave === "function") {
          win.tinyMCE.triggerSave();
        }
        if (typeof win.tinymce?.triggerSave === "function") {
          win.tinymce.triggerSave();
        }
        return true;
      }

      return false;
    });

  const attemptTextarea = () =>
    cy
      .get(
        "textarea#content, textarea.wp-editor-area, textarea#survey_description",
        {
          timeout: 20000,
        },
      )
      .then(($textarea) => {
        const $visibleTextarea = $textarea.filter(":visible");

        if ($visibleTextarea.length) {
          cy.wrap($visibleTextarea.first())
            .clear({ force: true })
            .type(content, { delay: 0 });
          return;
        }

        cy.wrap($textarea.first())
          .invoke("val", content)
          .trigger("input")
          .trigger("change");
      });

  attemptTinyMCE().then((usedTinyMCE) => {
    if (!usedTinyMCE) {
      attemptTextarea();
    }
  });
});

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
    cy.fillWpEditor(surveyData.description);
  }

  // Publish survey
  cy.get("body").then(($body) => {
    const candidates = Cypress.$(
      "#publish, #save-post, button[type='submit'], input[type='submit']",
      $body,
    ).filter(":visible");
    const target = candidates.filter((_, el) => {
      const text = Cypress.$(el).text().trim().toLowerCase();
      const value = (el.value || "").trim().toLowerCase();
      return text.includes("publish") || value.includes("publish");
    });
    const action = target.length ? target.first() : candidates.first();
    cy.wrap(action).click({ force: true });
  });

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
    cy.fillWpEditor(surveyData.description);
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
 * Open the first survey link available on the current page.
 */
Cypress.Commands.add("openFirstSurvey", () => {
  cy.get("body").then(($body) => {
    const surveyLinks = Cypress.$('a[href*="/survey/"]', $body).filter(
      (_, link) => {
        const href = Cypress.$(link).attr("href") || "";
        return href.includes("/survey/") && !href.includes("page");
      },
    );

    if (surveyLinks.length === 0) {
      cy.log("No survey link is available on the page.");
      return;
    }

    cy.wrap(surveyLinks.first()).click({ force: true });
    cy.location("pathname", { timeout: 20000 }).should("include", "/survey/");
  });
});

/**
 * Fill the first available answer field in a survey form.
 * Supports radio, checkbox, text inputs, and textareas.
 */
Cypress.Commands.add("fillSurveyForm", () => {
  cy.get("body").then(($body) => {
    const form = Cypress.$("form", $body);
    if (form.length === 0) {
      cy.log("No survey form is available to fill.");
      return;
    }

    if (form.find('input[type="radio"]').length > 0) {
      cy.get('input[type="radio"]').first().check({ force: true });
      return;
    }

    if (form.find('input[type="checkbox"]').length > 0) {
      cy.get('input[type="checkbox"]').first().check({ force: true });
      return;
    }

    if (form.find('input[type="text"]:not([type="hidden"])').length > 0) {
      cy.get('input[type="text"]:not([type="hidden"])')
        .first()
        .clear({ force: true })
        .type("Test answer", { force: true });
      return;
    }

    if (form.find("textarea").length > 0) {
      cy.get("textarea").first().clear({ force: true }).type("Test feedback", {
        force: true,
      });
    }
  });
});

/**
 * Submit the current survey form if it exists.
 */
Cypress.Commands.add("submitSurveyForm", () => {
  cy.get("body").then(($body) => {
    const form = $body.find("form");
    if (form.length === 0) {
      cy.log("No survey form is available to submit.");
      return;
    }

    cy.get('button[type="submit"], input[type="submit"]')
      .first()
      .click({ force: true });
  });
});

/**
 * Assert that the current page contains one of the expected feedback keywords.
 * @param {RegExp[]} patterns - Array of regex patterns to match against the page text.
 */
Cypress.Commands.add("assertSurveyFeedbackState", (patterns = []) => {
  cy.get("body").then(($body) => {
    const pageText = $body.text().toLowerCase();
    const hasMatch = patterns.some((pattern) => pattern.test(pageText));
    expect(hasMatch, `Expected page text to match one of ${patterns.length} patterns`).to.be.true;
  });
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
