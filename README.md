# Student Survey App – Automated End-to-End (E2E) Testing

This repository contains the automated End-to-End (E2E) test suite for the **Student Survey Application**, developed using **Cypress**.

The project was created as a collaborative QA automation exercise where each team member independently implements automated tests based on the same functional requirements.

The objective is to improve automation testing skills while following a professional workflow similar to a real software testing team.

---

# Project Overview

### Application Under Test

Student Survey Application

### Testing Framework

Cypress

### Test Type

End-to-End (E2E)

### Programming Language

JavaScript

### Goal

Validate the main features of the Student Survey Application through automated testing while maintaining independent implementations for each contributor.

---

# Team

| Role              | Name       |
| ----------------- | ---------- |
| Mentor / Reviewer | Gautier    |
| QA Engineer       | Arnold     |
| QA Engineer       | Edouard    |
| QA Engineer       | Dieu-merci |

Each team member writes and maintains their own Cypress tests. Although everyone tests the same use cases, each implementation is independent.

---

# Completed Use Cases

The following use cases have been completed and validated.

* ✅ UC-Register
* ✅ UC-Login
* ✅ UC-Provide Feedback
* ✅ UC-Review Past Feedback

Each use case is implemented separately by every contributor.

---

# Project Structure

```
Doc/
│
├── use-cases/
│   ├── UC-Login.md
│   ├── UC-CreateAccount.md
│   ├── UC-ProvideFeedback.md
│   ├── UC-ManageSurveys.md
│   └── UC-ReviewFeedback.md
│
└── users/
    ├── student.md
    ├── instructor.md
    └── administrator.md

Arnold/
│
├── UC-Login/
├── UC-CreateAccount/
├── UC-ProvideFeedback/
├── UC-ManageSurveys/
├── UC-ReviewFeedback/
└── test-reports/

Edouard/
│
├── UC-Login/
├── UC-CreateAccount/
├── UC-ProvideFeedback/
├── UC-ManageSurveys/
├── UC-ReviewFeedback/
└── test-reports/

Dieu-merci/
│
├── UC-Login/
├── UC-CreateAccount/
├── UC-ProvideFeedback/
├── UC-ManageSurveys/
├── UC-ReviewFeedback/
└── test-reports/

cypress/
├── fixtures/
├── support/
└── downloads/

cypress.config.js
package.json
README.md
.gitignore
```

---

# Installation Guide

## 1. Clone the repository

```bash
git clone <repository-url>
```

Enter the project folder.

```bash
cd Student-Survey-App
```

---

## 2. Install Node.js

Download and install the latest LTS version of Node.js.

After installation, verify that Node.js and npm are available.

```bash
node -v
```

```bash
npm -v
```

---

## 3. Install project dependencies

Run the following command.

```bash
npm install
```

This installs every package required by the project, including Cypress.

---

## 4. Install Cypress (Optional)

If Cypress is not installed automatically, run:

```bash
npm install cypress --save-dev
```

Verify the installation.

```bash
npx cypress -v
```

Example:

```
Cypress package version: 15.x.x
Cypress binary version: 15.x.x
```

---

# Running Cypress

## Open Cypress Test Runner

```bash
npx cypress open
```

or

```bash
npx cypress open
```

The Cypress interface will open, allowing you to execute tests interactively.

---

## Run tests in headless mode

```bash
npx cypress run
```

To use Chrome:

```bash
npx cypress run --browser chrome
```

---

# Test Organization

Each contributor maintains an independent workspace.

Example:

```
Arnold/
    UC-Register/
    UC-Login/
    UC-ProvideFeedback/
    UC-ReviewFeedback/

Edouard/
    ...

Dieu-merci/
    ...
```

No contributor modifies another contributor's implementation.

---

# Documentation

The `Doc` directory contains all project documentation.

It includes:

* Functional requirements
* Use Cases
* User roles
* Expected system behavior
* Alternative scenarios

Every automated test should follow these documents.

---

# Testing Principles

This project follows the following rules:

* Independent implementation
* Same functional requirements
* No shared test logic
* Clean and readable code
* Reproducible automated tests
* Professional project organization

---

# Test Reports

Each contributor stores their reports inside their own `test-reports` folder.

Reports may include:

* Executed scenarios
* Test results
* Identified bugs
* Screenshots
* Recommendations

---

# Branch Strategy

| Branch  | Description        |
| ------- | ------------------ |
| main    | Stable version     |
| develop | Active development |

Every change should be reviewed before being merged into the `main` branch.

---

# Project Objectives

This project helps contributors develop practical experience in:

* QA Automation
* Cypress
* End-to-End Testing
* Software Quality Assurance
* Team Collaboration
* Git and GitHub
* Professional Testing Practices

---

# Technologies Used

* Cypress
* JavaScript
* Node.js
* Git
* GitHub

---

# Contributors

* Gautier (Mentor)
* Arnold
* Edouard
* Dieu-merci

---

# License

This repository is intended for educational purposes and QA automation practice.
