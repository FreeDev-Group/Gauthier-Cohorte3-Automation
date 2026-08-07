describe("UC-ManageSurveys / Instructor creates questions from the question page", () => {
  const loginUrl = "/wp-login.php";
  const newSurveyUrl = "/wp-admin/post-new.php?post_type=survey";
  const newQuestionUrl = "/wp-admin/post-new.php?post_type=question";
  const surveyListUrl = "/wp-admin/edit.php?post_type=survey";
  const defaultSurveyDescription =
    "This survey collects feedback from students about the web development course.";
  const ignoredUncaughtMessages = [
    "The response is not a valid JSON response",
    "Transition was skipped",
    "Failed to fetch",
  ];

  let username = "devmerci";
  let password = "Merci@2026";

  before(() => {
    cy.env(["WORDPRESS_INSTRUCTOR_USER", "WORDPRESS_INSTRUCTOR_PASSWORD"]).then(
      ({ WORDPRESS_INSTRUCTOR_USER, WORDPRESS_INSTRUCTOR_PASSWORD }) => {
        username = WORDPRESS_INSTRUCTOR_USER || username;
        password = WORDPRESS_INSTRUCTOR_PASSWORD || password;
      },
    );
  });

  beforeEach(() => {
    cy.on("uncaught:exception", (err) => {
      const message = err?.message || "";

      if (
        ignoredUncaughtMessages.some((fragment) => message.includes(fragment))
      ) {
        return false;
      }

      return true;
    });
  });

  const visitPage = (url) => {
    cy.visit(url, {
      failOnStatusCode: false,
      timeout: 180000,
      pageLoadTimeout: 180000,
    });
  };

  const loginAsInstructor = () => {
    visitPage(loginUrl);
    cy.get("#loginform", { timeout: 30000 }).should("be.visible");
    cy.get("#loginform #user_login").clear().type(username);
    cy.get("#loginform #user_pass").clear().type(password);
    cy.get("#loginform #wp-submit").click();

    cy.get("body", { timeout: 20000 }).should(($body) => {
      const text = $body.text().toLowerCase();
      const hasAuthError =
        text.includes("invalid username") ||
        text.includes("incorrect password") ||
        text.includes("cookies are blocked");
      expect(hasAuthError, "Login should succeed").to.be.false;
    });
  };

  const clickPrimaryAction = (label) => {
    cy.get("body").then(($body) => {
      const candidates = Cypress.$(
        "#publish, #save-post, button[type='submit'], input[type='submit']",
        $body,
      );
      const matching = candidates.filter((_, el) => {
        const text = Cypress.$(el).text().trim().toLowerCase();
        const value = (el.value || "").trim().toLowerCase();
        const id = (el.id || "").toLowerCase();
        return (
          id === "publish" ||
          id === "save-post" ||
          text.includes(label.toLowerCase()) ||
          value.includes(label.toLowerCase())
        );
      });
      const visible = matching.filter(":visible");
      const target = visible.length ? visible.first() : matching.first();
      cy.wrap(target).click({ force: true });
    });
  };

  const assertSurveyWasCreated = (surveyTitle) => {
    cy.location("pathname", { timeout: 40000 }).should(
      "include",
      "/wp-admin/post.php",
    );
    cy.get("#post_title, #title", { timeout: 20000 }).should(
      "have.value",
      surveyTitle,
    );
  };

  const createSurvey = (surveyTitle, description) => {
    loginAsInstructor();
    visitPage(newSurveyUrl);
    cy.get("#post_title, #title", { timeout: 30000 }).clear().type(surveyTitle);
    cy.fillWpEditor(description || defaultSurveyDescription);
    clickPrimaryAction("Publish");
    assertSurveyWasCreated(surveyTitle);

    return cy.url().then((url) => {
      const match = url.match(/[?&]post=(\d+)/);
      return match ? Number(match[1]) : null;
    });
  };

  const selectQuestionType = (questionType) => {
    cy.get("#question_type")
      .should("be.visible")
      .then(($select) => {
        const options = Array.from($select[0].options);
        const normalized = String(questionType)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        const match = options.find((opt) => {
          const optionText = String(opt.text || "")
            .trim()
            .toLowerCase();
          const optionValue = String(opt.value || "")
            .trim()
            .toLowerCase();
          return (
            optionText.includes(String(questionType).toLowerCase()) ||
            optionValue.replace(/[^a-z0-9]/g, "") === normalized ||
            optionValue.includes(
              String(questionType).toLowerCase().replace(/\s+/g, "_"),
            )
          );
        });

        if (match) {
          cy.wrap($select).select(match.value);
        } else if (options.length) {
          cy.wrap($select).select(options[0].value);
        }
      });
  };

  const fillAnswerOptions = (options) => {
    if (!options.length) {
      return;
    }

    cy.get("body").then(($body) => {
      const textarea = Cypress.$(
        'textarea[placeholder*="Enter one option per line"], textarea[name*="option"], textarea[id*="option"], .question-options textarea',
        $body,
      ).filter(":visible");

      if (textarea.length) {
        cy.wrap(textarea.first())
          .clear()
          .type(options.join("\n"), { delay: 0 });
      }
    });
  };

  const selectSurveyForQuestion = (surveyId, surveyTitle) => {
    cy.get("#question_parent_survey").should("be.visible");

    cy.get("#question_parent_survey option").then(($options) => {
      const optionsArray = Array.from($options);
      const matchingSurvey = optionsArray.find(
        (option) =>
          String(option.value) === String(surveyId) ||
          option.text.trim().toLowerCase().includes(surveyTitle.toLowerCase()),
      );

      const fallbackOption = optionsArray.find(
        (option) => option.value && option.text.trim(),
      );

      const targetOption = matchingSurvey || fallbackOption;

      if (targetOption) {
        cy.get("#question_parent_survey").select(targetOption.value);
      }
    });
  };

  const createQuestionForSurvey = (
    surveyId,
    surveyTitle,
    questionTitle,
    questionType,
    options = [],
  ) => {
    visitPage(newQuestionUrl);

    cy.get("#title", { timeout: 30000 }).clear().type(questionTitle);
    selectSurveyForQuestion(surveyId, surveyTitle);
    selectQuestionType(questionType);
    fillAnswerOptions(options);

    clickPrimaryAction("Save Draft");

    cy.get("#title", { timeout: 20000 }).should("have.value", questionTitle);
    cy.get("#question_parent_survey", { timeout: 20000 }).should("be.visible");
  };

  const createQuestionsForSurvey = (surveyId, surveyTitle, questions) => {
    questions.forEach(({ title, type, options }) => {
      createQuestionForSurvey(surveyId, surveyTitle, title, type, options);
    });
  };

  it("should allow an instructor to create a survey and add six professional questions from the question page", () => {
    const surveyTitle = `Web Development Feedback ${Date.now()}`;
    const surveyDescription = defaultSurveyDescription;
    const questions = [
      {
        title: "How satisfied are you with the course content?",
        type: "Multiple Choice",
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
      },
      {
        title: "How would you rate the difficulty of this course?",
        type: "Multiple Choice",
        options: ["Very Easy", "Easy", "Moderate", "Difficult"],
      },
      {
        title: "The course objectives were clearly explained.",
        type: "True/False",
        options: ["True", "False"],
      },
      {
        title: "The course materials were helpful for my learning.",
        type: "True/False",
        options: ["True", "False"],
      },
      {
        title: "What improvements would you suggest for this course?",
        type: "Short Answer",
        options: [],
      },
      {
        title:
          "Please describe your overall experience in this course in detail.",
        type: "Essay",
        options: [],
      },
    ];

    createSurvey(surveyTitle, surveyDescription).then((surveyId) => {
      createQuestionsForSurvey(surveyId, surveyTitle, questions);
    });

    visitPage(surveyListUrl);
    cy.get("a.row-title", { timeout: 30000 })
      .contains(surveyTitle)
      .should("be.visible");
    cy.get("body").should("not.contain", "Access denied");
  });
});
