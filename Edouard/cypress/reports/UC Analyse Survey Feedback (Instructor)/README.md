# UC Analyze Survey Feedback - Cypress Test Suite

## Overview

This folder contains Cypress end-to-end tests related to the analysis of survey responses in the Instructor environment.

The purpose of these tests is to verify that instructors can access survey responses, review submitted answers, and interact with the feedback analysis interface.

The test suite validates the instructor workflow after students have completed surveys.

---

## Test File

## Analyze Survey Feedback (`analyze_survey_feedback.cy.js`)

### Objective

Validate that instructors can access and review collected survey responses from students.

---

### Tested Features

The test covers the following functionalities:

- Instructor authentication
- Access to Survey Responses section
- Displaying available surveys
- Displaying survey response groups by survey title
- Handling surveys without responses
- Displaying student submitted answers
- Verifying specific submitted responses
- Editing feedback comments
- Saving instructor feedback

---

### Test Scenarios

#### 1. Access Survey Responses

The instructor navigates to the "Survey Responses" section from the administration menu.

Expected result:

- The Survey Responses page is displayed.
- Available surveys are listed.

---

#### 2. Display Survey Responses

The system displays responses grouped by survey.

Expected result:

- Survey titles are displayed.
- Students who submitted responses are listed.
- Answers and submission dates are visible.

---

#### 3. Handle Surveys Without Responses

The system handles surveys that have no student submissions.

Expected result:

- The survey title is displayed when available.
- The message "No responses yet" is displayed.

---

#### 4. Verify Student Answers

The test verifies that submitted answers from completed surveys are correctly displayed.

Examples of verified responses:

- Email address
- Phone number
- Preferred technologies
- Learning preference
- Birth date
- Years of experience
- Uploaded document
- Preferred tools
- Meeting time
- Confidence level
- Preferred skill improvement
- Programming experience

---

#### 5. Update Feedback

The instructor can add or modify feedback related to a student response.

Expected result:

- Feedback field is editable.
- Feedback content remains visible after saving.
- Save action completes successfully.

---

## Expected Behavior

The instructor should be able to review survey responses and manage feedback information without errors.

---

## Reports

Test execution artifacts are stored in the reports folder.

Generated files include:

- Cypress screenshots
- Cypress videos
- Mochawesome HTML reports
- Mochawesome JSON reports

---

## Execution

Run the complete test:

```bash
npx cypress run --spec "cypress/e2e/auth/UC Analyze Survey Feedback/analyze_survey_feedback.cy.js"
