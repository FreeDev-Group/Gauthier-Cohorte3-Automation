# Student Survey Application – Automated E2E Testing Report

This repository documents the implementation of automated end-to-end (E2E) tests for the Student Survey Application using Cypress. The objective of this work is to validate the main functional flows of the application from a user perspective and to provide a structured, maintainable testing framework for future execution and reporting.

## 1. Project Objective

The project aims to verify the reliability and correctness of core business workflows by automating critical user interactions. These automated tests simulate real user behavior and help ensure that the application remains functional as the system evolves.

## 2. Scope of the Testing Work

The test suite covers the following functional use cases:

- User authentication
- Account creation
- Survey submission and feedback entry
- Survey management operations
- Review of completed feedback

## 3. Testing Tools and Environment

- Framework: Cypress
- Test Type: End-to-End (E2E)
- Application Under Test: Student Survey Application
- Test Approach: Scenario-based validation aligned with business use cases

## 4. Installation and Execution

### Prerequisites

The following tools are required:

- Node.js
- npm

### Installation

Run the following command from the project root:

```bash
npm install
```

### Launch the Cypress Test Runner

```bash
npx cypress open
```

### Execute Tests from the Terminal

To run a specific test suite:

```bash
npx cypress run --spec cypress/e2e/UC-Login/login.cy.js --browser electron
```

To run the full test suite:

```bash
npx cypress run --browser electron
```

### Environment Configuration

Some tests may require environment variables such as:

- WORDPRESS_STUDENT_USER
- WORDPRESS_STUDENT_PASSWORD

These values should be configured before execution, depending on the target environment.

## 5. Repository Structure

The project is organized by use case to keep the testing documentation clear and maintainable.

- [cypress/e2e/UC-Login](cypress/e2e/UC-Login)
- [cypress/e2e/UC-CreateAccount](cypress/e2e/UC-CreateAccount)
- [cypress/e2e/UC-ProvideFeedback](cypress/e2e/UC-ProvideFeedback)
- [cypress/e2e/UC-ManageSurveys](cypress/e2e/UC-ManageSurveys)
- [cypress/e2e/UC-ReviewFeedback](cypress/e2e/UC-ReviewFeedback)

Each folder contains a dedicated README describing the objective, scope, and execution method of the corresponding test suite.

## 6. Use Case Summary

| Use Case | Folder | Purpose |
| --- | --- | --- |
| Login | [cypress/e2e/UC-Login](cypress/e2e/UC-Login) | Validates the authentication workflow |
| Create Account | [cypress/e2e/UC-CreateAccount](cypress/e2e/UC-CreateAccount) | Covers registration and validation scenarios |
| Provide Feedback | [cypress/e2e/UC-ProvideFeedback](cypress/e2e/UC-ProvideFeedback) | Verifies survey answering and submission |
| Manage Surveys | [cypress/e2e/UC-ManageSurveys](cypress/e2e/UC-ManageSurveys) | Covers survey creation and management actions |
| Review Feedback | [cypress/e2e/UC-ReviewFeedback](cypress/e2e/UC-ReviewFeedback) | Validates feedback history and review flows |

## 7. Conclusion

This documentation provides a professional structure for the Cypress testing work carried out in this project. It is intended to support future maintenance, execution, and evaluation of the automated test suites in a clear and organized manner.

