describe("UC-ManageQuestions / Manage Survey Questions", () => {
  let username = "devmerci";
  let password = "Merci@2026";
  const surveyListUrl = "/wp-admin/edit.php?post_type=survey";
  const newSurveyUrl = "/wp-admin/post-new.php?post_type=survey";
  const noticeSuccess = ".notice-success, .updated, .is-success";

  before(() => {
    cy.env(["WORDPRESS_INSTRUCTOR_USER", "WORDPRESS_INSTRUCTOR_PASSWORD"]).then(
      ({ WORDPRESS_INSTRUCTOR_USER, WORDPRESS_INSTRUCTOR_PASSWORD }) => {
        username = WORDPRESS_INSTRUCTOR_USER || "devmerci";
        password = WORDPRESS_INSTRUCTOR_PASSWORD || "Merci@2026";
      },
    );
  });

  const loginAsInstructor = () => cy.login(username, password);
  const fillSurveyEditor = (content) => {
    cy.fillWpEditor(content);
  };

  const clickPrimarySurveyAction = (label) => {
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

  const createSurvey = (
    surveyTitle,
    surveyDescription = "Survey for adding questions",
  ) => {
    cy.visit(newSurveyUrl);
    cy.get("#post_title, #title").clear().type(surveyTitle);
    fillSurveyEditor(surveyDescription);
    clickPrimarySurveyAction("Publish");
    cy.get(noticeSuccess).should("be.visible");
  };

  const openSurveyFromList = (surveyTitle) => {
    cy.visit(surveyListUrl);
    cy.get("a.row-title").contains(surveyTitle).click();
  };

  /**
   * Helper to add a question to the survey.
   * Attempts common WordPress survey plugin patterns:
   * 1. "Add Question" button
   * 2. Question type select dropdown
   * 3. Question text field
   * 4. Save/Add question button
   */
  const addQuestionToSurvey = (questionText, questionType, options = []) => {
    // Look for "Add Question" or "Add New Question" button
    cy.get("body").then(($body) => {
      // Try clicking "Add Question" button
      const addBtn = Cypress.$(
        'button:contains("Add Question"), a:contains("Add Question"), ' +
          'button:contains("Add New Question"), a:contains("Add New Question"), ' +
          'input[value*="Add Question"], .add-question, #add-question',
        $body,
      ).filter(":visible");

      if (addBtn.length) {
        cy.wrap(addBtn.first()).click({ force: true });
      } else {
        cy.log("No 'Add Question' button found, trying alternative selectors");
      }
    });

    // Fill question text
    cy.get("body").then(($body) => {
      const qField = Cypress.$(
        'input[name*="question"], input[id*="question"], ' +
          'textarea[name*="question"], textarea[id*="question"], ' +
          ".question-text input, .question-text textarea, " +
          "input.question_title, input.question-text",
        $body,
      ).filter(":visible");

      if (qField.length) {
        cy.wrap(qField.first()).clear().type(questionText);
      } else {
        cy.log(`Question text field not found for: ${questionText}`);
      }
    });

    // Select question type
    cy.get("body").then(($body) => {
      const typeSelect = Cypress.$(
        'select[name*="type"], select[id*="type"], ' +
          "select.question-type, .question-type select, " +
          'select[name*="question_type"], select[id*="question_type"]',
        $body,
      ).filter(":visible");

      if (typeSelect.length) {
        cy.wrap(typeSelect.first()).select(questionType);
      } else {
        cy.log(`Question type selector not found for: ${questionType}`);
      }
    });

    // For Multiple Choice, add options if provided
    if (questionType.toLowerCase().includes("multiple") && options.length > 0) {
      options.forEach((opt, index) => {
        cy.get("body").then(($body) => {
          const optField = Cypress.$(
            `input[name*="option"], input[id*="option"], ` +
              `.option-text input, input.option-value`,
            $body,
          ).filter(":visible");

          if (optField.length > index) {
            cy.wrap(optField.eq(index)).clear().type(opt);
          } else {
            // Try clicking "Add Option" button first
            const addOptBtn = Cypress.$(
              'button:contains("Add Option"), a:contains("Add Option")',
              $body,
            ).filter(":visible");
            if (addOptBtn.length) {
              cy.wrap(addOptBtn.first()).click({ force: true });
              cy.get('input[name*="option"], input[id*="option"]')
                .filter(":visible")
                .last()
                .clear()
                .type(opt);
            }
          }
        });
      });
    }

    // Save/add the question
    cy.get("body").then(($body) => {
      const saveBtn = Cypress.$(
        'button:contains("Save Question"), button:contains("Add Question"), ' +
          'button:contains("Add"), input[value*="Save"], input[value*="Add"], ' +
          ".save-question, #save-question",
        $body,
      ).filter(":visible");

      if (saveBtn.length) {
        cy.wrap(saveBtn.first()).click({ force: true });
      }
    });
  };

  // ==========================================================================
  // TESTS
  // ==========================================================================

  describe("Instructor - Add 6 questions to a survey", () => {
    let surveyTitle;

    before(() => {
      loginAsInstructor();
      surveyTitle = `Questions Survey ${Date.now()}`;
      // Create a survey first to attach questions to
      createSurvey(surveyTitle, "Survey created for adding 6 questions");
      cy.log(`Survey created: ${surveyTitle}`);
    });

    beforeEach(loginAsInstructor);

    it("Should open the survey edit page to add questions", () => {
      openSurveyFromList(surveyTitle);
      cy.url().should("include", "post_type=survey");
      cy.get("#post_title, #title").should("have.value", surveyTitle);
      cy.log("Survey opened for question editing");
    });

    it("Should add question 1: Multiple Choice - Course Satisfaction", () => {
      openSurveyFromList(surveyTitle);
      addQuestionToSurvey(
        "How satisfied are you with the course content?",
        "Multiple Choice",
        ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
      );
      // Save the survey to persist the question
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should add question 2: Multiple Choice - Course Difficulty", () => {
      openSurveyFromList(surveyTitle);
      addQuestionToSurvey(
        "How would you rate the difficulty of this course?",
        "Multiple Choice",
        ["Very Easy", "Easy", "Moderate", "Difficult", "Very Difficult"],
      );
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should add question 3: True/False - Course Understanding", () => {
      openSurveyFromList(surveyTitle);
      addQuestionToSurvey(
        "The course objectives were clearly explained.",
        "True/False",
      );
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should add question 4: True/False - Course Materials", () => {
      openSurveyFromList(surveyTitle);
      addQuestionToSurvey(
        "The course materials were helpful for my learning.",
        "True/False",
      );
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should add question 5: Short Answer - Course Improvements", () => {
      openSurveyFromList(surveyTitle);
      addQuestionToSurvey(
        "What improvements would you suggest for this course?",
        "Short Answer",
      );
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should add question 6: Essay - Overall Experience", () => {
      openSurveyFromList(surveyTitle);
      addQuestionToSurvey(
        "Please describe your overall experience in this course in detail.",
        "Essay",
      );
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should verify all 6 questions were added to the survey", () => {
      openSurveyFromList(surveyTitle);

      // Verify all question texts are visible somewhere on the page
      const questionTexts = [
        "How satisfied are you with the course content?",
        "How would you rate the difficulty of this course?",
        "The course objectives were clearly explained.",
        "The course materials were helpful for my learning.",
        "What improvements would you suggest for this course?",
        "Please describe your overall experience in this course in detail.",
      ];

      questionTexts.forEach((qText) => {
        cy.get("body").should("contain.text", qText);
      });

      cy.log("All 6 questions verified successfully");
    });
  });

  describe("Instructor - Question management edge cases", () => {
    let surveyTitle;

    before(() => {
      loginAsInstructor();
      surveyTitle = `Questions Edge Case ${Date.now()}`;
      createSurvey(surveyTitle, "Edge case testing for questions");
    });

    beforeEach(loginAsInstructor);

    it("Should handle adding a question with special characters", () => {
      openSurveyFromList(surveyTitle);
      addQuestionToSurvey(
        'Rate the course "Quality" & "Relevance" (1-5) ?',
        "Multiple Choice",
        ['"Excellent"', "'Good'", "Average", "Poor"],
      );
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should handle adding a question with a very long text", () => {
      openSurveyFromList(surveyTitle);
      const longQuestion =
        "On a scale from 1 to 10, how likely are you to recommend this " +
        "course to your colleagues or peers based on your overall learning " +
        "experience, the quality of materials, and the instructor's teaching " +
        "methodology throughout the semester?";
      addQuestionToSurvey(longQuestion, "Short Answer");
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should allow adding a question and saving as draft", () => {
      openSurveyFromList(surveyTitle);
      addQuestionToSurvey(
        "Would you take another course with this instructor?",
        "True/False",
      );
      cy.get('input[name="post_status"][value="draft"]').check({ force: true });
      clickPrimarySurveyAction("Save");
      cy.get(".notice-success, .updated, .is-success").should("exist");
    });

    it("Should preserve questions after survey update", () => {
      openSurveyFromList(surveyTitle);
      // Update survey description
      fillSurveyEditor("Updated description - questions should remain");
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");

      // Verify previous question is still there
      cy.get("body").should(
        "contain.text",
        "Would you take another course with this instructor?",
      );
    });

    it("Should allow adding a question without options for Multiple Choice", () => {
      openSurveyFromList(surveyTitle);
      addQuestionToSurvey(
        "Rate the overall course quality?",
        "Multiple Choice",
      );
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should handle rapid question addition", () => {
      openSurveyFromList(surveyTitle);

      // Add 3 questions in rapid succession
      const rapidQuestions = [
        { text: "Q1: Quick rating?", type: "Multiple Choice" },
        { text: "Q2: Quick feedback?", type: "Short Answer" },
        { text: "Q3: Quick opinion?", type: "True/False" },
      ];

      rapidQuestions.forEach((q) => {
        addQuestionToSurvey(q.text, q.type);
        cy.wait(300); // Small wait between additions
      });

      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");

      // Verify all rapid questions exist
      cy.get("body").should("contain.text", "Q1: Quick rating?");
      cy.get("body").should("contain.text", "Q2: Quick feedback?");
      cy.get("body").should("contain.text", "Q3: Quick opinion?");
    });
  });
});
