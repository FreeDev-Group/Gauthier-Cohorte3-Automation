# UC-ManageSurveys Test Suite Report

This section documents the automated end-to-end tests implemented for the Manage Surveys use case. The purpose of this suite is to verify that survey management operations can be completed successfully within the application workflow.

## Objective

The objective of this test suite is to validate the main administrative actions related to survey management, including survey creation, modification, and deletion.

## Covered Scenarios

The following scenarios are covered:

- Creating a new survey
- Editing an existing survey
- Deleting a survey
- Validating common management actions
- Checking the expected behavior of survey publishing or update flows

## Test Files

- [manage-surveys.cy.js](manage-surveys.cy.js)
- [smoke-create-survey.cy.js](smoke-create-survey.cy.js)
- [instructor-create-questions.cy.js](instructor-create-questions.cy.js)

## Execution Commands

To run the main suite:

```bash
npx cypress run --spec cypress/e2e/UC-ManageSurveys/manage-surveys.cy.js --browser electron
```

To run the complete management test set:

```bash
npx cypress run --spec cypress/e2e/UC-ManageSurveys/*.cy.js --browser electron
```

## Notes

These tests depend on the survey management features exposed by the application and may require an authenticated user with the appropriate permissions.
