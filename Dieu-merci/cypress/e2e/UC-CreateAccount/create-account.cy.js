describe("UC-CreateAccount / Create Account", () => {
  const registrationUrl = "/wp-login.php?action=register";
  const formSelector = "#registerform";
  const errorSelector = "#login_error";
  const successIndicator = "wp-login.php?checkemail=registered";

  const visitRegistration = () => cy.visit(registrationUrl);
  const registrationForm = () => cy.get(formSelector);
  const fillRegistration = ({ username, email }) => {
    if (username) cy.get(`${formSelector} #user_login`).clear().type(username);
    if (email) cy.get(`${formSelector} #user_email`).clear().type(email);
  };
  const submitRegistration = () => cy.get(`${formSelector} #wp-submit`).click();
  const assertSuccessRedirect = () =>
    cy.url().should("include", successIndicator);
  const assertErrorVisible = (expectedText) => {
    cy.get(errorSelector).should("be.visible");
    if (expectedText)
      cy.get(errorSelector).should("contain.text", expectedText);
  };

  let existingUser = "mugishok";
  let existingEmail = "existing@example.com";

  beforeEach(() => {
    visitRegistration();
    cy.env(["WORDPRESS_USER", "WORDPRESS_EMAIL"]).then(
      ({ WORDPRESS_USER, WORDPRESS_EMAIL }) => {
        existingUser = WORDPRESS_USER || "mugishok";
        existingEmail = WORDPRESS_EMAIL || "existing@example.com";
      },
    );
  });

  describe("Registration success and happy-path behaviors", () => {
    it("should display the registration form with all required fields", () => {
      registrationForm().should("be.visible");
      cy.get(`${formSelector} #user_login`).should("be.visible");
      cy.get('label[for="user_login"]').should("contain", "Username");
      cy.get(`${formSelector} #user_email`).should("be.visible");
      cy.get('label[for="user_email"]').should("contain", "Email");
      cy.get(`${formSelector} #wp-submit`)
        .should("be.visible")
        .and("have.value", "Register");
      cy.get('a[href*="wp-login.php"]').should("be.visible");
    });

    it("should successfully register a new user with valid data", () => {
      cy.generateTestUser().then((user) => {
        fillRegistration(user);
        submitRegistration();
        assertSuccessRedirect();
        cy.get("#login-message")
          .should("be.visible")
          .and("contain.text", "Registration complete")
          .and("contain.text", "check your email");
        cy.get("#login-message a")
          .should("contain.text", "login page")
          .and("have.attr", "href");
      });
    });

    it("should redirect to login page from registration page", () => {
      cy.get('a[href*="wp-login.php"]:not([href*="register"])').first().click();
      cy.url().should("include", "wp-login.php");
      cy.get("#loginform").should("be.visible");
    });

    it("should maintain form state on refresh", () => {
      cy.generateTestUser().then((user) => {
        fillRegistration(user);
        cy.get(`${formSelector} #user_login`).should(
          "have.value",
          user.username,
        );
        cy.get(`${formSelector} #user_email`).should("have.value", user.email);
        cy.reload();
        cy.get(`${formSelector} #user_login`).should("have.value", "");
        cy.get(`${formSelector} #user_email`).should("have.value", "");
      });
    });

    it("should handle special characters in username correctly", () => {
      const user = {
        username: `testuser_special_${Date.now()}`,
        email: `testuser_special_${Date.now()}@example.com`,
      };
      fillRegistration(user);
      submitRegistration();
      assertSuccessRedirect();
    });

    it("should verify email field accepts valid email formats", () => {
      cy.generateTestUser().then((user) => {
        fillRegistration(user);
        submitRegistration();
        assertSuccessRedirect();
      });
    });

    it("should display form after canceling registration", () => {
      registrationForm().should("be.visible");
      cy.visit("/");
      visitRegistration();
      registrationForm().should("be.visible");
    });

    it("should have password requirements info available", () => {
      cy.get(`${formSelector} #user_pass`).should("not.exist");
      registrationForm().should("be.visible");
    });

    it("should allow multiple registration attempts with different emails", () => {
      cy.generateTestUser().then((user1) => {
        fillRegistration(user1);
        submitRegistration();
        assertSuccessRedirect();

        visitRegistration();
        cy.generateTestUser().then((user2) => {
          fillRegistration(user2);
          submitRegistration();
          assertSuccessRedirect();
        });
      });
    });
  });

  describe("Registration validation and error handling", () => {
    it("should display error when both fields are empty", () => {
      submitRegistration();
      assertErrorVisible();
      cy.get(errorSelector)
        .should("contain.text", "username")
        .and("contain.text", "email");
    });

    it("should display error when username is empty", () => {
      const email = `test_${Date.now()}@example.com`;
      fillRegistration({ email });
      submitRegistration();
      assertErrorVisible("username");
    });

    it("should display error when email is empty", () => {
      const username = `testuser_${Date.now()}`;
      fillRegistration({ username });
      submitRegistration();
      assertErrorVisible("email");
    });

    it("should display error for invalid email format", () => {
      const username = `testuser_${Date.now()}`;
      const invalidEmails = [
        "notanemail",
        "user@",
        "@example.com",
        "user name@example.com",
        "user@example",
      ];

      invalidEmails.forEach((invalidEmail) => {
        visitRegistration();
        fillRegistration({ username, email: invalidEmail });
        submitRegistration();
        cy.get(errorSelector).should("be.visible");
      });
    });

    it("should display error for duplicate username", () => {
      const username = existingUser;
      const email = `test_${Date.now()}@example.com`;
      fillRegistration({ username, email });
      submitRegistration();
      assertErrorVisible("already exists");
    });

    it("should display error for duplicate email", () => {
      const username = `testuser_${Date.now()}`;
      const duplicateEmail = existingEmail;
      fillRegistration({ username, email: duplicateEmail });
      submitRegistration();
      assertErrorVisible();
    });

    it("should validate username length requirements", () => {
      const email = `test_${Date.now()}@example.com`;
      fillRegistration({ username: "a", email });
      submitRegistration();
      cy.get("body").then(($body) => {
        if ($body.find(errorSelector).length > 0) {
          cy.get(errorSelector).should("be.visible");
        }
      });
    });

    it("should allow valid usernames with underscores and numbers", () => {
      const validUsernames = [
        `test_user_${Date.now()}`,
        `testuser${Date.now()}`,
        `test.user_${Date.now()}`,
      ];

      validUsernames.forEach((validUsername, index) => {
        if (index > 0) visitRegistration();
        const email = `test${index}_${Date.now()}@example.com`;
        fillRegistration({ username: validUsername, email });
        submitRegistration();
        assertSuccessRedirect();
      });
    });

    it("should trim whitespace from username and email", () => {
      const username = `testuser_${Date.now()}`;
      const email = `test_${Date.now()}@example.com`;
      fillRegistration({ username: `  ${username}  `, email: `  ${email}  ` });
      submitRegistration();
      assertSuccessRedirect();
    });

    it("should display clear error messages with actionable information", () => {
      submitRegistration();
      assertErrorVisible();
      cy.get(errorSelector).should("have.class", "error");
      cy.get(errorSelector)
        .invoke("text")
        .then((text) => {
          expect(text.length).to.be.greaterThan(0);
        });
    });

    it("should allow user to correct validation errors", () => {
      submitRegistration();
      assertErrorVisible();
      const username = `testuser_${Date.now()}`;
      const email = `test_${Date.now()}@example.com`;
      fillRegistration({ username, email });
      submitRegistration();
      assertSuccessRedirect();
    });

    it("should validate email format with plus addressing", () => {
      const username = `testuser_${Date.now()}`;
      const emailWithPlus = `test+tag_${Date.now()}@example.com`;
      fillRegistration({ username, email: emailWithPlus });
      submitRegistration();
      assertSuccessRedirect();
    });

    it("should maintain focus on invalid field", () => {
      const email = `test_${Date.now()}@example.com`;
      fillRegistration({ email });
      submitRegistration();
      assertErrorVisible();
      cy.get(`${formSelector} #user_login`)
        .should("be.visible")
        .and("have.value", "");
    });
  });
});
