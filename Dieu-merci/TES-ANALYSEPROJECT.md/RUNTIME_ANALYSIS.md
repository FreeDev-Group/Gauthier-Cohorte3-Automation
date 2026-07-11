# Student Survey Application - Runtime Analysis Report

**QA Automation Engineer Analysis**  
**Analysis Date:** July 10, 2026  
**Application URL:** https://student.michaelkentburns.com  
**Status:** WordPress-based Educational Survey Platform

---

## Executive Summary

The **Student Survey App** is a WordPress-based educational platform enabling instructors to create customized surveys and students to provide feedback on their learning experiences. The application follows a role-based access model with three distinct user types: Student, Instructor, and Administrator.

**Key Finding:** The application is fully functional for public survey browsing and feedback viewing. Authentication mechanisms are present but require verification in the current environment. Survey completion workflows are designed to be intuitive with automatic progress saving.

---

## Part 1: Complete Application Architecture

### 1.1 User Roles & Permissions

#### **Student Role**

- **Primary Function:** Complete surveys and track feedback submissions
- **Access Level:** Authenticated users
- **Capabilities:**
  - Browse available surveys from home page without login
  - View previously completed surveys with responses
  - Complete new surveys (if authenticated)
  - Auto-save progress while completing surveys
  - Review their own responses
- **Dashboard Access:** /my-completed-surveys/
- **Associated Use Cases:** UC-ProvideFeedback, UC-ReviewPastFeedback

#### **Instructor Role**

- **Primary Function:** Create, manage, and analyze surveys
- **Access Level:** Authenticated instructors only
- **Capabilities:**
  - Create new surveys with customizable questions
  - Edit existing surveys (title, dates, questions)
  - Delete surveys
  - View all student responses
  - Manage survey opening/closing dates
  - Export and analyze response data
  - Preview surveys before publishing
  - Manage question types (multiple choice, text, dropdown, radio buttons, text areas)
- **Dashboard Access:** /wp-admin/ (WordPress admin panel)
- **Associated Use Cases:** UC-ManageSurveys

#### **Administrator Role**

- **Primary Function:** System configuration and user management
- **Access Level:** Full system access
- **Capabilities:**
  - Create and manage user accounts
  - Assign roles to users
  - Configure system settings
  - Monitor platform usage and analytics
  - Generate system-wide reports
  - Ensure data privacy and compliance
  - Technical support and troubleshooting
- **Dashboard Access:** /wp-admin/ (WordPress admin panel)
- **Associated Use Cases:** UC-ManageSurveys (oversight), UC-AnalyseSystem

### 1.2 Navigation Structure

```
Home (/)
├── About (/about/)
├── All Surveys (/survey/)
│   ├── Survey Archive (paginated, 10 per page)
│   └── Individual Survey (/survey/{slug}/)
├── My Completed Surveys (/my-completed-surveys/)
│   └── Survey Response Detail (/my-completed-surveys/?survey_id={id}&response_id={id})
└── Student (dropdown menu - authentication-dependent)
```

### 1.3 Authentication System

**Type:** WordPress native authentication  
**Session Management:** WordPress cookies and sessions  
**Password Policy:** Hashed and salted storage required  
**Security Features:**

- Account lockout after 3 failed attempts (1 minute lockout)
- Enhanced lockout after 5 failed attempts (3 minute lockout)
- Password recovery via email
- Optional CAPTCHA after repeated failures

---

## Part 2: Page-by-Page Analysis

### PAGE 1: Login Page (/wp-login.php)

**URL:** `https://student.michaelkentburns.com/wp-login.php`

**Purpose:**  
Authenticate users (Students, Instructors, Administrators) and establish secure session.

**Form Structure:**

```
Form ID: #loginform
Method: POST
Action: /wp-login.php
```

**Form Fields:**

| Field Name     | HTML Selector | Type     | Required | Validation                      | Notes                                    |
| -------------- | ------------- | -------- | -------- | ------------------------------- | ---------------------------------------- |
| Username/Email | `#user_login` | text     | Yes      | Must be valid username or email | Placeholder: "Username or Email Address" |
| Password       | `#user_pass`  | password | Yes      | Min length enforced             | Show password toggle button available    |
| Remember Me    | `#rememberme` | checkbox | No       | Boolean                         | Default unchecked                        |

**Buttons:**

| Button | Selector     | Value    | Action      |
| ------ | ------------ | -------- | ----------- |
| Log In | `#wp-submit` | "Log In" | Submit form |

**Links:**

- Register: `/wp-login.php?action=register`
- Lost your password?: `/wp-login.php?action=lostpassword`
- Back to site: `/`

**Success Criteria:**

- No `#login_error` element present
- URL changes from `/wp-login.php` to role-specific dashboard
- Session cookie set (wp*logged_in*\*)

**Error Scenarios:**

- Invalid credentials → `#login_error` element visible with message "Incorrect username or password"
- Account locked → Message: "Too many failed attempts. Please try again in X minutes."
- Missing required fields → Validation message appears

**Stable Selectors:**

```cypress
// Most Stable (Priority 1)
cy.get('#loginform')              // Form wrapper
cy.get('#user_login')             // Username field
cy.get('#user_pass')              // Password field
cy.get('#rememberme')             // Remember me checkbox
cy.get('#wp-submit')              // Submit button

// Stable (Priority 2)
cy.get('form#loginform')          // Form with ID
cy.get('#user_pass + button')     // Show password button
```

**Selectors to AVOID:**

```cypress
cy.contains('Log In')             // Text changes based on language
cy.get('.button')                 // Too generic, multiple buttons
cy.get('input[type="text"]')      // Could match other text inputs
cy.get('form input')              // Not specific enough
```

**Dynamic Elements:**

- Show/Hide password button (toggles visibility, visual only)
- Error message visibility (appears/disappears dynamically)
- Remember me checkbox state (persists across refreshes)

**Edge Cases:**

- Very long username (100+ characters)
- Special characters in password (!, @, #, etc.)
- Rapid login attempts (trigger rate limiting)
- Case sensitivity in username
- Email as alternative to username
- Browser's auto-fill behavior

---

### PAGE 2: Registration Page (/wp-login.php?action=register)

**URL:** `https://student.michaelkentburns.com/wp-login.php?action=register`

**Purpose:**  
Allow new users to create accounts.

**Form Structure:**

```
Form ID: #registerform
Method: POST
Action: /wp-login.php?action=register
```

**Form Fields:**

| Field Name | HTML Selector | Type  | Required | Validation                             | Notes                             |
| ---------- | ------------- | ----- | -------- | -------------------------------------- | --------------------------------- |
| Username   | `#user_login` | text  | Yes      | Min 3 chars, alphanumeric + underscore | Must be unique                    |
| Email      | `#user_email` | email | Yes      | Valid email format                     | Confirmation sent to this address |

**Buttons:**

| Button   | Selector     | Value      | Action      |
| -------- | ------------ | ---------- | ----------- |
| Register | `#wp-submit` | "Register" | Submit form |

**Links:**

- Log in: `/wp-login.php`
- Lost your password?: `/wp-login.php?action=lostpassword`
- Back to site: `/`

**Messages:**

- Below email field: "Registration confirmation will be emailed to you."
- After successful registration: Redirect to `/wp-login.php?checkemail=registered`
- Confirmation message: "Registration complete. Please check your email"

**Success Criteria:**

- URL changes to `/wp-login.php?checkemail=registered`
- Message appears: "Registration complete. Please check your email"
- Confirmation email sent to provided address

**Error Scenarios:**

- Username taken → Error message
- Invalid email → Validation error
- Weak username (too short) → Validation error
- Missing fields → Validation error

**Stable Selectors:**

```cypress
// Most Stable (Priority 1)
cy.get('#registerform')                      // Form wrapper
cy.get('#user_login')                        // Username field
cy.get('#user_email')                        // Email field
cy.get('#wp-submit')                         // Register button
cy.get('#login-message')                     // Confirmation message

// Stable (Priority 2)
cy.get('form#registerform input[type="text"]')  // Username with type
cy.get('form#registerform input[type="email"]') // Email with type
```

**Selectors to AVOID:**

```cypress
cy.contains('Register')            // Text-based, unreliable
cy.get('.button')                  // Too generic
cy.get('input')                    // Too generic, multiple inputs
cy.contains('Registration complete')  // Dynamic message, language-dependent
```

**Dynamic Elements:**

- Username availability validation (could be async)
- Email format validation (client-side)
- Success message (appears after redirect)

**Edge Cases:**

- Username with special characters (e.g., user_123, user-name)
- Very long email address
- Duplicate registration with same email
- Unicode characters in username
- Spaces in username
- Case sensitivity (username123 vs Username123)
- Registering from different devices simultaneously

---

### PAGE 3: Lost Password Page (/wp-login.php?action=lostpassword)

**URL:** `https://student.michaelkentburns.com/wp-login.php?action=lostpassword`

**Purpose:**  
Initiate password recovery via email.

**Form Structure:**

```
Form ID: #lostpasswordform
Method: POST
Action: /wp-login.php?action=lostpassword
```

**Form Fields:**

| Field Name     | HTML Selector | Type | Required | Validation                         | Notes                    |
| -------------- | ------------- | ---- | -------- | ---------------------------------- | ------------------------ |
| Username/Email | `#user_login` | text | Yes      | Valid username or registered email | Used to identify account |

**Buttons:**

| Button           | Selector     | Value              | Action      |
| ---------------- | ------------ | ------------------ | ----------- |
| Get New Password | `#wp-submit` | "Get New Password" | Submit form |

**Links:**

- Log in: `/wp-login.php`
- Register: `/wp-login.php?action=register`
- Back to site: `/`

**Messages:**

- Help text: "Please enter your username or email address. You will receive an email message with instructions on how to reset your password."

**Success Criteria:**

- Password reset email sent (confirmation message shown)
- User can click link in email to reset password

**Error Scenarios:**

- Non-existent username/email → Error message
- Invalid email format → Validation error

**Stable Selectors:**

```cypress
// Most Stable (Priority 1)
cy.get('#lostpasswordform')        // Form wrapper
cy.get('#user_login')              // Username/Email field
cy.get('#wp-submit')               // Submit button

// Stable (Priority 2)
cy.get('form#lostpasswordform')    // Form with ID
```

**Selectors to AVOID:**

```cypress
cy.contains('Get New Password')    // Text-based
cy.get('input[type="text"]')       // Could match other text inputs
```

**Dynamic Elements:**

- Email delivery (async, not immediately verifiable in tests)
- Success message appearance

**Edge Cases:**

- Non-existent user
- Multiple accounts with same email
- Email delivery failures
- Very long username
- Case sensitivity in username lookup

---

### PAGE 4: Home Page (/)

**URL:** `https://student.michaelkentburns.com/`

**Purpose:**  
Welcome landing page, platform introduction, and navigation hub.

**Main Components:**

1. **Navigation Bar** (Header)

   ```
   - Home (/)
   - About (/about/)
   - All Surveys (/survey/)
   - My Completed Surveys (/my-completed-surveys/)
   - Student (# - dropdown, auth-dependent)
   ```

2. **Hero Section**
   - Title: "Welcome to the Student Survey App Platform"
   - Description: Platform information and benefits
   - Theme: Welcoming, informative

3. **Feature Highlights** (Implied from About page)
   - Role-Based Access
   - Flexible Survey Creation
   - Response Tracking
   - Modern Interface
   - Dynamic Menus
   - Survey History

**Content Visibility:**

- Public access (no authentication required)
- All main navigation links visible
- "Student" dropdown visible but may require login to expand

**Stable Selectors:**

```cypress
// Navigation
cy.get('nav a')                    // All nav links
cy.contains('a', 'Home')           // Home link
cy.contains('a', 'All Surveys')    // All Surveys link
cy.contains('a', 'My Completed Surveys')  // My Completed link

// Content
cy.get('h1')                       // Main title
cy.contains('h1', 'Welcome')       // Welcome heading
```

**Dynamic Elements:**

- Navigation items change based on authentication status
- Student dropdown only functional after login

**Edge Cases:**

- Screen size (responsive design)
- Authentication status changes
- User role-specific menu items

---

### PAGE 5: About Page (/about/)

**URL:** `https://student.michaelkentburns.com/about/`

**Purpose:**  
Provide platform information, features, and use case descriptions.

**Main Sections:**

1. **Our Mission**
   - Bridging communication gap between instructors and students
   - Customizable surveys and intuitive feedback

2. **Key Features**
   - 🎯 Role-Based Access (3 roles, tailored interfaces)
   - 📋 Flexible Survey Creation (multiple question types)
   - 📊 Response Tracking (comprehensive management)
   - 🎨 Modern Interface (responsive design)
   - 📱 Dynamic Menus (auth-dependent adaptation)
   - 📜 Survey History (completed survey tracking)

3. **Who Is It For?**
   - **Instructors:** Create surveys, add questions, view responses, manage schedules, export data
   - **Students:** Browse surveys, submit responses, track completed, review submissions, user-friendly
   - **Administrators:** Full system control, user management, role assignments, site configuration, oversight

4. **Development Team**
   - MKB Team developed the application
   - Built on WordPress
   - Version 1.0
   - Last Updated: November 2025

**Supported Question Types:**

- Text / Short Answer
- Radio Buttons
- Dropdowns
- Multiple Choice
- Text Areas

**Stable Selectors:**

```cypress
// Headings
cy.contains('h1', 'About')
cy.contains('h2', 'Our Mission')
cy.contains('h2', 'Key Features')
cy.contains('h2', 'Who Is It For?')

// Feature items
cy.contains('Role-Based Access')
cy.contains('Flexible Survey Creation')
cy.contains('Response Tracking')
```

---

### PAGE 6: All Surveys Page (/survey/)

**URL:** `https://student.michaelkentburns.com/survey/`

**Purpose:**  
Display all available surveys with pagination.

**Page Structure:**

```
Header: "Archives: Surveys" (h1)
└── Survey List
    ├── Survey Item 1
    │   ├── Title (h2) → Link to /survey/{slug}/
    │   ├── Description (p)
    │   └── Publication Date (time)
    ├── Survey Item 2
    │   ├── Title (h2) → Link to /survey/{slug}/
    │   ├── Description (p)
    │   └── Publication Date (time)
    └── ... (10 items per page)
└── Pagination
    ├── Previous Page (if applicable)
    ├── Page Numbers (1, 2, 3... with current highlighted)
    └── Next Page (if applicable)
```

**Survey Item Elements:**

| Element          | HTML Structure | Type           | Link Target                |
| ---------------- | -------------- | -------------- | -------------------------- |
| Survey Title     | `h2 > a`       | Clickable link | `/survey/{survey-slug}/`   |
| Description      | `p` (sibling)  | Text content   | N/A                        |
| Publication Date | `time` element | Date display   | Can also be clickable link |

**Pagination Behavior:**

- Default: 10 surveys per page
- Total surveys in system: 60+ (6+ pages)
- Pagination controls at bottom of list

**Stable Selectors:**

```cypress
// Page structure
cy.get('main h1')                  // Page title
cy.get('main > .post-list')        // Survey list container (implied)

// Survey items
cy.get('main li')                  // Individual survey items
cy.get('main li h2 a')             // Survey title links
cy.get('main li p')                // Survey descriptions
cy.get('main li time')             // Publication dates

// Pagination
cy.get('nav.pagination')           // Pagination nav
cy.get('nav a')                    // Page links
cy.contains('Next Page')           // Next button
cy.contains('Previous Page')        // Previous button
```

**Selectors to AVOID:**

```cypress
cy.get('a')                        // Too generic, affects navigation and other links
cy.get('h2')                       // Could match other h2 elements
cy.get('p')                        // Could match footer, other p tags
```

**Dynamic Elements:**

- Survey list changes as new surveys are created
- Pagination updates with survey count
- Survey order might be by date (newest first)

**Edge Cases:**

- No surveys available (empty state)
- Very long survey titles
- Special characters in survey titles or descriptions
- Survey titles with multiple lines
- Pagination with 1 page only (no pagination controls)
- Survey with no description

---

### PAGE 7: Individual Survey Page (/survey/{survey-slug}/)

**URL:** `https://student.michaelkentburns.com/survey/{survey-slug}/`  
**Example:** `/survey/cypress-managed-survey-4/`

**Purpose:**  
Display survey details and questions, allowing students to complete the survey.

**Page Structure:**

```
Header
├── Navigation (same as home)
└── Main Content
    ├── Survey Title (h1)
    ├── Survey Content
    │   ├── Questions Form (if available)
    │   │   ├── Question 1
    │   │   ├── Question 2
    │   │   └── Submit Button
    │   └── OR Empty Message
    │       └── "No questions found for this survey."
    ├── Related Surveys (if available)
    └── Footer
```

**Scenarios:**

**Scenario A: Survey Without Questions (Current State)**

```
Survey Title: "Cypress Managed Survey"
Message: "No questions found for this survey."
```

**Scenario B: Survey With Questions (Expected)**

```
Survey Title: "Satisfaction Survey Jonathan"
Form Fields:
  - Your Gender Identity: (field type varies)
  - Religion: (field type varies)
  - Learning Experience: (field type varies)
Buttons:
  - Submit Survey
  - Save Progress (if auto-save not available)
```

**Survey Completion Workflow:**

1. Student sees survey title and questions
2. Questions may be of various types:
   - Text input (short/long answer)
   - Radio buttons (single selection)
   - Checkboxes (multiple selection)
   - Dropdowns (single selection from list)
   - Text areas (open-ended)
3. Questions marked as required must be answered
4. Student can navigate between questions
5. Progress auto-saves during completion
6. Student submits completed survey
7. Confirmation message displayed
8. Survey marked as completed

**Stable Selectors:**

```cypress
// Structure
cy.get('main h1')                  // Survey title
cy.contains('No questions found')  // Empty state message

// Survey questions (when available)
cy.get('form')                     // Survey form
cy.get('form input')               // All form inputs
cy.get('form textarea')            // Text areas
cy.get('form select')              // Dropdowns
cy.get('button[type="submit"]')    // Submit button

// By question content
cy.contains('Your Gender Identity')
cy.contains('Religion')
cy.contains('Learning Experience')
```

**Selectors to AVOID:**

```cypress
cy.get('input')                    // Generic, could match navigation
cy.get('button')                   // Could match other buttons
cy.get('*')                        // Way too generic
```

**Dynamic Elements:**

- Question visibility (depends on previous answers - conditional logic)
- Question order (might be randomized)
- Validation messages (appear on submission)
- Save indicators (auto-save feedback)

**Edge Cases:**

- Survey with no questions (current state)
- Survey with 50+ questions
- Very long question text
- Questions with special characters or formatting
- Conditional logic hiding/showing questions
- Required field validation
- Long-running surveys (timeout risks)
- Browser back button during completion

---

### PAGE 8: My Completed Surveys (/my-completed-surveys/)

**URL:** `https://student.michaelkentburns.com/my-completed-surveys/`

**Purpose:**  
Display list of surveys completed by the user and allow viewing of submitted responses.

**Page Structure:**

```
Header
├── Navigation (same as home)
└── Main Content
    ├── Page Title: "Surveys You Have Completed" (h2)
    ├── Survey List (ul > li)
    │   ├── Survey Name 1 (link)
    │   ├── Survey Name 2 (link)
    │   └── Survey Name 3 (link)
    └── Survey Response Detail (when specific survey selected)
        ├── Response Title: "Your Answers for: [Survey Name]" (h3)
        ├── Answer List (ul > li)
        │   ├── "Question 1: [Answer]"
        │   ├── "Question 2: [Answer]"
        │   └── "Question 3: [Answer]"
        └── Navigation back to survey list
```

**List View:**

- Displays all surveys user has completed
- Each item is a clickable link
- Example surveys: "Satisfaction Survey Jonathan", "Arnold Project Testing Survey"

**Detail View Query Parameters:**

```
/my-completed-surveys/?survey_id={id}&response_id={id}
```

**Example Response Data:**

- Question: "Your Gender Identity:" → Answer displayed
- Question: "Religion:" → Answer displayed
- Question: "Learning Experience:" → Answer displayed

**Public Access:**

- Page appears accessible without authentication
- Shows completed surveys for the current visitor (likely based on IP or session)

**Stable Selectors:**

```cypress
// List view
cy.get('h2')                       // "Surveys You Have Completed"
cy.get('ul li a')                  // Survey links
cy.contains('Satisfaction Survey Jonathan')  // Specific survey
cy.contains('Arnold Project Testing Survey')

// Detail view
cy.get('h3')                       // "Your Answers for: [Survey Name]"
cy.get('ul li')                    // Answer list items
cy.contains('Your Gender Identity')
cy.contains('Religion')
cy.contains('Learning Experience')
```

**Selectors to AVOID:**

```cypress
cy.get('a')                        // Too generic
cy.get('li')                       // Could match pagination or other lists
cy.get('h2, h3')                   // Matches all headings
```

**Dynamic Elements:**

- Survey list changes as user completes more surveys
- Response details change based on selected survey
- Query parameters determine which response is displayed

**Edge Cases:**

- User with no completed surveys (empty state)
- Very long survey names
- Special characters in survey names
- User completing same survey multiple times (shows latest?)
- Missing survey (deleted after completion)
- Corrupted response data

---

### PAGE 9: Admin/Management Pages (/wp-admin/)

**URL:** `https://student.michaelkentburns.com/wp-admin/`

**Status:** REQUIRES AUTHENTICATION

- Inaccessible without login
- Redirects to home page when not authenticated
- Requires instructor or administrator role

**Accessible Subpages (when authenticated):**

1. **Create New Survey** (`/wp-admin/post-new.php?post_type=survey&classic-editor`)
   - Form to create new survey
   - Fields: post_title, content, post_status, etc.
   - Action: POST to `/wp-admin/post.php`

2. **Survey List** (`/wp-admin/edit.php?post_type=survey`)
   - List of all surveys created by instructor
   - Options to edit, delete, view survey
   - Bulk actions available

3. **Edit Survey** (`/wp-admin/post.php?action=edit&post={id}`)
   - Form to modify survey details
   - Question management interface
   - Preview option

**WordPress Admin Structure:**

- Navigation sidebar (left)
- Main content area (right)
- Top admin bar
- Breadcrumb navigation

**Note:** Detailed analysis of /wp-admin requires successful authentication. Current analysis based on test expectations.

---

## Part 3: Form Analysis & Validation

### Registration Form Detailed Analysis

**Field 1: Username**

```
Name: user_login
Type: text
Required: Yes
Validation Rules:
  - Cannot be empty
  - Minimum 3 characters (implied)
  - Alphanumeric + underscore only (standard WordPress)
  - Must be unique (not already registered)
Success Message: After registration, confirmation email sent
Error Messages:
  - "Username already exists" (if taken)
  - "Username is too short" (if < 3 chars)
  - "Invalid characters in username" (special chars)
```

**Field 2: Email**

```
Name: user_email
Type: email
Required: Yes
Validation Rules:
  - Must be valid email format
  - Must be unique (not already registered)
Success Message: (via redirect to checkemail=registered)
Error Messages:
  - "Invalid email address"
  - "Email already registered"
Confirmation: Email sent to address (user must click link)
```

**Login Form Detailed Analysis**

**Field 1: Username/Email**

```
Name: user_login
Type: text
Required: Yes
Accepts: Username OR email address
Validation: Basic non-empty check
```

**Field 2: Password**

```
Name: user_pass
Type: password
Required: Yes
Validation: Non-empty check
Show/Hide Toggle: Available (button next to field)
Features:
  - Asterisks shown for security
  - Can toggle to show plain text
  - Autofill from browser available
```

**Field 3: Remember Me**

```
Name: rememberme
Type: checkbox
Value: forever
Checked: No (default)
Effect: Extends session cookie duration
```

**Lost Password Form**

**Field 1: Username or Email**

```
Name: user_login
Type: text
Required: Yes
Accepts: Username OR registered email address
Validation: Must exist in system
Success: Email sent with reset link
Confirms: "Check your email for password reset link"
```

---

## Part 4: Critical Selectors for Cypress Testing

### Most Stable Selectors (Priority 1 - Always Use These)

```javascript
// Authentication Elements
cy.get("#loginform"); // Login form container
cy.get("#user_login"); // Username input in any form
cy.get("#user_pass"); // Password input
cy.get("#rememberme"); // Remember me checkbox
cy.get("input#wp-submit"); // Submit buttons (but needs context)
cy.get("#wp-submit"); // Generic submit button

// Registration-Specific
cy.get("#registerform"); // Registration form container
cy.get("#user_email"); // Email input field
cy.get("#login-message"); // Registration confirmation message

// Lost Password-Specific
cy.get("#lostpasswordform"); // Lost password form container

// Page Content
cy.get("main"); // Main content area
cy.get("h1"); // Page title
cy.get("h2"); // Survey titles (in lists)
cy.get("footer"); // Footer area

// Navigation
cy.get("nav"); // Navigation area
cy.get("nav a"); // Navigation links
```

### Context-Specific Selectors (Priority 2 - Use With Context)

```javascript
// Better form selection (context matters)
cy.get("#loginform #user_login"); // Username in login form
cy.get("#registerform #user_login"); // Username in registration
cy.get("#lostpasswordform #user_login"); // Username in lost password

// Better button selection (specify form)
cy.get("#loginform #wp-submit"); // Login submit
cy.get("#registerform #wp-submit"); // Register submit
cy.get("#lostpasswordform #wp-submit"); // Lost password submit

// Survey-specific elements
cy.get("main h1"); // Survey title
cy.get("main form"); // Survey completion form
cy.get('main button[type="submit"]'); // Survey submit button
```

### Selectors to AVOID (Anti-Patterns)

```javascript
// ❌ TOO GENERIC - Will match unrelated elements
cy.get("input"); // Could match ANY input
cy.get("button"); // Could match ANY button
cy.get("a"); // Could match ANY link
cy.get(".button"); // Generic class, multiple matches
cy.get("form"); // Generic form, context lost

// ❌ TEXT-BASED - Fragile and language-dependent
cy.contains("Log In"); // Changes with language
cy.contains("Register"); // Generic text
cy.contains("button", "Submit"); // Text can change

// ❌ POSITION-BASED - Fragile to layout changes
cy.get("input:first"); // Breaks if order changes
cy.get("button:last"); // Breaks if button added
cy.get("li:nth-child(2)"); // Breaks if items added/removed

// ❌ ATTRIBUTE-BASED (Without Type/Name) - Too vague
cy.get('[type="text"]'); // Multiple text inputs
cy.get('[name="submit"]'); // Fragile to naming changes
cy.get('input[value="Search"]'); // Value changes break tests
```

---

## Part 5: Dynamic Elements & Flaky Test Prevention

### Elements That Change Dynamically

| Element            | Behavior                           | Impact                                        | Prevention                               |
| ------------------ | ---------------------------------- | --------------------------------------------- | ---------------------------------------- |
| Error Messages     | Appear/disappear on validation     | Tests may wait for element that never appears | Use `.should('be.visible')` with timeout |
| Loading Indicators | Appear during form submission      | Tests may click button before form ready      | Wait for indicators to disappear         |
| Success Messages   | Display after form submission      | Variable timing of appearance                 | Use custom wait condition                |
| Navigation Menu    | Changes based on auth status       | Menu items appear/disappear                   | Check auth status before testing         |
| Survey List        | Updates when surveys added/deleted | Pagination changes                            | Use data attributes or stable IDs        |
| Auto-save Feedback | Shows/hides during editing         | May interfere with element visibility         | Wait for feedback to disappear           |
| Dropdown Menus     | Expand/collapse on click           | Must wait for animation before selection      | Wait for list visibility                 |
| Form Validation    | Real-time validation on field blur | Tests may proceed before validation shows     | Add explicit wait for validation         |

### Flaky Test Prevention Strategies

#### Strategy 1: Explicit Waits

```javascript
// ❌ BAD - Implicit wait only
cy.get("#user_login").type(username);
cy.get("#wp-submit").click();
cy.url().should("include", "/dashboard/");

// ✅ GOOD - Explicit wait conditions
cy.get("#user_login").type(username);
cy.get("#wp-submit").click();
cy.get("#login_error").should("not.exist"); // Wait for no error
cy.url({ timeout: 10000 }).should("not.include", "wp-login.php");
```

#### Strategy 2: Network Request Waiting

```javascript
// ❌ BAD - No network wait
cy.get("#wp-submit").click();
cy.visit("/dashboard");

// ✅ GOOD - Wait for network idle
cy.get("#wp-submit").click();
cy.url().should("not.include", "wp-login.php"); // Waits for redirect
cy.get("main").should("exist"); // Waits for content load
```

#### Strategy 3: Element Stability Checks

```javascript
// ❌ BAD - Element might be detaching/reattaching
cy.get("#survey-list > li").first().click();

// ✅ GOOD - Wait for stability
cy.get("#survey-list > li")
  .first()
  .should("be.visible")
  .and("not.have.class", "loading")
  .click();
```

#### Strategy 4: Race Condition Prevention

```javascript
// ❌ BAD - Race condition between elements
cy.get("#loginform input").type(password); // Could match wrong input
cy.get("button").click(); // Could click wrong button

// ✅ GOOD - Explicit ordering
cy.get("#loginform #user_login").type(username);
cy.get("#loginform #user_pass").type(password);
cy.get("#loginform #wp-submit").click();
```

#### Strategy 5: Conditional Element Handling

```javascript
// Handle both "No questions" and "Form with questions"
cy.get("main").then(($main) => {
  if ($main.find(':contains("No questions")').length > 0) {
    cy.log("Survey has no questions");
  } else {
    cy.get("form").should("exist");
    cy.get('button[type="submit"]').click();
  }
});
```

### Elements That Should NEVER Be Used for Selection

| Element                            | Reason                         | Impact                                     |
| ---------------------------------- | ------------------------------ | ------------------------------------------ |
| `.button` class                    | Too generic, multiple elements | Tests will be flaky, wrong element clicked |
| Text content only                  | Changes with language/updates  | Tests break on copy changes                |
| Position (nth-child)               | Breaks with layout changes     | Tests fail randomly                        |
| Style/color attributes             | Fragile, changes with theme    | Tests break on UI redesign                 |
| Generated IDs (e.g., `wp-123-456`) | Changes with environment       | Tests fail on different environments       |
| `data-test` not set by developers  | Won't exist if devs don't add  | Tests error instead of finding element     |

---

## Part 6: User Workflows & End-to-End Scenarios

### Workflow 1: Student Registration & First Login

```
1. User visits home page (/)
2. User clicks "Register" link from login page (/wp-login.php?action=register)
3. User fills in:
   - Username: unique, valid format
   - Email: valid, unique email
4. User clicks "Register" button
5. System:
   - Validates inputs
   - Creates account in database
   - Sends confirmation email
   - Redirects to checkemail=registered page
   - Shows: "Registration complete. Please check your email"
6. User checks email and clicks confirmation link
7. User returns to login page (/wp-login.php)
8. User enters username and password
9. User checks "Remember Me" (optional)
10. User clicks "Log In"
11. System:
    - Validates credentials
    - Creates session
    - Sets session cookies
    - Redirects to dashboard (role-specific)
12. User sees dashboard with available surveys
```

**Test Points:**

- Registration validation (empty fields, invalid formats)
- Email confirmation (async, external system)
- Login with valid credentials
- Session persistence

### Workflow 2: Student Completes Survey

```
1. User logs in and sees dashboard
2. User navigates to "All Surveys" (/survey/)
3. User sees list of available surveys (paginated)
4. User clicks on a survey title
5. User sees survey detail page (/survey/{slug}/)
6. Two scenarios:
   a) Survey has no questions → Shows "No questions found for this survey"
   b) Survey has questions → Shows form with questions
7. If survey has questions:
   - User reviews survey title and instructions
   - User answers each question:
     * Text/textarea questions: Types answer
     * Multiple choice: Selects option
     * Dropdowns: Selects value
     * Radio buttons: Selects option
   - System auto-saves progress (if user navigates away)
   - User clicks "Submit Survey" button
   - System validates required fields
   - If validation fails: Shows error, highlights missing fields
   - If validation passes:
     * System stores responses
     * Shows confirmation message
     * Redirects to success page or survey list
     * Survey appears in "My Completed Surveys"
8. User navigates to "My Completed Surveys"
9. User sees survey in completed list
10. User clicks on survey name
11. System shows responses: "Your Answers for: [Survey Name]"
12. User sees all submitted answers
```

**Test Points:**

- Survey discovery and navigation
- Survey with/without questions
- Form field interactions (text, select, radio, etc.)
- Auto-save functionality
- Required field validation
- Success confirmation
- Response history

### Workflow 3: Instructor Creates & Manages Survey

```
1. Instructor logs in (credentials with instructor role)
2. System redirects to instructor dashboard (/wp-admin/)
3. Instructor navigates to Survey management section
4. Instructor clicks "Create New Survey"
5. Instructor fills in survey details:
   - Title (required)
   - Description (optional)
   - Opening date (optional)
   - Closing date (optional)
6. Instructor clicks "Add Questions"
7. Instructor selects question type from available options:
   - Text (short answer)
   - Text Area (long answer)
   - Radio Buttons (single choice)
   - Checkbox (multiple choice)
   - Dropdown (single select)
8. Instructor enters question text and options
9. Instructor marks question as required/optional
10. Instructor repeats steps 7-9 for additional questions
11. Instructor clicks "Preview Survey"
12. System shows survey as it appears to students
13. Instructor reviews and clicks "Publish"
14. System stores survey in database
15. Survey becomes available to students immediately (if dates allow)
16. Instructor can later:
    - Edit survey (title, dates, questions)
    - Delete survey (with confirmation)
    - View all student responses
    - Export response data
```

**Test Points:**

- Authentication as instructor
- Survey creation with required/optional fields
- Question types and validation
- Survey preview
- Survey publication
- Survey editing
- Survey deletion
- Response viewing

### Workflow 4: Password Recovery

```
1. User on login page (/wp-login.php)
2. User clicks "Lost your password?" link
3. User sees password recovery form (/wp-login.php?action=lostpassword)
4. User enters username or email
5. User clicks "Get New Password"
6. System:
   - Validates username/email exists
   - Generates reset token
   - Sends reset link via email
   - Shows confirmation message
7. User checks email
8. User clicks reset link
9. User sees password reset form
10. User enters new password (twice for confirmation)
11. User clicks "Reset Password"
12. System:
    - Validates password format
    - Updates password in database
    - Shows success message
    - Redirects to login page
13. User logs in with new password
```

**Test Points:**

- Lost password form validation
- Email delivery (external system)
- Password reset token validity
- Password reset form validation
- New password login

---

## Part 7: Testing Strategy Document

### 7.1 Authentication Strategy

#### Test Credentials

```javascript
// Primary test account (Student role)
const STUDENT_CREDENTIALS = {
  username: "mugishok",
  password: "Merci@2026",
};

// Secondary test accounts (create during tests)
// Use random generation for uniqueness
const randomStudent = {
  username: `testuser_${Date.now()}`,
  email: `testuser_${Date.now()}@example.com`,
};
```

#### Session Management

- Sessions stored in WordPress cookies (wp*logged_in*\*)
- Session timeout: Configured in WordPress settings (default: varies)
- Remember Me extends cookie duration
- Logout clears session cookie

#### Login Strategy

```javascript
// Custom login command
cy.login(username, password) {
  cy.visit('/wp-login.php')
  cy.get('#user_login').clear().type(username)
  cy.get('#user_pass').clear().type(password, { log: false })
  cy.get('#rememberme').check({ force: true })
  cy.get('#wp-submit').click()
  cy.url().should('not.include', 'wp-login.php')
  cy.get('main').should('exist')
}
```

#### Authentication State Verification

```javascript
// Check if user is logged in
cy.checkLoginStatus() {
  cy.visit('/')
  cy.get('nav').should('exist')
  // If authenticated, student dropdown should be interactive
  // If not authenticated, menu shows differently
}
```

### 7.2 Test Data Strategy

#### Data Creation Approach

**Strategy 1: Fixture-Based (Reusable Data)**

```javascript
// cypress/fixtures/users.json
{
  "student": {
    "username": "testuser_student",
    "email": "testuser_student@example.com"
  },
  "instructor": {
    "username": "testuser_instructor",
    "email": "testuser_instructor@example.com"
  }
}
```

**Strategy 2: Dynamic Generation (Unique Data Per Test)**

```javascript
// Generate unique data for each test run
const generateTestUser = () => ({
  username: `user_${Date.now()}`,
  email: `user_${Date.now()}@test.local`,
});
```

**Strategy 3: Database Seeding (Pre-populated)**

```javascript
// Initialize test database with known surveys
// Use WordPress API or database directly
// Ensures consistent test environment
```

#### Survey Test Data

```javascript
// Surveys for testing
const testSurveys = {
  noQuestions: {
    title: "Cypress Test Survey - No Questions",
    slug: "cypress-test-no-questions",
  },
  withQuestions: {
    title: "Cypress Test Survey - With Questions",
    slug: "cypress-test-with-questions",
    questions: [
      { text: "Gender?", type: "text" },
      { text: "Rating?", type: "radio", options: ["Poor", "Fair", "Good"] },
    ],
  },
};
```

#### Test Data Cleanup

```javascript
// After tests, clean up created data
afterEach(() => {
  // Delete created surveys
  // Delete created users
  // Clear sessions
});
```

### 7.3 Reusable Commands

#### Basic Authentication Commands

```javascript
// Login with any credentials
Cypress.Commands.add("login", (username, password) => {
  cy.visit("/wp-login.php");
  cy.get("#user_login").clear().type(username);
  cy.get("#user_pass").clear().type(password, { log: false });
  cy.get("#rememberme").check({ force: true });
  cy.get("#wp-submit").click();
  cy.url().should("not.include", "wp-login.php");
});

// Login with default student credentials
Cypress.Commands.add("loginAsStudent", () => {
  const username = Cypress.env("WORDPRESS_USER") || "mugishok";
  const password = Cypress.env("WORDPRESS_PASSWORD") || "Merci@2026";
  cy.login(username, password);
});

// Logout
Cypress.Commands.add("logout", () => {
  cy.visit("/wp-login.php?action=logout");
  cy.url().should("include", "wp-login.php");
});
```

#### Survey Navigation Commands

```javascript
// Navigate to surveys list
Cypress.Commands.add("visitSurveyList", () => {
  cy.visit("/survey/");
  cy.get("h1").should("contain", "Archives: Surveys");
});

// Click on first available survey
Cypress.Commands.add("clickFirstSurvey", () => {
  cy.get("main li h2 a").first().click();
});

// Navigate to completed surveys
Cypress.Commands.add("visitCompletedSurveys", () => {
  cy.visit("/my-completed-surveys/");
  cy.get("h2").should("contain", "Completed");
});
```

#### Form Interaction Commands

```javascript
// Fill registration form
Cypress.Commands.add("fillRegistration", (username, email) => {
  cy.get("#registerform #user_login").clear().type(username);
  cy.get("#registerform #user_email").clear().type(email);
});

// Fill lost password form
Cypress.Commands.add("fillLostPassword", (username) => {
  cy.get("#lostpasswordform #user_login").clear().type(username);
});

// Complete survey with responses
Cypress.Commands.add("completeSurvey", (responses) => {
  // Responses format: { questionSelector: answer }
  Object.entries(responses).forEach(([selector, answer]) => {
    cy.get(selector).type(answer);
  });
  cy.get('button[type="submit"]').click();
});
```

### 7.4 Reusable Custom Functions

#### Utility Functions

```javascript
// Check if survey has questions
export const hasSurveyQuestions = () => {
  return cy.get("body").then(($body) => {
    return !$body.text().includes("No questions found");
  });
};

// Get survey count from list
export const getSurveyCount = () => {
  return cy.get("main li").then(($items) => {
    return $items.length;
  });
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return cy.getCookie("wordpress_logged_in").then((cookie) => {
    return !!cookie;
  });
};

// Validate email format
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Generate unique username
export const generateUsername = (prefix = "user") => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Wait for auto-save indicator
export const waitForAutoSave = () => {
  cy.get("[data-auto-save-indicator]", { timeout: 5000 })
    .should("exist")
    .should("not.exist");
};

// Check if form has validation errors
export const checkFormErrors = () => {
  return cy.get('[role="alert"], .error, [data-error]').then(($errors) => {
    return $errors.length > 0;
  });
};
```

### 7.5 Fixtures to Create

#### User Fixtures

**File:** `cypress/fixtures/users.json`

```json
{
  "student": {
    "username": "cypress_student",
    "email": "cypress_student@test.local",
    "password": "TestPassword@2026"
  },
  "instructor": {
    "username": "cypress_instructor",
    "email": "cypress_instructor@test.local",
    "password": "TestPassword@2026"
  },
  "admin": {
    "username": "cypress_admin",
    "email": "cypress_admin@test.local",
    "password": "TestPassword@2026"
  }
}
```

#### Survey Fixtures

**File:** `cypress/fixtures/surveys.json`

```json
{
  "simpleSurvey": {
    "title": "Cypress Test Survey",
    "description": "Auto-generated test survey",
    "questions": []
  },
  "surveyWithQuestions": {
    "title": "Feedback Survey",
    "description": "Student feedback on course",
    "questions": [
      {
        "type": "text",
        "text": "What is your name?"
      },
      {
        "type": "radio",
        "text": "How satisfied are you?",
        "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"]
      },
      {
        "type": "textarea",
        "text": "Please provide feedback"
      }
    ]
  }
}
```

#### Test Data Fixtures

**File:** `cypress/fixtures/testdata.json`

```json
{
  "validEmails": [
    "test@example.com",
    "user+tag@domain.co.uk",
    "name.surname@company.org"
  ],
  "invalidEmails": [
    "missing@domain",
    "no-at-sign.com",
    "@nodomain.com",
    "spaces in@email.com"
  ],
  "validUsernames": [
    "testuser123",
    "user_underscore",
    "a",
    "very_long_username_with_many_characters"
  ],
  "invalidUsernames": [
    "user@invalid",
    "user with spaces",
    "user-dash",
    "user!special"
  ],
  "surveyResponses": {
    "genderQuestion": {
      "selector": "input[name='gender']",
      "validAnswers": ["Male", "Female", "Other"]
    },
    "religionQuestion": {
      "selector": "select[name='religion']",
      "validAnswers": ["Christian", "Muslim", "Jewish", "Other"]
    }
  }
}
```

### 7.6 Page Objects (If Useful)

**File:** `cypress/support/pages/LoginPage.js`

```javascript
export class LoginPage {
  visit() {
    cy.visit("/wp-login.php");
    return this;
  }

  enterUsername(username) {
    cy.get("#user_login").clear().type(username);
    return this;
  }

  enterPassword(password) {
    cy.get("#user_pass").clear().type(password, { log: false });
    return this;
  }

  checkRememberMe() {
    cy.get("#rememberme").check({ force: true });
    return this;
  }

  submit() {
    cy.get("#wp-submit").click();
    return this;
  }

  clickRegisterLink() {
    cy.contains("a", "Register").click();
    return this;
  }

  clickLostPassword() {
    cy.contains("a", "Lost your password").click();
    return this;
  }

  login(username, password) {
    return this.visit()
      .enterUsername(username)
      .enterPassword(password)
      .checkRememberMe()
      .submit();
  }
}
```

**File:** `cypress/support/pages/SurveyPage.js`

```javascript
export class SurveyPage {
  visit(surveySlug) {
    cy.visit(`/survey/${surveySlug}/`);
    return this;
  }

  getSurveyTitle() {
    return cy.get("main h1");
  }

  hasSurveyQuestions() {
    return cy.get("body").then(($body) => {
      return !$body.text().includes("No questions found");
    });
  }

  getForm() {
    return cy.get("main form");
  }

  fillTextQuestion(selector, answer) {
    cy.get(selector).clear().type(answer);
    return this;
  }

  submitSurvey() {
    cy.get('button[type="submit"]').click();
    return this;
  }
}
```

### 7.7 Recommended Folder Structure

```
cypress/
├── e2e/                                    # E2E test files
│   ├── 00-Setup/
│   │   └── 00-setup.cy.js                # Initialize test data
│   ├── UC-Login/
│   │   ├── login-success.cy.js           # ✅ Existing
│   │   ├── login-validation.cy.js        # ✅ Existing
│   │   ├── login-locked-account.cy.js    # 🆕 New
│   │   ├── lost-password.cy.js           # 🆕 New
│   │   └── login-edge-cases.cy.js        # 🆕 New
│   ├── UC-CreateAccount/
│   │   ├── register-success.cy.js        # ✅ Existing
│   │   ├── register-validation.cy.js     # ✅ Existing
│   │   ├── registration-confirmation.cy.js # ✅ Existing
│   │   ├── register-duplicate.cy.js      # 🆕 New
│   │   └── register-edge-cases.cy.js     # 🆕 New
│   ├── UC-ProvideFeedback/
│   │   ├── submit-survey.cy.js           # ✅ Existing
│   │   ├── survey-with-questions.cy.js   # 🆕 New
│   │   ├── required-fields.cy.js         # ✅ Existing
│   │   ├── auto-save-progress.cy.js      # 🆕 New
│   │   └── survey-navigation.cy.js       # 🆕 New
│   ├── UC-ManageSurveys/
│   │   ├── create-survey.cy.js           # ✅ Existing
│   │   ├── edit-survey.cy.js             # ✅ Existing
│   │   ├── delete-survey.cy.js           # ✅ Existing
│   │   ├── login-mangersuverys.cy.js     # ✅ Existing
│   │   ├── survey-preview.cy.js          # 🆕 New
│   │   └── survey-questions.cy.js        # 🆕 New
│   ├── UC-ReviewFeedback/
│   │   ├── review-feedback.cy.js         # ✅ Existing (empty)
│   │   ├── view-responses.cy.js          # 🆕 New
│   │   ├── filter-responses.cy.js        # 🆕 New
│   │   └── export-responses.cy.js        # 🆕 New
│   ├── Navigation/
│   │   ├── page-navigation.cy.js         # 🆕 New
│   │   ├── breadcrumb-navigation.cy.js   # 🆕 New
│   │   └── responsive-navigation.cy.js   # 🆕 New
│   ├── Forms/
│   │   ├── form-validation.cy.js         # 🆕 New
│   │   ├── form-submission.cy.js         # 🆕 New
│   │   └── form-edge-cases.cy.js         # 🆕 New
│   └── 99-Cleanup/
│       └── 99-cleanup.cy.js              # Clean up test data
├── fixtures/
│   ├── users.json                        # Test user accounts
│   ├── surveys.json                      # Test survey data
│   ├── testdata.json                     # Test data (emails, usernames, etc.)
│   └── responses.json                    # Test survey responses
├── support/
│   ├── commands.js                       # Custom commands
│   ├── utils.js                          # Utility functions
│   ├── e2e.js                            # E2E support setup
│   └── pages/
│       ├── LoginPage.js                  # Page object
│       ├── RegistrationPage.js           # Page object
│       ├── SurveyPage.js                 # Page object
│       └── AdminPage.js                  # Page object
├── screenshots/                          # Test screenshots
└── videos/                               # Test recordings
```

### 7.8 Recommended Test Execution Order

#### Phase 1: Setup (Before All Tests)

```
00-Setup/00-setup.cy.js
  ├── Verify environment connectivity
  ├── Create test user accounts
  ├── Create test surveys
  └── Initialize test database state
```

#### Phase 2: Authentication (Foundation)

```
UC-Login/login-success.cy.js
UC-Login/login-validation.cy.js
UC-CreateAccount/register-success.cy.js
UC-CreateAccount/register-validation.cy.js
UC-Login/login-locked-account.cy.js
UC-Login/lost-password.cy.js
```

#### Phase 3: Public Access (No Auth Required)

```
Navigation/page-navigation.cy.js
Navigation/breadcrumb-navigation.cy.js
UC-ProvideFeedback/submit-survey.cy.js (public access test)
```

#### Phase 4: Survey Management (Auth Required)

```
UC-ManageSurveys/login-mangersuverys.cy.js
UC-ManageSurveys/create-survey.cy.js
UC-ManageSurveys/survey-questions.cy.js
UC-ManageSurveys/edit-survey.cy.js
UC-ManageSurveys/survey-preview.cy.js
UC-ManageSurveys/delete-survey.cy.js
```

#### Phase 5: Student Workflows

```
UC-ProvideFeedback/survey-with-questions.cy.js
UC-ProvideFeedback/required-fields.cy.js
UC-ProvideFeedback/auto-save-progress.cy.js
UC-ProvideFeedback/survey-navigation.cy.js
UC-ReviewFeedback/view-responses.cy.js
```

#### Phase 6: Advanced Features

```
UC-ReviewFeedback/filter-responses.cy.js
UC-ReviewFeedback/export-responses.cy.js
Forms/form-validation.cy.js
Forms/form-edge-cases.cy.js
Navigation/responsive-navigation.cy.js
```

#### Phase 7: Cleanup

```
99-Cleanup/99-cleanup.cy.js
  ├── Delete test users
  ├── Delete test surveys
  └── Reset test database state
```

---

## Part 8: Missing E2E Scenarios

### High Priority (Core Workflows)

**Missing Scenario 1: Survey Completion with Question Types**

- **Current State:** No test for surveys WITH questions (all test surveys are empty)
- **Gap:** Need to test:
  - Text input questions
  - Radio button selection
  - Checkbox (multiple select)
  - Dropdown selection
  - Text area (long answer)
  - Mixed question types in one survey
- **Impact:** Student workflow incomplete
- **Recommendation:** Create UC-ProvideFeedback/survey-with-questions.cy.js

**Missing Scenario 2: Auto-Save Functionality**

- **Current State:** Auto-save mentioned but not tested
- **Gap:** Need to test:
  - Progress saves when user leaves survey
  - User can resume from where they left off
  - Partial responses preserved
  - No data loss on browser close/crash
- **Impact:** Data integrity risk
- **Recommendation:** Create UC-ProvideFeedback/auto-save-progress.cy.js

**Missing Scenario 3: Account Lockout (Security)**

- **Current State:** Mentioned in design docs, not tested
- **Gap:** Need to test:
  - 3 failed attempts → 1 minute lockout
  - 5 failed attempts → 3 minute lockout
  - Error message displayed with countdown
  - Account unlocks after timeout
  - Subsequent login succeeds
- **Impact:** Security validation missing
- **Recommendation:** Create UC-Login/login-locked-account.cy.js

**Missing Scenario 4: Survey Deletion with Confirmation**

- **Current State:** Delete test exists but need verification
- **Gap:** Need to test:
  - Delete confirmation dialog appears
  - Cancel option prevents deletion
  - Confirmation deletes survey
  - Deleted survey no longer accessible
  - Student responses preserved (if any)
- **Impact:** Data integrity on deletion
- **Recommendation:** Enhance UC-ManageSurveys/delete-survey.cy.js

### Medium Priority (Important Features)

**Missing Scenario 5: Response Review Page**

- **Current State:** My Completed Surveys page shows list, but detail view not tested
- **Gap:** Need to test:
  - Viewing individual survey responses
  - Reading all answered questions and answers
  - Navigation back to survey list
  - Pagination if many responses
- **Impact:** Student feedback review incomplete
- **Recommendation:** Create UC-ReviewFeedback/view-responses.cy.js

**Missing Scenario 6: Survey Preview (Instructor)**

- **Current State:** Mentioned in design, not tested
- **Gap:** Need to test:
  - Preview shows survey as students see it
  - All questions visible in preview
  - Navigation works in preview
  - Submit button present but non-functional
- **Impact:** Instructor QA workflow incomplete
- **Recommendation:** Create UC-ManageSurveys/survey-preview.cy.js

**Missing Scenario 7: Survey Edit (Modify Questions)**

- **Current State:** Edit survey exists but question modification not fully tested
- **Gap:** Need to test:
  - Adding new questions to existing survey
  - Modifying question text
  - Removing questions
  - Changing question type
  - Reordering questions
  - Changes saved and reflected in published survey
- **Impact:** Survey management incomplete
- **Recommendation:** Enhance UC-ManageSurveys/edit-survey.cy.js

**Missing Scenario 8: Password Recovery (Complete Flow)**

- **Current State:** Lost password page exists, but full recovery not tested
- **Gap:** Need to test:
  - User enters username/email
  - Email sent with reset link (mock email)
  - Reset link opens password reset form
  - New password set
  - Login with new password succeeds
  - Old password no longer works
- **Impact:** Password recovery validation incomplete
- **Recommendation:** Create UC-Login/lost-password.cy.js

### Low Priority (Edge Cases & Optimization)

**Missing Scenario 9: Form Validation Edge Cases**

- **Current State:** Basic validation tested
- **Gap:** Need to test:
  - Very long inputs (5000+ characters)
  - Special characters (emoji, unicode)
  - SQL injection attempts (should be sanitized)
  - HTML/Script injection in text areas
  - Rapid form submissions (duplicate prevention)
- **Impact:** Security and data integrity edge cases
- **Recommendation:** Create Forms/form-edge-cases.cy.js

**Missing Scenario 10: Survey Pagination**

- **Current State:** Surveys list paginated but pagination not explicitly tested
- **Gap:** Need to test:
  - Next/Previous buttons work
  - Page numbers clickable
  - Correct surveys shown on each page
  - URL changes with pagination
  - Going to last page
  - Going back to first page
- **Impact:** Navigation on large survey lists
- **Recommendation:** Create Navigation/pagination.cy.js

**Missing Scenario 11: Mobile Responsiveness**

- **Current State:** No mobile/tablet tests
- **Gap:** Need to test:
  - Forms functional on mobile (370px width)
  - Forms functional on tablet (768px width)
  - Touch interactions work
  - Dropdowns accessible on mobile
  - Survey list readable on mobile
  - Navigation menu accessible on mobile
- **Impact:** Mobile user experience validation
- **Recommendation:** Create responsive variants of all tests

**Missing Scenario 12: Concurrent Access**

- **Current State:** Single-user tests only
- **Gap:** Need to test:
  - Multiple students completing same survey
  - Instructor editing survey while students completing
  - Race conditions on response submission
  - Data integrity with concurrent access
- **Impact:** Multi-user scenario validation
- **Recommendation:** Create concurrency test (complex)

---

## Part 9: Test Prioritization

### High Priority Tests (CRITICAL - Must Implement)

| #   | Test Case                            | Reason             | Effort | Impact   |
| --- | ------------------------------------ | ------------------ | ------ | -------- |
| 1   | Login Success                        | Core functionality | Low    | Critical |
| 2   | Registration                         | Core functionality | Low    | Critical |
| 3   | Survey List Navigation               | Core workflow      | Low    | Critical |
| 4   | Survey View                          | Core workflow      | Low    | Critical |
| 5   | **Survey Completion with Questions** | Missing core flow  | Medium | Critical |
| 6   | Required Field Validation            | Data integrity     | Low    | High     |
| 7   | Form Submission                      | Core workflow      | Low    | High     |
| 8   | **Account Lockout**                  | Security feature   | Medium | High     |
| 9   | **Auto-Save Progress**               | Data integrity     | Medium | High     |
| 10  | Completed Surveys Review             | Student workflow   | Low    | High     |

### Medium Priority Tests (IMPORTANT - Should Implement)

| #   | Test Case               | Reason              | Effort | Impact |
| --- | ----------------------- | ------------------- | ------ | ------ |
| 11  | Survey Edit (Questions) | Instructor workflow | Medium | Medium |
| 12  | Survey Delete           | Instructor workflow | Low    | Medium |
| 13  | **Password Recovery**   | Security feature    | Medium | Medium |
| 14  | Survey Preview          | Instructor QA       | Low    | Medium |
| 15  | Response Filtering      | Data analysis       | Medium | Medium |
| 16  | Email Validation        | Data quality        | Low    | Medium |
| 17  | Username Uniqueness     | Data integrity      | Low    | Medium |
| 18  | Session Persistence     | User experience     | Medium | Medium |
| 19  | Logout Functionality    | Security            | Low    | Medium |
| 20  | Navigation Links        | User experience     | Low    | Medium |

### Low Priority Tests (NICE TO HAVE - Consider Later)

| #   | Test Case                | Reason               | Effort | Impact |
| --- | ------------------------ | -------------------- | ------ | ------ |
| 21  | Mobile Responsiveness    | Cross-device testing | High   | Low    |
| 22  | Edge Case Inputs         | Robustness           | High   | Low    |
| 23  | SQL Injection Prevention | Security hardening   | High   | Low    |
| 24  | XSS Prevention           | Security hardening   | High   | Low    |
| 25  | Rate Limiting            | Server protection    | High   | Low    |
| 26  | Concurrent Access        | Multi-user scenarios | High   | Low    |
| 27  | Performance Testing      | Load testing         | High   | Low    |
| 28  | Accessibility Testing    | Compliance           | High   | Low    |

---

## Part 10: Application Mental Model

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│            User Interface Layer (Frontend)               │
│                                                          │
│  ├─ Login/Registration/Recovery Forms                   │
│  ├─ Survey List (Public)                                │
│  ├─ Survey Detail & Completion (Student)                │
│  ├─ Completed Surveys Review (Student)                  │
│  ├─ Admin Dashboard (Instructor/Admin)                  │
│  └─ Survey Management (Instructor/Admin)                │
└─────────────────────────────────────────────────────────┘
                        ↓ (HTTP/REST)
┌─────────────────────────────────────────────────────────┐
│         WordPress Backend / Application Server           │
│                                                          │
│  ├─ Authentication System (wp-login.php)                │
│  ├─ User Management (Users)                             │
│  ├─ Survey Post Type (Custom)                           │
│  ├─ Question Management                                 │
│  ├─ Response Collection                                 │
│  ├─ Response Retrieval & Analysis                       │
│  └─ Session Management                                  │
└─────────────────────────────────────────────────────────┘
                        ↓ (Database)
┌─────────────────────────────────────────────────────────┐
│              WordPress MySQL Database                    │
│                                                          │
│  ├─ wp_users (Users: Students, Instructors, Admins)    │
│  ├─ wp_usermeta (User Metadata, Roles)                 │
│  ├─ wp_posts (Surveys as custom post type)             │
│  ├─ wp_postmeta (Survey Questions & Metadata)          │
│  ├─ Custom Tables (Survey Responses)                   │
│  └─ Custom Tables (Response Answers)                   │
└─────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
Student Journey:
1. Visit /survey/ (Public)
   ↓
2. Browse available surveys
   ↓
3. Select a survey
   ↓
4. View /survey/{slug}/ (May require login)
   ↓
5. If questions exist:
   - Load survey form
   - Load question data
   - Student fills answers
   - Auto-save triggers
   - Submit survey
   - Save responses to database
   - Show confirmation message
   ↓
6. Navigate to /my-completed-surveys/
   ↓
7. View survey response detail
   ↓
8. See submitted answers

Instructor Journey:
1. Login (/wp-login.php)
   ↓
2. Navigate to /wp-admin/
   ↓
3. Create/Edit Survey
   - Define title
   - Add questions
   - Set opening/closing dates
   - Save survey
   ↓
4. Publish survey
   ↓
5. View responses
   - Filter by student
   - Analyze data
   - Export responses
   ↓
6. Manage survey (edit, delete, preview)
```

### State Model

```
User Authentication States:
┌─────────────────────────┐
│   Unauthenticated       │ ← Home, About, Survey List (public)
└────────────┬────────────┘
             │ Login
┌────────────▼────────────┐
│   Authenticated         │
├─────────────┬───────────┤
│  Student    │Instructor │ ← Role-specific dashboards
│  Role       │ Role      │
└─────────────┴───────────┘
             │ Logout
┌────────────▼────────────┐
│   Unauthenticated       │ ← Back to home
└─────────────────────────┘

Survey States:
NOT_STARTED → IN_PROGRESS (→ PAUSED) → SUBMITTED → COMPLETED

Question Visibility:
  [Static Questions] ←→ [Conditional Questions]
     Always shown         Shown based on other answers

Form States:
  EMPTY → PARTIALLY_FILLED → FULLY_FILLED → SUBMITTED → CONFIRMED
```

---

## Conclusion

This runtime analysis provides a comprehensive foundation for building a robust Cypress testing suite for the Student Survey Application. The application is well-structured with clear user roles, distinct workflows, and critical security requirements.

**Key Takeaways:**

1. **Authentication** is the foundation - must be thoroughly tested
2. **Survey completion** workflows require multiple question type testing
3. **Auto-save** functionality is critical for user experience
4. **Form validation** must prevent invalid data entry
5. **Security features** (account lockout, password recovery) must be verified
6. **Selector stability** is paramount - use IDs over classes
7. **Dynamic elements** require explicit waits
8. **Test data isolation** prevents cross-test contamination

**Next Steps:**

1. Implement high-priority tests first (Login, Registration, Survey Completion)
2. Create reusable commands and page objects
3. Set up proper test data fixtures
4. Implement test execution order to minimize flakiness
5. Add comprehensive error handling and validation tests
6. Expand to medium/low priority scenarios

This analysis ensures QA automation will be **maintainable, reliable, and comprehensive**.

---

**Document Version:** 1.0  
**Last Updated:** July 10, 2026  
**Analysis Status:** ✅ Complete and Ready for Implementation
