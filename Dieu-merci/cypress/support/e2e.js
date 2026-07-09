// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "./utils";

Cypress.on("uncaught:exception", (err) => {
  const ignoredMessages = [
    "The response is not a valid JSON response",
    "Unexpected token < in JSON",
    "ResizeObserver loop limit exceeded",
  ];

  if (ignoredMessages.some((message) => err.message.includes(message))) {
    return false;
  }

  return true;
});

// Capture a screenshot after every test and name it by test-title and state.
afterEach(function () {
  const test = this.currentTest || {};
  const title = (test.title || "unknown").replace(/[\\/:*?"<>|]/g, "_");
  const state = test.state || "unknown";
  const screenshotName = `${title} (${state})`;
  // use capture: 'runner' to include the test runner UI; adjust as needed
  cy.screenshot(screenshotName, { capture: "runner" });
});
