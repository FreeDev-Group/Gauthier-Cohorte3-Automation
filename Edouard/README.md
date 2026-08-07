# Edouard - Cypress End-to-End Automation Tests

## Project Overview

This directory contains all End-to-End (E2E) automated test scenarios developed by **Edouard KIZA NDENGO** for the **Student Survey System** as part of the **MKB Cohort 3 Automation Testing Program**.

The automated tests were implemented using **Cypress** following the project's functional requirements and use cases. The objective is to verify that the main features of the application work correctly from the perspective of both instructors and students.

The project follows a modular organization where each major use case is grouped into its own folder and documented independently.

---

## Objectives

The purpose of this project is to:

- Automate the main user workflows of the Student Survey System.
- Verify that instructors can successfully create and manage surveys.
- Validate that students can access and answer survey questions correctly.
- Verify survey response analysis and navigation features.
- Produce screenshots, videos, and HTML reports for every execution.
- Apply reusable Cypress commands to improve maintainability and reduce duplicated code.

---

## Technologies Used

The project was developed using the following technologies:

- Cypress 15
- JavaScript (CommonJS)
- Node.js
- npm
- Mochawesome Reporter
- Mochawesome Merge
- Mochawesome Report Generator
- Visual Studio Code
- Git & GitHub

---

## Project Architecture

The **Edouard** directory is organized to separate automated test scenarios, reusable resources, execution reports, and supporting files. This structure improves maintainability, readability, and scalability.

```text
Edouard/
│
├── cypress/
│   ├── e2e/
│   │   └── auth/
│   │       ├── UC Login/
│   │       │   └── login.cy.js
│   │       │
│   │       ├── UC Register/
│   │       │   └── register.cy.js
│   │       │
│   │       ├── UC Manage Survey (Instructor)/
│   │       │   ├── create_survey.cy.js
│   │       │   ├── manage_questions.cy.js
│   │       │   ├── student_view_and_answer_survey.cy.js
│   │       │   └── instructor_navigation.cy.js
│   │       │
│   │       ├── UC AnalyseSurveyFeedback (Instructor)/
│   │       │   └── survey_responses.cy.js
│   │       │
│   │       ├── UC Provide Feedback Student/
│   │       │   └── provide-feedback.cy.js
│   │       │
│   │       └── UC Review Past Feedback/
│   │           └── review-past-feedback.cy.js
│   │
│   ├── reports/
│   ├── screenshots/
│   ├── support/
│   └── videos/
│
├── cypress.config.js
├── package.json
├── package-lock.json
├── project_structure.txt
└── README.md

```

### Directory Description

#### `cypress/e2e/auth`

Contains all End-to-End automated test scenarios grouped by functional use case.

Current implemented use cases include:

- **UC Login**
- **UC Register**
- **UC Manage Survey (Instructor)**
- **UC Analyse Survey Feedback (Instructor)**
- **UC Provide Feedback (Student)**
- **UC Review Past Feedback**

Each use case is maintained independently to improve readability and simplify future maintenance.

## Environment Requirements

Before running the automated tests, make sure the following tools are installed on your machine:

| Tool | Required Version / Information |
|------|------------------------------- |

| Node.js | Recommended LTS version |
| npm | Comes with Node.js |
| Cypress | 15.17.0 |
| Visual Studio Code | Recommended editor |
| Git | Required for repository management |

To verify the installed versions:

```bash
node -v
```

```bash
npm -v
```

```bash
npx cypress version
```

The current project uses:

``` Cypress package version: 15.17.0
Cypress binary version: 15.17.0
Node.js bundled version: 22.19.0
```

---

## Installation

After cloning the repository, navigate to the Edouard directory:

```bash
cd Edouard
```

Install all project dependencies:

```bash
npm install
```

This command installs:

- Cypress
- Cypress Mochawesome Reporter
- Mochawesome
- Mochawesome Merge
- Mochawesome Report Generator

as defined in the `package.json` file.

---

## Opening Cypress

To open Cypress in interactive mode:

```bash
npm run cy:open
```

This launches the Cypress Test Runner, allowing tests to be selected and executed manually.

---

## Running Automated Tests

To execute all tests in headless mode:

```bash
npm run cy:run
```

To execute tests using Google Chrome:

```bash
npm run cy:chrome
```

To execute tests using Microsoft Edge:

```bash
npm run cy:edge
```

---

## Test Execution Workflow

The general workflow used during development was:

``` Install Dependencies
        ↓
Open Cypress Test Runner
        ↓
Develop Test Scenarios
        ↓
Execute Tests
        ↓
Review Screenshots and Videos
        ↓
Generate Reports
        ↓
Commit Changes
        ↓
Push to GitHub
```

## NPM Scripts & Reporting System

The project includes custom npm scripts to simplify Cypress execution and automate test reporting.

All available commands are defined in the `package.json` file.

---

## Cypress Execution Commands

### Open Cypress Test Runner

```bash
npm run cy:open
```

Opens Cypress in interactive mode.

This mode was mainly used during test development to:

- create and debug test scenarios;
- inspect application elements;
- analyze failed assertions;
- validate selectors and user workflows.

---

### Run All Cypress Tests

```bash
npm run cy:run
```

Executes all End-to-End tests in headless mode.

During execution, Cypress automatically generates:

- test results;
- screenshots for failed tests;
- execution videos.

---

### Run Tests with Chrome

```bash
npm run cy:chrome
```

Runs the Cypress test suite using Google Chrome.

---

### Run Tests with Edge

```bash
npm run cy:edge
```

Runs the Cypress test suite using Microsoft Edge.

---

## Mochawesome Reporting System

The project uses Mochawesome to generate detailed HTML test reports.

The reporting workflow is divided into three steps:

```Cypress Execution
        ↓
JSON Report Generation
        ↓
JSON Reports Merge
        ↓
HTML Report Generation
```

---

## Merge Test Reports

Command:

```bash
npm run report:merge
```

This command combines multiple Cypress JSON reports generated during test execution into a single report file:

```cypress/reports/report.json
```

This is useful when several test files are executed separately because it creates one consolidated report.

---

## Generate HTML Report

Command:

```bash
npm run report:generate
```

This command converts the merged JSON report into an interactive HTML report.

The generated report is stored in:

```cypress/reports/html/
```

The HTML report provides:

- test execution summary;
- passed and failed tests;
- execution duration;
- error details;
- screenshots references.

---

## Full Test and Report Generation

Command:

```bash
npm run report:full
```

Runs the complete reporting workflow automatically:

```text
Run Cypress Tests
        ↓
Merge JSON Reports
        ↓
Generate HTML Report
```

Equivalent commands:

```bash
npm run cy:run
npm run report:merge
npm run report:generate
```

---

## Generated Evidence

For documentation and verification purposes, each test execution may generate:

### Screenshots

Location:

``` cypress/screenshots/
```

Used mainly for:

- failed test investigation;
- execution evidence;
- debugging.

---

### Videos

Location:

``` cypress/videos/
```

Used to replay complete test executions.

---

### HTML Reports

Location:

``` cypress/reports/html/
```

Used to provide a readable summary of the complete test execution results.

## Implemented Test Suites

The **Edouard** directory contains several End-to-End automated test suites developed according to the application's functional use cases.

Each test suite focuses on a specific user workflow and validates that the expected behavior of the system is correctly implemented.

---

## UC Login

**Actor:** Student / Instructor

**Purpose:**  
Verify that users can authenticate successfully and access the appropriate areas of the application.

Test scenarios include:

- Successful login with valid credentials.
- Verification of redirection after authentication.
- Verification that users are not redirected back to the login page.
- Validation of user sessions.

Test file:

```cypress/e2e/auth/UC Login/login.cy.js
```

---

## UC Register

**Actor:** Student

**Purpose:**  
Verify the user registration workflow.

Test scenarios include:

- Opening the registration page.
- Checking required registration fields.
- Submitting registration information.
- Verifying successful account creation behavior.

Test file:

```cypress/e2e/auth/UC Register/register.cy.js
```

---

## UC Manage Survey (Instructor)

**Actor:** Instructor

**Purpose:**  
Validate the complete survey management workflow from survey creation to student interaction.

This use case is divided into several test modules.

---

## Create Survey

**Purpose:**

Verify that instructors can create surveys successfully.

Test scenarios include:

- Opening survey management.
- Opening the Add New Survey page.
- Displaying survey creation fields.
- Creating a new survey.
- Verifying successful survey creation.

Test file:

```create_survey.cy.js
```

---

## Manage Questions

**Purpose:**

Verify that instructors can create and manage different types of survey questions.

Test scenarios include:

- Opening question management.
- Creating questions of different types:
  - Text
  - Multiple Choice
  - True/False
  - Email
  - Phone
  - Text Array
  - Radio Button
  - Date
  - Number
  - File Upload
  - Checkbox
  - Time
  - Range
- Editing an existing question.
- Moving a question to trash.

Test file:

```manage_questions.cy.js
```

---

## Student View and Answer Survey

**Actor:** Student

**Purpose:**

Verify that students can access created surveys and interact with survey questions.

Test scenarios include:

- Student authentication.
- Opening available surveys.
- Opening a specific survey.
- Displaying all created questions.
- Filling different question types.
- Selecting options without submitting the survey.

Test file:

```student_view_and_answer_survey.cy.js
```

---

## Instructor Navigation

**Actor:** Instructor

**Purpose:**

Verify that the main administration menu items are accessible.

Validated sections include:

- Dashboard
- Posts
- Questions
- Survey Responses
- Surveys
- Comments
- Profile
- Tools
- Collapse Menu

Test file:

```instructor_navigation.cy.js
```

---

## UC Analyse Survey Feedback

**Actor:** Instructor

**Purpose:**

Verify that instructors can access and review collected survey responses.

Test scenarios include:

- Opening the Survey Responses section.
- Displaying surveys grouped by title.
- Displaying student responses.
- Verifying submitted answers.
- Checking feedback modification fields.
- Saving instructor feedback.

Test file:

```survey_responses.cy.js
```

---

## UC Provide Feedback

**Actor:** Student

**Purpose:**

Verify that students can submit feedback through the feedback system.

Test file:

```provide-feedback.cy.js
```

---

## UC Review Past Feedback

**Actor:** Student

**Purpose:**

Verify that students can access previously submitted feedback.

Test file:

```review-past-feedback.cy.js
```

---

## Summary of Automated Coverage

| Use Case | Actor | Status |
|----------|-------|--------|

| Login | Student / Instructor | Automated |
| Register | Student | Automated |
| Manage Survey | Instructor / Student | Automated |
| Analyse Survey Feedback | Instructor | Automated |
| Provide Feedback | Student | Automated |
| Review Past Feedback | Student | Automated |

## Custom Cypress Commands & Test Design Approach

To improve test maintainability and reduce duplicated code, the project uses custom Cypress commands and reusable helper functions.

These components centralize common actions such as authentication, navigation, and form interactions.

---

## Custom Cypress Commands

Custom commands are defined in:

```cypress/support/commands.js
```

They are loaded automatically by Cypress before executing test files.

---

## Authentication Commands

### cy.loginAsInstructor()

Purpose:

Authenticate the user with an Instructor account before executing instructor-related test scenarios.

Used in:

- Create Survey tests
- Manage Questions tests
- Survey Responses tests
- Instructor Navigation tests

Example:

```javascript
cy.loginAsInstructor();
```

Workflow:

```Open Login Page
        ↓
Enter Instructor Credentials
        ↓
Submit Login Form
        ↓
Verify Successful Authentication
```

---

### cy.loginAsStudent()

Purpose:

Authenticate the user with a Student account before executing student-related scenarios.

Used in:

- Student View and Answer Survey tests
- Student feedback-related tests

Example:

```javascript
cy.loginAsStudent();
```

---

## Navigation Commands

## cy.openQuestionManagement()

Purpose:

Navigate directly to the Questions management section.

Used to avoid repeating navigation logic in every question management test.

Example:

```javascript
cy.openQuestionManagement();
```

---

## cy.openCreateQuestion()

Purpose:

Open the Add New Question page.

Used for creating different question types.

Example:

```javascript
cy.openCreateQuestion();
```

---

## Survey Selection Command

## cy.selectSurvey()

Purpose:

Select a survey from the survey dropdown when creating a question.

Example:

```javascript
cy.selectSurvey(
    "Participant Program Expectations Survey - Edo"
);
```

This ensures that created questions are correctly associated with the selected survey.

---

## Question Type Command

## cy.selectQuestionType()

Purpose:

Select the appropriate question type during question creation.

Supported types tested include:

- Text
- Multiple Choice
- True/False
- Email
- Phone
- Text Array
- Radio Button
- Date
- Number
- File Upload
- Checkbox
- Time
- Range

Example:

```javascript
cy.selectQuestionType("text");
```

---

## Reusable Test Helpers

In addition to Cypress commands, reusable JavaScript helper functions are used inside test files.

Example:

```javascript
function createQuestion(title, type) {

    cy.openCreateQuestion();

    cy.get("#title")
        .type(title);

    cy.selectSurvey(
        SURVEY_NAME
    );

    cy.selectQuestionType(
        type
    );

    cy.get("#publish")
        .click();

}
```

This approach avoids rewriting the same workflow for every question type.

---

## Test Design Principles

The test suites follow these principles:

## 1. Independent Test Scenarios

Each test validates one specific behavior.

Example:

```MQ-004 - should create Text question successfully
```

Instead of combining multiple unrelated actions in one test.

---

## 2. Clear Test Identification

Each scenario uses a unique identifier.

Examples:

```CS-001
MQ-010
AN-005
```

Benefits:

- easier debugging;
- easier report analysis;
- easier mapping with Use Cases.

---

## 3. Before Each Setup

Common preparation steps are executed before each test.

Examples:

- Login.
- Navigate to required page.
- Prepare test environment.

Example:

```javascript
beforeEach(() => {

    cy.loginAsInstructor();

});
```

---

## 4. Exception Handling

The application occasionally returns WordPress REST API JSON errors:

```The response is not a valid JSON response
```

These errors are ignored when they do not affect the tested functionality.

Example:

```javascript
Cypress.on(
    "uncaught:exception",
    (err) => {

        if(
            err.message.includes(
                "The response is not a valid JSON response"
            )
        ){
            return false;
        }

    }
);
```

This allows Cypress to continue validating the expected user behavior.

---

## Benefits of This Architecture

The implemented approach provides:

- Less duplicated code.
- Easier test maintenance.
- Better readability.
- Faster creation of new test scenarios.
- Consistent authentication and navigation handling.

---

## Project Statistics

At the time of writing, this project includes automated End-to-End tests covering multiple functional areas of the Student Survey System.

Current coverage includes:

- User authentication
- User registration
- Survey creation
- Question management
- Student survey participation
- Survey response analysis
- Instructor administration navigation
- Student feedback management

The test suite continues to evolve as new application features are implemented.

---

## Lessons Learned

Developing this project provided practical experience in several important software testing concepts, including:

- Designing maintainable End-to-End test suites.
- Creating reusable Cypress custom commands.
- Working with dynamic WordPress interfaces.
- Building robust selectors for unstable pages.
- Handling asynchronous application behavior.
- Managing reusable authentication sessions.
- Organizing tests using functional use cases.
- Generating professional HTML execution reports.
- Using Git and GitHub to manage automated testing projects.

---

## Future Improvements

Possible future enhancements include:

- Increasing functional test coverage for newly added features.
- Adding API testing where applicable.
- Integrating visual regression testing.
- Running automated tests through GitHub Actions.
- Adding performance and accessibility testing.
- Improving data-driven testing using fixtures.
- Increasing cross-browser testing coverage.

---

## Author

### **Edouard KIZA NDENGO**

Front-End Web Developer, Software Tester, and Public Health Student with a strong interest in software quality assurance, web application development, and automation testing.

This project reflects practical experience in designing, organizing, and implementing End-to-End automated test suites using Cypress. It demonstrates the application of modern testing practices, reusable test architecture, custom Cypress commands, automated reporting, and Git/GitHub version control within a real-world web application.

### **Technical Interests**

- Front-End Web Development
- End-to-End Test Automation
- Software Quality Assurance (QA)
- Cypress Testing
- JavaScript
- UI Testing
- Git & GitHub
- Continuous Learning

GitHub: [https://github.com/edouardkne](https://github.com/edouardkne)

---

## License

This repository was developed as part of the **MKB Cohort 3 Automation Testing Program** for educational and portfolio purposes.

The source code and documentation are intended to demonstrate software testing skills and may be reused or adapted for learning with appropriate attribution.

---

## Acknowledgements

Special thanks to:

- Michael Kent Burns for creating the Student Survey System used throughout the automation exercises.
- The MKB Cohort 3 Automation Testing Program for providing the learning environment and practical testing scenarios.
- The Cypress team for maintaining an outstanding End-to-End testing framework.
- The open-source community for the tools and resources that supported this project.
