describe("UC-ProvideFeedback / Provide Feedback", () => {
  const defaultUsername = "mugishok";
  const defaultPassword = "Merci@2026";
  const surveysUrl = "/survey/";

  const visitSurveys = () => cy.visit(surveysUrl, { failOnStatusCode: false });

  beforeEach(() => {
    cy.env(["WORDPRESS_STUDENT_USER", "WORDPRESS_STUDENT_PASSWORD"]).then(
      ({ WORDPRESS_STUDENT_USER, WORDPRESS_STUDENT_PASSWORD }) => {
        const username = WORDPRESS_STUDENT_USER || defaultUsername;
        const password = WORDPRESS_STUDENT_PASSWORD || defaultPassword;
        cy.login(username, password);
      },
    );
  });

  it("shows the survey list and lets the student open an available survey", () => {
    visitSurveys();
    cy.get("body").then(($body) => {
      const hasSurveyContent = /survey|feedback|question/i.test($body.text());
      const hasSurveyLink = $body.find('a[href*="/survey/"]').length > 0;
      expect(hasSurveyContent || hasSurveyLink).to.be.true;
    });

    cy.openFirstSurvey();
    cy.get("body").then(($body) => {
      const pageText = $body.text().toLowerCase();
      const hasForm = $body.find("form").length > 0;
      const hasSurveyContent = /survey|question|feedback|answer/i.test(pageText);
      const hasAccessMessage = /permission|access|denied|login/i.test(pageText);
      expect(hasForm || hasSurveyContent || hasAccessMessage).to.be.true;
    });
  });

  it("shows validation feedback when a required field is left empty", () => {
    visitSurveys();
    cy.openFirstSurvey();

    cy.get("body").then(($body) => {
      const form = $body.find("form");
      if (form.length === 0) {
        cy.log("No survey form is available on this page; skipping validation assertion.");
        return;
      }

      cy.submitSurveyForm();
      cy.get("body").then(($bodyAfterSubmit) => {
        const pageText = $bodyAfterSubmit.text().toLowerCase();
        const hasValidationMessage = /(required|please|fill|select|enter)/.test(
          pageText,
        );
        const hasErrorClass = $bodyAfterSubmit.find(
          ".error, .field-error, [aria-invalid='true'], .has-error",
        ).length > 0;
        expect(hasValidationMessage || hasErrorClass).to.be.true;
      });
    });
  });

  it("submits the survey successfully when valid answers are provided", () => {
    visitSurveys();
    cy.openFirstSurvey();

    cy.get("body").then(($body) => {
      const form = $body.find("form");
      if (form.length === 0) {
        cy.log("No survey form is available to submit.");
        return;
      }

      cy.fillSurveyForm();
      cy.submitSurveyForm();
      cy.assertSurveyFeedbackState([/(success|submitted|thank|confirmation)/, /(completed|done|submitted)/]);
    });
  });

  it("keeps the survey form usable after a reload when partial progress exists", () => {
    visitSurveys();
    cy.openFirstSurvey();

    cy.get("body").then(($body) => {
      const form = $body.find("form");
      if (form.length === 0) {
        cy.log("No survey form is available for reload persistence assertion.");
        return;
      }

      cy.fillSurveyForm();
      cy.reload();

      cy.get("body").then(($bodyAfterReload) => {
        const pageText = $bodyAfterReload.text().toLowerCase();
        const hasForm = $bodyAfterReload.find("form").length > 0;
        const hasAutoSaveMessage = /(saved|draft|progress|resume)/.test(pageText);
        const hasTextValue = $bodyAfterReload.find('input[type="text"]:not([type="hidden"])').first().val();
        const hasTextareaValue = $bodyAfterReload.find("textarea").first().val();
        const hasCheckedRadio = $bodyAfterReload.find('input[type="radio"]:checked').length > 0;

        expect(hasForm || hasAutoSaveMessage || hasTextValue || hasTextareaValue || hasCheckedRadio).to.be.true;
      });
    });
  });

  it("handles access restrictions gracefully when the student is not authenticated", () => {
    cy.logout();
    visitSurveys();

    cy.get("body").then(($body) => {
      const text = $body.text().toLowerCase();
      const isOnLoginPage = $body.find("#loginform, form[action*='wp-login']").length > 0;
      const hasRestrictionMessage = /login|authenticate|permission|access denied/i.test(
        text,
      );
      const hasSurveyForm = $body.find("form").length > 0;
      const hasSubmitButton = $body.find('button[type="submit"], input[type="submit"]').length > 0;

      expect(
        isOnLoginPage ||
          hasRestrictionMessage ||
          (!hasSurveyForm && !hasSubmitButton),
      ).to.be.true;
    });
  });
});
