describe("UC-Login / Login", () => {
  const loginUrl = "/wp-login.php";
  const loginFormSelector = "#loginform";
  const loginErrorSelector = "#login_error";

  const visitLogin = () => cy.visit(loginUrl);
  const loginForm = () => cy.get(loginFormSelector);
  const fillLogin = ({ username, password }) => {
    if (username)
      cy.get(`${loginFormSelector} #user_login`).clear().type(username);
    if (password)
      cy.get(`${loginFormSelector} #user_pass`).clear().type(password);
  };
  const submitLogin = () => cy.get(`${loginFormSelector} #wp-submit`).click();
  let defaultUser = "mugishok";
  let defaultPassword = "Merci@2026";
  let studentUser = "mugishok";
  let studentPassword = "Merci@2026";
  let instructorUser = "devmerci";
  let instructorPassword = "Merci@2026";

  beforeEach(() => {
    visitLogin();
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
        defaultUser = WORDPRESS_USER || "mugishok";
        defaultPassword = WORDPRESS_PASSWORD || "Merci@2026";
        studentUser = WORDPRESS_STUDENT_USER || "mugishok";
        studentPassword = WORDPRESS_STUDENT_PASSWORD || "Merci@2026";
        instructorUser = WORDPRESS_INSTRUCTOR_USER || "devmerci";
        instructorPassword = WORDPRESS_INSTRUCTOR_PASSWORD || "Merci@2026";
      },
    );
  });

  describe("Login page UI and happy-path flows", () => {
    it("Should display the login form with all required elements", () => {
      loginForm().should("be.visible");
      cy.get(`${loginFormSelector} #user_login`).should("be.visible");
      cy.get('label[for="user_login"]').should("contain", "Username or Email");
      cy.get(`${loginFormSelector} #user_pass`).should("be.visible");
      cy.get('label[for="user_pass"]').should("contain", "Password");
      cy.get(`${loginFormSelector} #rememberme`).should("exist");
      cy.get('label[for="rememberme"]').should("contain", "Remember Me");
      cy.get(`${loginFormSelector} #wp-submit`)
        .should("be.visible")
        .and("have.value", "Log In");
      cy.get('a[href*="action=lostpassword"]').should("be.visible");
      cy.get('a[href*="privacy-policy"]').should("exist");
    });

    it("Should successfully login with valid credentials", () => {
      cy.login(defaultUser(), defaultPassword());
      cy.get(loginErrorSelector).should("not.exist");
      cy.get("body").should("not.contain", "Log In");
    });

    it("Should display remember me functionality", () => {
      cy.get(`${loginFormSelector} #rememberme`).should("not.be.checked");
      cy.get(`${loginFormSelector} #rememberme`).check();
      cy.get(`${loginFormSelector} #rememberme`).should("be.checked");
      fillLogin({ username: defaultUser, password: defaultPassword });
      submitLogin();
      cy.url().should("not.include", "wp-login.php");
    });

    it("Should maintain login session across page navigation", () => {
      fillLogin({ username: defaultUser(), password: defaultPassword() });
      submitLogin();
      cy.url().should("not.include", "wp-login.php");
      cy.visit("/");
      cy.wait(1000);
      cy.get("body").should("not.contain", "Log In");
    });

    it("Should not display login error on fresh login page", () => {
      cy.get(loginErrorSelector).should("not.exist");
      cy.get("body").should("not.contain", "Invalid username");
    });

    it("Should redirect from login page if already logged in", () => {
      fillLogin({ username: defaultUser, password: defaultPassword });
      submitLogin();
      cy.url().should("not.include", "wp-login.php");
      cy.visit(loginUrl);
      cy.url().should("not.include", "wp-login.php");
    });

    it("Should successfully login as student (mugishok)", () => {
      fillLogin({ username: studentUser, password: studentPassword });
      submitLogin();
      cy.url().should("not.include", "wp-login.php");
      cy.get(loginErrorSelector).should("not.exist");
    });

    it("Should successfully login as instructor (devmerci)", () => {
      fillLogin({ username: instructorUser, password: instructorPassword });
      submitLogin();
      cy.url().should("not.include", "wp-login.php");
      cy.get(loginErrorSelector).should("not.exist");
    });
  });

  describe("Login error handling and validation", () => {
    it("Should display error message with invalid password", () => {
      fillLogin({ username: defaultUser(), password: "WrongPassword@2026" });
      submitLogin();
      cy.get(loginErrorSelector)
        .should("be.visible")
        .and("contain.text", "incorrect")
        .and("contain.text", "password");
      cy.get(`${loginErrorSelector} a`).should(
        "contain.text",
        "Lost your password?",
      );
      cy.url().should("include", "wp-login.php");
      cy.get(`${loginFormSelector} #user_pass`).should("have.value", "");
    });

    it("Should display error message with non-existent username", () => {
      const nonExistentUser = `invaliduser${Date.now()}`;
      fillLogin({ username: nonExistentUser, password: "AnyPassword@2026" });
      submitLogin();
      cy.get(loginErrorSelector)
        .should("be.visible")
        .and("contain.text", "Invalid");
    });

    it("Should display error with empty username field", () => {
      cy.get(`${loginFormSelector} #user_login`).should("have.value", "");
      cy.get(`${loginFormSelector} #user_pass`)
        .clear()
        .type("SomePassword@2026");
      submitLogin();
      cy.get(loginErrorSelector).should("be.visible");
    });

    it("Should display error with empty password field", () => {
      fillLogin({ username: defaultUser() });
      cy.get(`${loginFormSelector} #user_pass`).should("have.value", "");
      submitLogin();
      cy.get(loginErrorSelector).should("be.visible");
    });

    it("Should display error with both fields empty", () => {
      cy.get(`${loginFormSelector} #user_login`).should("have.value", "");
      cy.get(`${loginFormSelector} #user_pass`).should("have.value", "");
      submitLogin();
      cy.get(loginErrorSelector).should("be.visible");
    });

    it("Should allow retry after failed login", () => {
      fillLogin({ username: defaultUser(), password: "WrongPassword" });
      submitLogin();
      cy.get(loginErrorSelector).should("be.visible");
      fillLogin({ username: defaultUser(), password: defaultPassword() });
      submitLogin();
      cy.url().should("not.include", "wp-login.php");
      cy.get(loginErrorSelector).should("not.exist");
    });

    it("Should trim whitespace from username field", () => {
      fillLogin({
        username: `  ${defaultUser()}  `,
        password: defaultPassword(),
      });
      submitLogin();
      cy.url().should("not.include", "wp-login.php");
    });

    it("Should display specific error for exceeded login attempts", () => {
      for (let i = 0; i < 3; i += 1) {
        visitLogin();
        fillLogin({ username: defaultUser(), password: "WrongPassword" });
        submitLogin();
        cy.get(loginErrorSelector).should("be.visible");
      }

      visitLogin();
      fillLogin({ username: defaultUser(), password: "AnotherWrongPassword" });
      submitLogin();
      cy.get(loginErrorSelector).should("be.visible");
    });

    it("Should maintain error message visibility on page", () => {
      fillLogin({ username: defaultUser(), password: "InvalidPassword" });
      submitLogin();
      cy.get(loginErrorSelector).should("be.visible");
      loginForm().scrollIntoView();
      cy.get(loginErrorSelector).should("be.visible");
      cy.get(loginErrorSelector).should("be.in.viewport");
    });

    it("Should allow clearing password field after error", () => {
      fillLogin({ username: defaultUser(), password: "InvalidPassword" });
      submitLogin();
      cy.get(loginErrorSelector).should("be.visible");
      cy.get(`${loginFormSelector} #user_pass`)
        .clear()
        .should("have.value", "");
      cy.get(`${loginFormSelector} #user_pass`).clear().type("NewPassword");
      cy.get(`${loginFormSelector} #user_pass`).should(
        "have.value",
        "NewPassword",
      );
    });

    it("Should display error when student (mugishok) uses invalid password", () => {
      visitLogin();
      fillLogin({ username: studentUser(), password: "WrongStudentPassword" });
      submitLogin();
      cy.get(loginErrorSelector).should("be.visible");
      cy.url().should("include", "wp-login.php");
    });

    it("Should display error when instructor (devmerci) uses invalid password", () => {
      visitLogin();
      fillLogin({
        username: instructorUser(),
        password: "WrongInstructorPassword",
      });
      submitLogin();
      cy.get(loginErrorSelector).should("be.visible");
      cy.url().should("include", "wp-login.php");
    });
  });
});
