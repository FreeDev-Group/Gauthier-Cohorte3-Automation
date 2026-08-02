# UC Manage Survey (Instructor) - Cypress Test Suite

## Overview

This folder contains Cypress end-to-end tests related to survey management functionalities in the Instructor environment.

The purpose of these tests is to validate that instructors can create and manage surveys, configure questions, review the student survey experience, and navigate through the administration interface correctly.

The test suite covers the complete survey management workflow:

1. Creating a survey
2. Managing survey questions
3. Validating student interaction with surveys
4. Testing instructor administration navigation

---

## Test Files

## 1. Create Survey (`create_survey.cy.js`)

### Purpose CS

Validates the instructor workflow for creating surveys.

### Covered Scenarios CS

- Instructor login
- Access to Survey Management
- Opening the Add New Survey page
- Displaying survey creation fields
- Creating a new survey successfully
- Handling empty survey submission
- Verifying survey creation

### Expected Result CS

The instructor should be able to create surveys successfully and the created survey should appear in the survey management section.

---

## 2. Manage Questions (`manage_questions.cy.js`)

### Purpose MQ

Validates the creation and management of survey questions associated with a survey.

### Covered Scenarios MQ

- Opening Question Management page
- Opening Add New Question page
- Verifying question fields
- Creating different question types:
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

- Editing existing questions
- Moving questions to trash

### Expected Result MQ

The instructor should be able to create, edit, and manage all supported question types successfully.

---

## 3. Student View and Answer Survey (`student_view_and_answer_survey.cy.js`)

### Purpose SVAS

Validates how students see and interact with surveys created by instructors.

### Covered Scenarios SVAS

- Student login
- Opening available surveys
- Accessing the created survey
- Displaying all survey questions
- Answering different question types:
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
  - Multiple Choice
  - True/False

- Verifying the Submit button presence without submitting responses

### Expected Result SVAS

Students should be able to view survey questions and provide answers according to each question type.

---

## 4. Instructor Navigation (`instructor_navigation.cy.js`)

### Purpose IN

Validates accessibility of important instructor administration menu sections.

### Covered Scenarios IN

The test verifies navigation to:

- Dashboard
- Posts
- Questions
- Survey Responses
- Surveys
- Comments
- Profile
- Tools
- Collapse Menu

### Expected Result

The instructor should be able to access available administration sections and interact with the navigation menu correctly.

---

## Reports

Test execution artifacts are stored in the reports folder.

Generated reports include:

- Screenshots for failed tests
- Cypress execution videos
- Mochawesome HTML and JSON reports

---

## Execution

Run all tests:

```bash
npx cypress run
