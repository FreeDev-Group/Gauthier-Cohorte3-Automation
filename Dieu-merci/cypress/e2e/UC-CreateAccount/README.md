# UC-CreateAccount Test Suite Report

This section documents the automated end-to-end tests implemented for the Create Account use case. The purpose of this suite is to verify that the registration flow works correctly and that the system responds appropriately to both valid and invalid user input.

## Objective

The goal of this test suite is to confirm that a new user can successfully create an account and that the application provides the expected feedback when required information is missing or invalid.

## Covered Scenarios

The following scenarios are covered:

- Successful account registration with valid data
- Validation of required fields
- Handling of invalid user input
- Confirmation or error behavior after submission

## Test File

- [create-account.cy.js](create-account.cy.js)

## Execution Command

From the project root, run:

```bash
npx cypress run --spec cypress/e2e/UC-CreateAccount/create-account.cy.js --browser electron
```

## Notes

The outcome of these tests depends on the registration behavior of the application and the expected user interface messages displayed after submission.
