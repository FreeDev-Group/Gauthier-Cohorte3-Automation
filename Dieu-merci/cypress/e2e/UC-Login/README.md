# UC-Login Test Suite Report

This section presents the automated end-to-end tests implemented for the Login use case. The purpose of this suite is to verify that the authentication flow functions correctly and that the application responds appropriately to both valid and invalid login attempts.

## Objective

The main objective of this test suite is to confirm that a user can successfully authenticate, that the application handles authentication errors correctly, and that the login interface behaves as expected under normal and exceptional conditions.

## Covered Scenarios

The following scenarios are covered:

- Successful login with valid credentials
- Failed login with invalid credentials
- Correct handling of redirects or access restrictions after authentication
- Validation of the login form behavior

## Test File

- [login.cy.js](login.cy.js)

## Execution Command

From the project root, run:

```bash
npx cypress run --spec cypress/e2e/UC-Login/login.cy.js --browser electron
```

## Notes

These tests depend on the configured application URL and the relevant environment variables used for authentication.
