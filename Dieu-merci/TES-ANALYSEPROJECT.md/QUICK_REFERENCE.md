# Quick Reference: Testing Implementation Guide

## 🎯 Critical URLs & Selectors

### Authentication Pages

| Page          | URL                                 | Form ID             | Key Selectors                                            |
| ------------- | ----------------------------------- | ------------------- | -------------------------------------------------------- |
| Login         | `/wp-login.php`                     | `#loginform`        | `#user_login`, `#user_pass`, `#rememberme`, `#wp-submit` |
| Register      | `/wp-login.php?action=register`     | `#registerform`     | `#user_login`, `#user_email`, `#wp-submit`               |
| Lost Password | `/wp-login.php?action=lostpassword` | `#lostpasswordform` | `#user_login`, `#wp-submit`                              |

### Public Pages

| Page          | URL                      | Purpose                       |
| ------------- | ------------------------ | ----------------------------- |
| Home          | `/`                      | Landing page                  |
| About         | `/about/`                | Platform info                 |
| Surveys List  | `/survey/`               | Paginated survey listing      |
| Survey Detail | `/survey/{slug}/`        | View survey & complete        |
| My Completed  | `/my-completed-surveys/` | View user's completed surveys |

### Admin Pages (Requires Auth)

| Page          | URL                                                      | Purpose         |
| ------------- | -------------------------------------------------------- | --------------- |
| Admin Home    | `/wp-admin/`                                             | Admin dashboard |
| Create Survey | `/wp-admin/post-new.php?post_type=survey&classic-editor` | Create survey   |
| Survey List   | `/wp-admin/edit.php?post_type=survey`                    | Manage surveys  |
| Edit Survey   | `/wp-admin/post.php?action=edit&post={id}`               | Edit survey     |

---

## 🔐 Test Credentials

```javascript
// Primary Student Account
Username: mugishok
Password: Merci@2026

// Generate for Each Test
username: `testuser_${Date.now()}`
email: `testuser_${Date.now()}@example.com`
```

---

## ⚡ Most Important Selectors (Use These!)

### ✅ ALWAYS Use These (Most Stable)

```javascript
// Login Form
cy.get("#loginform"); // Form container
cy.get("#user_login"); // Username field
cy.get("#user_pass"); // Password field
cy.get("#rememberme"); // Remember me checkbox
cy.get("#wp-submit"); // Login button (in loginform context)

// Registration Form
cy.get("#registerform"); // Form container
cy.get("#user_email"); // Email field

// Lost Password Form
cy.get("#lostpasswordform"); // Form container

// Page Content
cy.get("main h1"); // Page title
cy.get("main form"); // Survey form (when present)
cy.get('button[type="submit"]'); // Submit button
```

### ❌ NEVER Use These (Too Generic/Flaky)

```javascript
cy.get("input"); // Matches any input
cy.get("button"); // Matches any button
cy.get("a"); // Matches any link
cy.get(".button"); // Too generic
cy.get("form"); // Generic, no context
cy.contains("Log In"); // Text-based, fragile
cy.get("input:first"); // Position-based
```

---

## 🚀 Essential Custom Commands

```javascript
// Add to cypress/support/commands.js

Cypress.Commands.add("login", (username, password) => {
  cy.visit("/wp-login.php");
  cy.get("#user_login").clear().type(username);
  cy.get("#user_pass").clear().type(password, { log: false });
  cy.get("#rememberme").check({ force: true });
  cy.get("#wp-submit").click();
  cy.url().should("not.include", "wp-login.php");
});

Cypress.Commands.add("loginAsStudent", () => {
  cy.login(Cypress.env("WORDPRESS_USER"), Cypress.env("WORDPRESS_PASSWORD"));
});

Cypress.Commands.add("logout", () => {
  cy.visit("/wp-login.php?action=logout");
});

Cypress.Commands.add("visitSurveyList", () => {
  cy.visit("/survey/");
  cy.get("h1").should("contain", "Archives: Surveys");
});

Cypress.Commands.add("visitCompletedSurveys", () => {
  cy.visit("/my-completed-surveys/");
});
```

---

## 🎨 Key Application Features

### Question Types Supported

- ✅ Text (short answer)
- ✅ Radio buttons (single select)
- ✅ Checkboxes (multiple select)
- ✅ Dropdowns (single select)
- ✅ Text areas (long answer)

### User Roles & Capabilities

| Role           | Login | Create Surveys | Complete Surveys | View Responses |
| -------------- | ----- | -------------- | ---------------- | -------------- |
| **Student**    | ✅    | ❌             | ✅               | ✅ (own only)  |
| **Instructor** | ✅    | ✅             | ✅               | ✅ (all)       |
| **Admin**      | ✅    | ✅             | ✅               | ✅ (system)    |

### Security Features

- ❌ 3 failed login attempts → 1 minute lockout
- ❌ 5 failed login attempts → 3 minute lockout
- ✅ Password reset via email
- ✅ Session management
- ✅ Remember me option

---

## 🐛 Dynamic Elements That Cause Flaky Tests

| Element            | Behavior           | Prevention                               |
| ------------------ | ------------------ | ---------------------------------------- |
| Error Messages     | Appear/disappear   | Use `.should('be.visible')` with timeout |
| Loading Indicators | Show/hide          | Wait for them to disappear               |
| Success Messages   | Delayed appearance | Use explicit wait condition              |
| Auto-save Feedback | Transient          | Wait for it to disappear                 |
| Form Validation    | Real-time on blur  | Add explicit wait for validation         |
| Navigation Menu    | Changes on auth    | Check auth status first                  |
| Dropdowns          | Expand/collapse    | Wait for visibility before select        |

### ✅ Flaky Test Prevention

```javascript
// ❌ BAD - Will fail randomly
cy.get("#wp-submit").click();
cy.visit("/dashboard");

// ✅ GOOD - Explicit waits
cy.get("#wp-submit").click();
cy.get("#login_error").should("not.exist");
cy.url({ timeout: 10000 }).should("not.include", "wp-login.php");
cy.get("main").should("exist"); // Wait for content
```

---

## 📋 Test Scenarios Status

### ✅ IMPLEMENTED (Working)

- [x] Login with valid credentials
- [x] Login form visibility
- [x] Registration form
- [x] Registration confirmation redirect
- [x] Survey list display
- [x] Individual survey view (without questions)
- [x] My completed surveys list
- [x] View survey responses

### 🆕 MISSING - HIGH PRIORITY

- [ ] Login with invalid credentials (error message)
- [ ] Account lockout (3 attempts)
- [ ] Survey completion (with questions)
- [ ] Required field validation
- [ ] Auto-save functionality
- [ ] Password recovery email flow
- [ ] Survey creation (instructor)
- [ ] Survey editing (instructor)
- [ ] Response filtering/analysis (instructor)

### 🔄 MISSING - MEDIUM PRIORITY

- [ ] Survey preview (instructor)
- [ ] Survey deletion (instructor)
- [ ] Response export (instructor)
- [ ] Duplicate username prevention
- [ ] Email format validation
- [ ] Session persistence
- [ ] Logout functionality

### 📌 MISSING - LOW PRIORITY

- [ ] Mobile responsiveness
- [ ] Special character handling
- [ ] XSS/Injection prevention
- [ ] Performance testing
- [ ] Concurrent access handling
- [ ] Accessibility compliance

---

## 🗂️ Recommended File Organization

```
cypress/
├── e2e/
│   ├── 00-Setup/00-setup.cy.js
│   ├── UC-Login/
│   │   ├── login-success.cy.js (✅)
│   │   ├── login-validation.cy.js (✅)
│   │   ├── login-locked-account.cy.js (🆕)
│   │   └── lost-password.cy.js (🆕)
│   ├── UC-CreateAccount/
│   │   ├── register-success.cy.js (✅)
│   │   ├── register-validation.cy.js (✅)
│   │   └── registration-confirmation.cy.js (✅)
│   ├── UC-ProvideFeedback/
│   │   ├── submit-survey.cy.js (✅)
│   │   ├── required-fields.cy.js (✅)
│   │   ├── survey-with-questions.cy.js (🆕)
│   │   └── auto-save-progress.cy.js (🆕)
│   ├── UC-ManageSurveys/
│   │   ├── create-survey.cy.js (✅)
│   │   ├── edit-survey.cy.js (✅)
│   │   ├── delete-survey.cy.js (✅)
│   │   └── login-mangersuverys.cy.js (✅)
│   ├── UC-ReviewFeedback/
│   │   ├── review-feedback.cy.js (✅ - empty)
│   │   └── view-responses.cy.js (🆕)
│   └── 99-Cleanup/99-cleanup.cy.js
├── fixtures/
│   ├── users.json
│   ├── surveys.json
│   └── testdata.json
└── support/
    ├── commands.js
    ├── utils.js
    ├── e2e.js
    └── pages/
        ├── LoginPage.js
        ├── RegistrationPage.js
        └── SurveyPage.js
```

---

## 🔍 Common Pitfalls to Avoid

### 1. Element Instability

```javascript
❌ WRONG
cy.get('a').first().click()  // Which 'a' tag? Might change!

✅ RIGHT
cy.get('main li h2 a').first().click()  // Specific to survey list
```

### 2. Missing Context

```javascript
❌ WRONG
cy.get('#wp-submit').click()  // Which form?

✅ RIGHT
cy.get('#loginform #wp-submit').click()  // In login form context
```

### 3. Timing Issues

```javascript
❌ WRONG
cy.get('#wp-submit').click()
cy.url().should('include', '/dashboard/')  // No timeout!

✅ RIGHT
cy.get('#wp-submit').click()
cy.url({ timeout: 10000 }).should('not.include', 'wp-login.php')
```

### 4. Text-Based Selection

```javascript
❌ WRONG
cy.contains('button', 'Log In').click()  // Text can change

✅ RIGHT
cy.get('#wp-submit').click()  // ID never changes
```

### 5. Over-Generic Selectors

```javascript
❌ WRONG
cy.get('input').type('test')  // Which input?

✅ RIGHT
cy.get('#user_login').type('test')  // Specific field
```

---

## 🎯 Test Execution Checklist

- [ ] Environment configured (base URL correct)
- [ ] Test credentials verified
- [ ] Fixtures created (users.json, surveys.json)
- [ ] Custom commands implemented
- [ ] Page objects created
- [ ] High-priority tests implemented
- [ ] Tests run successfully
- [ ] No flaky tests (run 5x to verify)
- [ ] Screenshots captured on failure
- [ ] Videos recorded for failures
- [ ] CI/CD pipeline configured

---

## 📞 Support Information

**Current Environment:**

- Base URL: https://student.michaelkentburns.com
- Database: WordPress MySQL
- Framework: Cypress 15.17.0
- Environment File: cypress.env.json

**Test Credentials:**

```
Username: mugishok
Password: Merci@2026
```

**Timeouts:**

- Default Command Timeout: 10000ms
- Page Load Timeout: 60000ms
- Viewport: 1280x800

---

**Report Generated:** July 10, 2026  
**Status:** ✅ Ready for Implementation  
**Next Action:** Implement high-priority test cases
