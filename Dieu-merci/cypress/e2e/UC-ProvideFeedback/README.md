# UC-ProvideFeedback Test Suite Report

This section documents the automated end-to-end tests implemented for the Provide Feedback use case. The purpose of this suite is to verify that a student can access a survey, complete the required fields, and submit feedback successfully.

## Objective

The objective of this test suite is to validate the end-to-end feedback submission process, including survey access, question answering, submission, and validation of required information.

## Covered Scenarios

The following scenarios are covered:

- Accessing an available survey
- Filling the survey form with valid responses
- Submitting feedback successfully
- Handling validation errors for missing required answers
- Managing access behavior when the user is not authenticated

## Test File

- [provide-feedback.cy.js](provide-feedback.cy.js)

## Execution Command

From the project root, run:

```bash
npx cypress run --spec cypress/e2e/UC-ProvideFeedback/provide-feedback.cy.js --browser electron
```

## Notes

These tests are designed to remain robust even when the survey interface varies slightly across different application states.
