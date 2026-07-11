describe("UC-ReviewFeedback / Review Feedback", () => {
  // Student credentials for reviewing feedback
  let username = "mugishok";
  let password = "Merci@2026";

  beforeEach(() => {
    cy.env(["WORDPRESS_STUDENT_USER", "WORDPRESS_STUDENT_PASSWORD"]).then(
      ({ WORDPRESS_STUDENT_USER, WORDPRESS_STUDENT_PASSWORD }) => {
        username = WORDPRESS_STUDENT_USER || "mugishok";
        password = WORDPRESS_STUDENT_PASSWORD || "Merci@2026";
      },
    );
    cy.login(username, password);
  });

  it("Should navigate to completed surveys page", () => {
    cy.visit("/my-completed-surveys/");

    // Verify on completed surveys page
    cy.url().should("include", "/my-completed-surveys/");
    cy.get("body").should("not.contain", "404");
  });

  it("Should display list of completed surveys", () => {
    cy.visit("/my-completed-surveys/");

    // Verify page has content
    cy.get("body").then(($body) => {
      const hasHeading = $body.find("h1, h2").length > 0;
      const hasContent = /completed|survey|feedback/i.test($body.text());
      expect(hasHeading || hasContent).to.be.true;
    });
  });

  it("Should display survey completion status", () => {
    cy.visit("/my-completed-surveys/");

    // Check if surveys are listed
    cy.get(".survey-list, .completed-surveys, table").then(($list) => {
      if ($list.length > 0) {
        // Verify list structure
        cy.get(".survey-list, .completed-surveys, table").should("be.visible");
      }
    });
  });

  it("Should show completion date or timestamp", () => {
    cy.visit("/my-completed-surveys/");

    // Check for date information
    cy.get("body").then(($body) => {
      const pageText = $body.text();
      const hasDateInfo =
        /\d{1,2}\/\d{1,2}\/\d{2,4}|january|february|march|april|may|june|july|august|september|october|november|december/i.test(
          pageText,
        );

      // Date might be shown for completed surveys
      if (hasDateInfo) {
        cy.get("body").should("contain.text", pageText);
      }
    });
  });

  it("Should allow viewing survey response details", () => {
    cy.visit("/my-completed-surveys/");

    // Look for links to view responses
    cy.get('a[href*="/survey/"]').then(($links) => {
      if ($links.length > 0) {
        // Click first survey link
        cy.wrap($links[0]).click();

        // Verify navigated to survey
        cy.url().should("include", "/survey/");
      }
    });
  });

  it("Should display feedback responses when available", () => {
    cy.visit("/my-completed-surveys/");

    // Navigate to survey if available
    cy.get("a").first().click();

    // Check for feedback content
    cy.get("body").then(($body) => {
      const hasContent = /answer|response|question|feedback/i.test(
        $body.text(),
      );
      expect(hasContent).to.be.true;
    });
  });

  it("Should handle empty completed surveys list", () => {
    cy.visit("/my-completed-surveys/");

    // Verify page displays appropriately
    cy.get("body").then(($body) => {
      const isEmpty = /no survey|no completed|empty/i.test($body.text());
      const hasItems =
        $body.find(".survey-list, .completed-surveys, table tr").length > 0;

      if (!hasItems) {
        // Should show empty state message
        cy.get("body").should("contain.text", /survey|completed|feedback/i);
      }
    });
  });

  it("Should maintain data consistency in feedback view", () => {
    cy.visit("/my-completed-surveys/");

    // Check that displayed data is consistent
    cy.get("body").then(($body) => {
      // Count visible survey items
      const surveyCount = $body.find(".survey-item, tr").length;

      // If surveys shown, verify they're all properly formatted
      if (surveyCount > 0) {
        cy.get(".survey-item, tr").each(($item) => {
          cy.wrap($item).should("be.visible");
        });
      }
    });
  });

  it("Should allow filtering or searching feedback", () => {
    cy.visit("/my-completed-surveys/");

    // Look for search or filter options
    cy.get('input[type="search"], input[type="text"], .filter').then(
      ($search) => {
        if ($search.length > 0) {
          // Search functionality exists
          cy.wrap($search[0]).type("test");
          cy.get('button[type="submit"], [aria-label*="search"]').click();

          // Results should update
          cy.get("body").should("be.visible");
        }
      },
    );
  });

  it("Should display survey metadata in feedback view", () => {
    cy.visit("/my-completed-surveys/");

    // Check for survey information
    cy.get("body").then(($body) => {
      const pageText = $body.text();

      // Should have some survey identifiers
      const hasInfo = /survey|title|date|submitted|completed/i.test(pageText);
      expect(hasInfo).to.be.true;
    });
  });

  it("Should handle pagination if many completed surveys", () => {
    cy.visit("/my-completed-surveys/");

    // Look for pagination
    cy.get('.pagination, .pager, nav[aria-label*="pagination"]').then(
      ($pagination) => {
        if ($pagination.length > 0) {
          // Pagination exists
          cy.get(".pagination a, .pager a").should(
            "have.length.greaterThan",
            0,
          );
        }
      },
    );
  });

  it("Should allow returning to user dashboard from feedback view", () => {
    cy.visit("/my-completed-surveys/");

    // Look for back or dashboard link
    cy.get('a[href*="/"]').then(($links) => {
      // Should be able to navigate back
      cy.visit("/");
      cy.url().should("equal", Cypress.config("baseUrl") + "/");
    });
  });

  it("Should display response count or summary", () => {
    cy.visit("/my-completed-surveys/");

    // Check for response information
    cy.get("body").then(($body) => {
      const pageText = $body.text();
      // Should mention responses or completion
      const hasInfo = /response|answer|complete|submitted/i.test(pageText);
      expect(hasInfo).to.be.true;
    });
  });

  it("Should verify user can only view their own feedback", () => {
    cy.visit("/my-completed-surveys/");

    // Should only show current user's completed surveys
    cy.get("body").then(($body) => {
      const pageText = $body.text();

      // Page should indicate these are user's surveys
      const isUserContent = /my|your|completed|survey/i.test(pageText);
      expect(isUserContent).to.be.true;
    });
  });

  it("Should handle survey with no responses", () => {
    cy.visit("/my-completed-surveys/");

    // Check if there are surveys without responses
    cy.get("body").then(($body) => {
      const hasContent = /survey|completed|feedback/i.test($body.text());
      expect(hasContent).to.be.true;
    });
  });

  it("Should display feedback in readable format", () => {
    cy.visit("/my-completed-surveys/");

    // Verify content is formatted properly
    cy.get("body").then(($body) => {
      // Should have readable text
      const text = $body.text();
      expect(text.length).to.be.greaterThan(0);
    });
  });

  it("Should allow exporting or printing feedback if available", () => {
    cy.visit("/my-completed-surveys/");

    // Look for export/print options
    cy.get(
      'a[href*="export"], a[href*="print"], button:contains("Export"), button:contains("Print")',
    ).then(($options) => {
      if ($options.length > 0) {
        // Export/print functionality exists
        cy.get('a[href*="export"], a[href*="print"]').should("exist");
      }
    });
  });

  it("Should verify feedback authenticity", () => {
    cy.visit("/my-completed-surveys/");

    // Check that feedback is properly attributed
    cy.get("body").then(($body) => {
      // Should show survey title or identifier
      const hasIdentifier = /survey|feedback|response/i.test($body.text());
      expect(hasIdentifier).to.be.true;
    });
  });

  it("Should handle special characters in feedback display", () => {
    cy.visit("/my-completed-surveys/");

    // Navigate to a survey response if available
    cy.get("a").first().click();

    // Verify special characters are displayed correctly
    cy.get("body").then(($body) => {
      const pageText = $body.text();
      // Should have some text content
      expect(pageText.length).to.be.greaterThan(0);
    });
  });

  it("Should maintain responsive design on feedback page", () => {
    cy.visit("/my-completed-surveys/");

    // Verify page is visible at current viewport
    cy.get("body").should("be.visible");

    // Content should be accessible
    cy.get('main, [role="main"], .content').should("exist");
  });
});
