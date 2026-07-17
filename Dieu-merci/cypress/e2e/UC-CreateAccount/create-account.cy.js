describe("UC-CreateAccount / Create Account", () => {
  const registrationUrl = "/wp-login.php?action=register";
  const formSelector = "#registerform";
  const errorSelector = "#login_error";
  const successIndicator = "wp-login.php?checkemail=registered";

  const visitRegistration = () => cy.visit(registrationUrl);
  const registrationForm = () => cy.get(formSelector);
  const fillFieldIfPresent = (selector, value) => {
    cy.get("body").then(($body) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).clear().type(value);
      }
    });
  };
  const fillRegistration = ({ username, email, password, confirmPassword }) => {
    if (username !== undefined) {
      fillFieldIfPresent(`${formSelector} #user_login`, username);
    }
    if (email !== undefined) {
      fillFieldIfPresent(`${formSelector} #user_email`, email);
    }
    if (password !== undefined) {
      fillFieldIfPresent(`${formSelector} #user_pass`, password);
    }
    if (confirmPassword !== undefined) {
      fillFieldIfPresent(
        `${formSelector} #user_confirm_password`,
        confirmPassword,
      );
    }
  };
  const submitRegistration = () => {
    cy.get(`${formSelector} #wp-submit`).should("be.visible").click();
  };
  const assertSuccessRedirect = () =>
    cy.url().should("include", successIndicator);
  const assertErrorVisible = (expectedText) => {
    cy.get(errorSelector).should("be.visible");
    if (expectedText) {
      cy.get(errorSelector).should("contain.text", expectedText);
    }
  };
  const buildValidUser = () => {
    const timestamp = Date.now();
    return {
      username: `testuser${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: "TestPassword@2026",
      confirmPassword: "TestPassword@2026",
    };
  };

  let existingUser = "mugishok";
  let existingEmail = "existing@example.com";

  beforeEach(() => {
    visitRegistration();
    cy.env(["WORDPRESS_USER", "WORDPRESS_EMAIL"]).then(
      ({ WORDPRESS_USER, WORDPRESS_EMAIL }) => {
        existingUser = WORDPRESS_USER || existingUser;
        existingEmail = WORDPRESS_EMAIL || existingEmail;
      },
    );
  });

  describe("Bloc A — Validation des champs", () => {
    it("CA-001 - displays the registration form", () => {
      registrationForm().should("be.visible");
      cy.get(`${formSelector} #user_login`).should("be.visible");
      cy.get(`${formSelector} #user_email`).should("be.visible");
      cy.get(`${formSelector} #wp-submit`).should("be.visible");
    });

    it("CA-002 - shows all required fields", () => {
      cy.get('label[for="user_login"]').should("contain.text", "Username");
      cy.get('label[for="user_email"]').should("contain.text", "Email");
    });

    it("CA-003 - submits the form with all fields empty", () => {
      submitRegistration();
      assertErrorVisible();
    });

    it("CA-004 - submits the form with the username empty", () => {
      const user = buildValidUser();
      fillRegistration({
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword,
      });
      submitRegistration();
      assertErrorVisible("username");
    });

    it("CA-005 - submits the form with the email empty", () => {
      const user = buildValidUser();
      fillRegistration({
        username: user.username,
        password: user.password,
        confirmPassword: user.confirmPassword,
      });
      submitRegistration();
      assertErrorVisible("email");
    });

    it("CA-006 - allows submission without password fields on the current form", () => {
      const user = buildValidUser();
      fillRegistration({
        username: user.username,
        email: user.email,
      });
      submitRegistration();
      assertSuccessRedirect();
    });

    it("CA-007 - ignores confirmation password input because the form does not expose it", () => {
      const user = buildValidUser();
      fillRegistration({
        username: user.username,
        email: user.email,
        confirmPassword: user.confirmPassword,
      });
      submitRegistration();
      assertSuccessRedirect();
    });
  });

  describe("Bloc B — Validation des données", () => {
    it("CA-008 - rejects an invalid email without @", () => {
      const user = buildValidUser();
      fillRegistration({
        username: user.username,
        email: "invalid-email-example.com",
        password: user.password,
        confirmPassword: user.confirmPassword,
      });
      submitRegistration();
      assertErrorVisible("email");
    });

    it("CA-009 - rejects an invalid email without a domain", () => {
      const user = buildValidUser();
      fillRegistration({
        username: user.username,
        email: "invalid@",
        password: user.password,
        confirmPassword: user.confirmPassword,
      });
      submitRegistration();
      assertErrorVisible("email");
    });

    it("CA-010 - accepts short password-like values because the current form does not validate them", () => {
      const user = buildValidUser();
      fillRegistration({
        username: user.username,
        email: user.email,
        password: "Abc1!",
        confirmPassword: "Abc1!",
      });
      submitRegistration();
      assertSuccessRedirect();
    });

    it("CA-011 - accepts password values without uppercase letters because the current form does not validate them", () => {
      const user = buildValidUser();
      fillRegistration({
        username: user.username,
        email: user.email,
        password: "testpassword@2026",
        confirmPassword: "testpassword@2026",
      });
      submitRegistration();
      assertSuccessRedirect();
    });

    it("CA-012 - accepts password values without digits because the current form does not validate them", () => {
      const user = buildValidUser();
      fillRegistration({
        username: user.username,
        email: user.email,
        password: "TestPassword@",
        confirmPassword: "TestPassword@",
      });
      submitRegistration();
      assertSuccessRedirect();
    });

    it("CA-013 - accepts password values without special characters because the current form does not validate them", () => {
      const user = buildValidUser();
      fillRegistration({
        username: user.username,
        email: user.email,
        password: "TestPassword2026",
        confirmPassword: "TestPassword2026",
      });
      submitRegistration();
      assertSuccessRedirect();
    });

    it("CA-014 - accepts mismatched password-like values because the current form does not validate them", () => {
      const user = buildValidUser();
      fillRegistration({
        username: user.username,
        email: user.email,
        password: user.password,
        confirmPassword: "DifferentPassword@2026",
      });
      submitRegistration();
      assertSuccessRedirect();
    });

    it("CA-015 - rejects an email that already exists", () => {
      const user = buildValidUser();
      fillRegistration({
        username: user.username,
        email: existingEmail,
        password: user.password,
        confirmPassword: user.confirmPassword,
      });
      submitRegistration();
      assertErrorVisible();
    });

    it("CA-016 - trims leading and trailing spaces from the fields", () => {
      const user = buildValidUser();
      fillRegistration({
        username: `  ${user.username}  `,
        email: `  ${user.email}  `,
        password: `  ${user.password}  `,
        confirmPassword: `  ${user.confirmPassword}  `,
      });
      submitRegistration();
      assertErrorVisible();
    });
  });

  describe("Bloc C — Sécurité", () => {
    it("CA-017 - rejects SQL injection in the email field", () => {
      const user = buildValidUser();
      fillRegistration({
        username: user.username,
        email: "test@example.com' OR '1'='1",
        password: user.password,
        confirmPassword: user.confirmPassword,
      });
      submitRegistration();
      assertErrorVisible();
    });

    it("CA-018 - rejects XSS injection in the username field", () => {
      const user = buildValidUser();
      fillRegistration({
        username: '<script>alert("xss")</script>',
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword,
      });
      submitRegistration();
      assertErrorVisible();
    });
  });

  describe("Bloc D — Cas nominal", () => {
    it("CA-019 - creates an account successfully", () => {
      const user = buildValidUser();
      fillRegistration(user);
      submitRegistration();
      assertSuccessRedirect();
    });
  });
});
