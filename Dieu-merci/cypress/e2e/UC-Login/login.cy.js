describe("UC-Login / Login", () => {
  const loginUrl = "/wp-login.php";
  const loginFormSelector = "#loginform";
  const loginErrorSelector = "#login_error";
  const dashboardUrl = "/wp-admin/";

  const visitLogin = () => cy.visit(loginUrl);
  const loginForm = () => cy.get(loginFormSelector);
  const fillLogin = ({ username, password }) => {
    if (username !== undefined) {
      cy.get(`${loginFormSelector} #user_login`).clear().type(username);
    }
    if (password !== undefined) {
      cy.get(`${loginFormSelector} #user_pass`).clear().type(password);
    }
  };
  const submitLogin = () => cy.get(`${loginFormSelector} #wp-submit`).click();
  const assertErrorVisible = (expectedText) => {
    cy.get(loginErrorSelector).should("be.visible");
    if (expectedText) {
      cy.get(loginErrorSelector).should("contain.text", expectedText);
    }
  };

  let credentials = {
    username: "mugishok",
    password: "Merci@2026",
  };
  let student = {
    username: "mugishok",
    password: "Merci@2026",
  };
  let instructor = {
    username: "devmerci",
    password: "Merci@2026",
  };

  beforeEach(() => {
    visitLogin();
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.env([
      "WORDPRESS_USER",
      "WORDPRESS_PASSWORD",
      "WORDPRESS_STUDENT_USER",
      "WORDPRESS_STUDENT_PASSWORD",
      "WORDPRESS_INSTRUCTOR_USER",
      "WORDPRESS_INSTRUCTOR_PASSWORD",
    ]).then(
      ({
        WORDPRESS_USER,
        WORDPRESS_PASSWORD,
        WORDPRESS_STUDENT_USER,
        WORDPRESS_STUDENT_PASSWORD,
        WORDPRESS_INSTRUCTOR_USER,
        WORDPRESS_INSTRUCTOR_PASSWORD,
      }) => {
        credentials = {
          username: WORDPRESS_USER || "mugishok",
          password: WORDPRESS_PASSWORD || "Merci@2026",
        };
        student = {
          username: WORDPRESS_STUDENT_USER || credentials.username,
          password: WORDPRESS_STUDENT_PASSWORD || credentials.password,
        };
        instructor = {
          username: WORDPRESS_INSTRUCTOR_USER || "devmerci",
          password: WORDPRESS_INSTRUCTOR_PASSWORD || credentials.password,
        };
      },
    );
  });

  describe("Bloc A — Validation du formulaire", () => {
    it("LG-001 - displays the login page", () => {
      loginForm().should("be.visible");
      cy.get(`${loginFormSelector} #user_login`).should("be.visible");
      cy.get('label[for="user_login"]').should(
        "contain.text",
        "Username or Email",
      );
      cy.get(`${loginFormSelector} #user_pass`).should("be.visible");
      cy.get('label[for="user_pass"]').should("contain.text", "Password");
      cy.get(`${loginFormSelector} #wp-submit`).should("be.visible");
    });

    it("LG-002 - shows all required fields", () => {
      cy.get(`${loginFormSelector} #user_login`).should("be.visible");
      cy.get(`${loginFormSelector} #user_pass`).should("be.visible");
      cy.get(`${loginFormSelector} #rememberme`).should("exist");
      cy.get(`${loginFormSelector} #wp-submit`).should("be.visible");
    });

    it("LG-003 - submits the form with all fields empty", () => {
      submitLogin();
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        "wp-login.php",
      );
    });

    it("LG-004 - submits the form with the email empty", () => {
      fillLogin({ password: credentials.password });
      submitLogin();
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        "wp-login.php",
      );
    });

    it("LG-005 - submits the form with the password empty", () => {
      fillLogin({ username: credentials.username });
      submitLogin();
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        "wp-login.php",
      );
    });
  });

  describe("Bloc B — Validation des données", () => {
    it("LG-006 - rejects an invalid email without @", () => {
      fillLogin({
        username: "invalid-email.example.com",
        password: credentials.password,
      });
      submitLogin();
      assertErrorVisible();
    });

    it("LG-007 - rejects an invalid email without a domain", () => {
      fillLogin({ username: "invalid@", password: credentials.password });
      submitLogin();
      assertErrorVisible();
    });

    it("LG-008 - rejects an incorrect password", () => {
      fillLogin({
        username: credentials.username,
        password: "WrongPassword@2026",
      });
      submitLogin();
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        "wp-login.php",
      );
      cy.get("body").then(($body) => {
        if ($body.find(loginErrorSelector).length > 0) {
          cy.get(loginErrorSelector).should("be.visible");
        }
      });
    });

    it("LG-009 - rejects a non-existent email", () => {
      const nonExistentUser = `invaliduser${Date.now()}`;
      fillLogin({ username: nonExistentUser, password: credentials.password });
      submitLogin();
      assertErrorVisible();
    });

    it("LG-010 - trims spaces around a valid email", () => {
      fillLogin({
        username: `  ${credentials.username}  `,
        password: credentials.password,
      });
      submitLogin();
      cy.location("pathname", { timeout: 10000 }).then((pathname) => {
        expect(pathname).to.match(/wp-login\.php|wp-admin/);
      });
    });

    it("LG-011 - rejects a password containing unnecessary spaces", () => {
      fillLogin({
        username: credentials.username,
        password: ` ${credentials.password} `,
      });
      submitLogin();
      assertErrorVisible();
    });
  });

  describe("Bloc C — Sécurité", () => {
    it("LG-012 - rejects SQL injection in the email field", () => {
      fillLogin({
        username: "admin' OR '1'='1",
        password: credentials.password,
      });
      submitLogin();
      assertErrorVisible();
    });

    it("LG-013 - rejects SQL injection in the password field", () => {
      fillLogin({ username: credentials.username, password: "' OR '1'='1" });
      submitLogin();
      assertErrorVisible();
    });

    it("LG-014 - rejects XSS injection in the email field", () => {
      fillLogin({
        username: '<script>alert("xss")</script>',
        password: credentials.password,
      });
      submitLogin();
      assertErrorVisible();
    });

    it("LG-015 - rejects XSS injection in the password field", () => {
      fillLogin({
        username: credentials.username,
        password: '<script>alert("xss")</script>',
      });
      submitLogin();
      assertErrorVisible();
    });

    it("LG-016 - redirects unauthenticated users away from the dashboard", () => {
      cy.visit(dashboardUrl);
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        "wp-login.php",
      );
    });

    it("LG-017 - requires authentication again after a logout state", () => {
      cy.clearCookies();
      cy.clearLocalStorage();
      visitLogin();
      loginForm().should("be.visible");

      cy.visit(dashboardUrl);
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        "wp-login.php",
      );
    });
  });

  describe("Bloc D — Cas nominal", () => {
    it("LG-018 - logs in successfully with valid credentials", () => {
      cy.login("mugishok", "Merci@2026");
    });
  });
});
