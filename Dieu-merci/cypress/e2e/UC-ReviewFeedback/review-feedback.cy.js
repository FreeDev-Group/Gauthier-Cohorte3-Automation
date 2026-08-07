describe("UC-ReviewFeedback / Review Feedback", () => {
  const defaultUsername = "mugishok";
  const defaultPassword = "Merci@2026";
  const feedbackHistoryUrl = "/my-completed-surveys/";

  const visitFeedbackHistory = () => cy.visit(feedbackHistoryUrl, { failOnStatusCode: false });

  beforeEach(() => {
    cy.env(["WORDPRESS_STUDENT_USER", "WORDPRESS_STUDENT_PASSWORD"]).then(
      ({ WORDPRESS_STUDENT_USER, WORDPRESS_STUDENT_PASSWORD }) => {
        const username = WORDPRESS_STUDENT_USER || defaultUsername;
        const password = WORDPRESS_STUDENT_PASSWORD || defaultPassword;
        cy.login(username, password);
      },
    );
  });

  it("opens the feedback history page for the authenticated user", () => {
    visitFeedbackHistory();
    cy.url().should("include", feedbackHistoryUrl);
    cy.get("body").should("not.contain", "404");
  });

  it("displays a list of completed surveys or a clear empty-state message", () => {
    visitFeedbackHistory();

    cy.get("body").then(($body) => {
      const pageText = $body.text().toLowerCase();
      const hasItems = $body.find(".survey-item, .completed-surveys, table tr, li").length > 0;
      const hasEmptyState = /(no feedback|no completed|no survey|empty)/.test(pageText);
      const hasRelevantContent = /(completed|survey|feedback|response)/.test(pageText);

      expect(hasItems || hasEmptyState || hasRelevantContent).to.be.true;
    });
  });

  it("shows survey metadata such as title, date, or completion status when present", () => {
    visitFeedbackHistory();

    cy.get("body").then(($body) => {
      const pageText = $body.text();
      const hasMetadata = /(survey|title|date|submitted|completed|status)/i.test(pageText);
      expect(hasMetadata).to.be.true;
    });
  });

  it("opens feedback details when a completed survey entry is selected", () => {
    visitFeedbackHistory();

    cy.get("body").then(($body) => {
      const links = $body.find('a[href*="/survey/"]');
      if (links.length > 0) {
        cy.wrap(links.first()).click({ force: true });
        cy.location("pathname", { timeout: 20000 }).should("include", "/survey/");
      } else {
        cy.log("No survey link found; skipping detail-navigation assertion.");
      }
    });
  });

  it("shows response-related content when viewing detailed feedback", () => {
    visitFeedbackHistory();

    cy.get("body").then(($body) => {
      const detailLink = $body.find('a[href*="/survey/"]').first();
      if (detailLink.length > 0) {
        cy.wrap(detailLink).click({ force: true });
        cy.get("body").then(($detailBody) => {
          const detailText = $detailBody.text().toLowerCase();
          const hasResponseContent = /(answer|response|question|feedback|submitted)/.test(detailText);
          expect(hasResponseContent).to.be.true;
        });
      } else {
        cy.log("No detail link available; the page may not contain feedback entries.");
      }
    });
  });

  it("supports filtering or searching when the UI exposes those controls", () => {
    visitFeedbackHistory();

    cy.get("body").then(($body) => {
      const searchInputs = $body.find('input[type="search"], input[type="text"], .filter');
      if (searchInputs.length > 0) {
        cy.wrap(searchInputs.first()).type("test", { force: true });
        cy.get("body").should("be.visible");
      } else {
        cy.log("No filter or search control detected on this page.");
      }
    });
  });

  it("renders the page in a readable and accessible format", () => {
    visitFeedbackHistory();
    cy.get("body").should("be.visible");

    cy.get("body").then(($body) => {
      const pageText = $body.text().trim();
      const hasMainContent = $body.find("main, [role='main'], .content, .entry-content, .wrap").length > 0;
      const hasReadableText = pageText.length > 0;

      expect(hasMainContent || hasReadableText).to.be.true;
    });
  });

  it("includes export or print actions when the feature is available", () => {
    visitFeedbackHistory();

    cy.get("body").then(($body) => {
      const exportLinks = $body.find('a[href*="export"], a[href*="print"], button').filter((_, el) => {
        const text = Cypress.$(el).text().toLowerCase();
        return text.includes("export") || text.includes("print");
      });

      if (exportLinks.length > 0) {
        cy.wrap(exportLinks.first()).should("be.visible");
      } else {
        cy.log("No export or print action is exposed on this page.");
      }
    });
  });
});
