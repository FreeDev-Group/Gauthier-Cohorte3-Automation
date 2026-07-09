# Student Survey App – Automated E2E Testing (Cohort 3)

This repository contains the automated end-to-end (E2E) testing suite for the **Student Survey Application**, built using Cypress.

The objective of this project is to ensure application stability through automated testing while simulating a real QA environment where each team member independently implements test cases following a shared structure and standards.

---

# 📌 Project Overview

   - **Testing Framework:** Cypress  
   - **Test Type:** End-to-End (E2E)  
   - **Application Under Test:** Student Survey App  
   - **Testing Strategy:** Independent implementation per team member  

---

# 👥 Team Organization

   - **Mentor / Reviewer:** Gautier  
   - **Team Members:** Edouard, Arnold, Dieu-merci  

Each member has a dedicated workspace where they implement automated test cases independently, based on the same functional use cases.

---

# 📂 Project Structure

   Doc/
   
     use-cases/
     UC-Login.md
     UC-CreateAccount.md
     UC-ProvideFeedback.md
     UC-ManageSurveys.md
     UC-ReviewFeedback.md
     users/
     
        student.md
        instructor.md
        administrator.md

   Edouard/
   
     UC-Login/
     UC-CreateAccount/
     UC-ProvideFeedback/
     UC-ManageSurveys/
     UC-ReviewFeedback/
     test-reports/

   Arnold/
   
     UC-Login/
     UC-CreateAccount/
     UC-ProvideFeedback/
     UC-ManageSurveys/
     UC-ReviewFeedback/
     test-reports/

   Dieu-merci/
   
     UC-Login/
     UC-CreateAccount/
     UC-ProvideFeedback/
     UC-ManageSurveys/
     UC-ReviewFeedback/
     test-reports/

    cypress/
    fixtures/
    support/
    downloads/

cypress.config.js
package.json
README.md
.gitignore

---

# 📘 Documentation (Doc Folder)

The `Doc/` folder is the **single source of truth** for all functional requirements.

## use-cases/
Contains all detailed system use cases:
- Functional flows  
- Preconditions  
- Expected system behavior  
- Alternative scenarios  

## users/
Defines system actors and their roles:
- Student  
- Instructor  
- Administrator  

This file describes permissions, responsibilities, and access scope for each role.

---

# 🎯 Objectives

- Ensure application stability through automated E2E testing  
- Simulate real QA workflows in a structured environment  
- Improve individual automation and testing skills  
- Enable comparison of different implementations for the same use cases  
- Maintain strict separation of contributor workspaces  

---

# ⚙️ Testing Approach

- Each member works independently  
- Same use cases, different implementations  
- All tests strictly reference `Doc/use-cases/`  
- No shared test logic between contributors  
- Each member is fully responsible for their own test coverage  

---

# 📊 Test Reports

Each contributor must provide test reports inside their own directory:

### Each report must include:
- Tested scenarios  
- Execution results  
- Bugs or anomalies identified  
- Recommendations or improvements  

---

# 🌿 Branch Strategy

- `main` → Stable and validated version  
- `develop` → Active development branch  

All tested and approved code must be merged into `main` via review.

---

# 🚀 Project Goal

This repository is designed to develop:

- Strong QA automation skills  
- Real-world testing discipline  
- Structured team collaboration  
- Consistent test design methodology  
- Independent yet comparable implementations  

---

# 📌 Key Principle

Each contributor owns their implementation completely.  
Evaluation is based on comparison of approaches, not shared code.

