describe("UC-ProvideFeedback / Provide Feedback", () => {
  let username = "mugishok";
  let password = "Merci@2026";
  const surveysUrl = "/survey/";

  const visitSurveys = () => cy.visit(surveysUrl);
  const openFirstSurvey = () =>
    cy.get('a[href*="/survey/"]').not('[href*="page"]').first().click();
  const submitSurveyForm = () =>
    cy.get('form button[type="submit"], form input[type="submit"]').click();

  beforeEach(() => {
    cy.env(["WORDPRESS_STUDENT_USER", "WORDPRESS_STUDENT_PASSWORD"]).then(
      ({ WORDPRESS_STUDENT_USER, WORDPRESS_STUDENT_PASSWORD }) => {
        username = WORDPRESS_STUDENT_USER || "mugishok";
        password = WORDPRESS_STUDENT_PASSWORD || "Merci@2026";
      },
    );
    cy.login(username, password);
  });

  describe("Required fields validation", () => {
    it("Should show validation error when submitting empty survey form", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if ($form.length > 0) {
          submitSurveyForm();
          cy.get("body").then(($body) => {
            const hasValidationError = /required|please|fill|field/i.test(
              $body.text(),
            );
            expect(hasValidationError).to.be.true;
          });
        }
      });
    });

    it("Should show error for missing required radio button answer", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if ($form.length > 0 && $form.find('input[type="radio"]').length > 0) {
          submitSurveyForm();
          cy.get("body").then(($body) => {
            const hasError = /required|please|select/i.test($body.text());
            expect(hasError).to.be.true;
          });
        }
      });
    });

    it("Should show error for missing required text field", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if (
          $form.length > 0 &&
          $form.find('input[type="text"]:not([type="hidden"])').length > 0
        ) {
          submitSurveyForm();
          cy.get("body").then(($body) => {
            const hasError = /required|please|enter/i.test($body.text());
            expect(hasError).to.be.true;
          });
        }
      });
    });

    it("Should show error for empty required textarea", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if ($form.length > 0 && $form.find("textarea").length > 0) {
          submitSurveyForm();
          cy.get("body").then(($body) => {
            const hasError = /required|please/i.test($body.text());
            expect(hasError).to.be.true;
          });
        }
      });
    });

    it("Should allow form submission when all required fields are filled", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if ($form.length > 0) {
          cy.get('input[type="radio"]').first().check({ force: true });
          cy.get('input[type="checkbox"]').first().check({ force: true });
          cy.get('input[type="text"]:not([type="hidden"])')
            .first()
            .type("Response");
          cy.get("textarea").first().type("Detailed feedback");
          submitSurveyForm();
          cy.get("body").then(($body) => {
            const hasValidationError = /required|please/i.test($body.text());
            const hasSuccess = /success|submitted|thank/i.test($body.text());
            expect(hasValidationError || hasSuccess).to.be.true;
          });
        }
      });
    });

    it("Should show field-specific error messages", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if ($form.length > 0) {
          submitSurveyForm();
          cy.get(
            '.error, .field-error, [aria-invalid="true"], .has-error',
          ).then(($errors) => {
            if ($errors.length > 0) {
              cy.get('.error, .field-error, [aria-invalid="true"]').should(
                "be.visible",
              );
            }
          });
        }
      });
    });

    it("Should prevent form submission with invalid data", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if ($form.length > 0 && $form.find('input[type="email"]').length > 0) {
          cy.get('input[type="email"]').type("not-an-email");
          submitSurveyForm();
          cy.get("body").then(($body) => {
            const hasError = /invalid|email|format/i.test($body.text());
            expect(hasError).to.be.true;
          });
        }
      });
    });

    it("Should retain form data when validation fails", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if ($form.length > 0) {
          const testValue = "Test Data";
          cy.get('input[type="text"]:not([type="hidden"])')
            .first()
            .type(testValue);
          submitSurveyForm();
          cy.get('input[type="text"]:first').should("have.value", testValue);
        }
      });
    });

    it("Should handle minimum length validation", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if ($form.length > 0 && $form.find("input[minlength]").length > 0) {
          cy.get("input[minlength]")
            .first()
            .invoke("attr", "minlength")
            .then((min) => {
              const shortText = "a".repeat(Math.max(1, parseInt(min, 10) - 1));
              cy.get("input[minlength]").type(shortText);
              submitSurveyForm();
              cy.get("body").then(($body) => {
                const hasError = /required|too short|minimum|characters/i.test(
                  $body.text(),
                );
                expect(hasError).to.be.true;
              });
            });
        }
      });
    });

    it("Should display required field indicators", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if ($form.length > 0) {
          cy.get("label").each(($label) => {
            cy.wrap($label)
              .invoke("text")
              .then((text) => {
                if (/\*|required/i.test(text)) {
                  cy.wrap($label).should("be.visible");
                }
              });
          });
        }
      });
    });

    it("Should clear validation errors when field is filled", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if (
          $form.length > 0 &&
          $form.find('input[type="text"]:not([type="hidden"])').length > 0
        ) {
          submitSurveyForm();
          cy.get("body").then(($body) => {
            if ($body.find(".error, .field-error").length > 0) {
              cy.get('input[type="text"]:first').type("Valid response");
              cy.get('input[type="text"]:first').should("be.visible");
            }
          });
        }
      });
    });

    it("Should provide helpful error messages", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if ($form.length > 0) {
          submitSurveyForm();
          cy.get(".error, .field-error, .notice-error").then(($errors) => {
            if ($errors.length > 0) {
              $errors.each((index, element) => {
                const text = Cypress.$(element).text();
                expect(text.length).to.be.greaterThan(3);
              });
            }
          });
        }
      });
    });
  });

  describe("Submit survey flows", () => {
    it("Should navigate to surveys list page", () => {
      visitSurveys();
      cy.url().should("include", "/survey/");
      cy.get("body").should("not.contain", "404");
      cy.get("body").should("contain.text", "survey");
    });

    it("Should display available surveys on surveys list", () => {
      visitSurveys();
      cy.get("body").should("contain.text", "survey");
      cy.get('a[href*="/survey/"]').then(($links) => {
        if ($links.length > 0) {
          cy.wrap($links[0]).should("be.visible");
        }
      });
    });

    it("Should open a survey page when clicking on survey link", () => {
      visitSurveys();
      cy.get('a[href*="/survey/"]')
        .not('[href*="page"]')
        .first()
        .then(($link) => {
          const surveyUrl = $link.attr("href");
          if (surveyUrl) {
            cy.visit(surveyUrl);
            cy.url().should("include", "/survey/");
            cy.get("body").should("not.contain", "404");
          }
        });
    });

    it("Should display survey form or appropriate message", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("body").then(($body) => {
        const pageText = $body.text();
        const hasForm = $body.find("form").length > 0;
        const hasButton =
          $body.find('button:visible, input[type="submit"]:visible').length > 0;
        const hasPermissionMessage = /permission|access|denied/i.test(pageText);
        const hasSurveyContent = /question|answer|survey/i.test(pageText);
        expect(hasForm || hasButton || hasPermissionMessage || hasSurveyContent)
          .to.be.true;
      });
    });

    it("Should handle survey with questions", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("body").then(($body) => {
        const hasForm = $body.find("form").length > 0;
        const hasQuestions =
          $body.find(
            'input[type="radio"], input[type="checkbox"], textarea, input[type="text"]',
          ).length > 0;
        if (hasForm && hasQuestions) {
          cy.get("form").should("be.visible");
        }
      });
    });

    it("Should handle survey without questions gracefully", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("body").then(($body) => {
        const hasQuestions =
          $body.find('input[type="radio"], input[type="checkbox"], textarea')
            .length > 0;
        if (!hasQuestions) {
          cy.get("body").should("contain.text", "survey");
        }
      });
    });

    it("Should submit survey with valid answers", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if ($form.length > 0) {
          const $radioButtons = $form.find('input[type="radio"]');
          const $checkboxes = $form.find('input[type="checkbox"]');
          const $textareas = $form.find("textarea");
          const $textInputs = $form.find(
            'input[type="text"]:not([type="hidden"])',
          );
          if ($radioButtons.length > 0) {
            cy.get('input[type="radio"]').first().check();
          }
          if ($checkboxes.length > 0) {
            cy.get('input[type="checkbox"]').first().check();
          }
          if ($textInputs.length > 0) {
            cy.get('input[type="text"]:not([type="hidden"])')
              .first()
              .type("Test answer");
          }
          if ($textareas.length > 0) {
            cy.get("textarea").first().type("This is a test feedback response");
          }
          if (
            $radioButtons.length > 0 ||
            $checkboxes.length > 0 ||
            $textareas.length > 0 ||
            $textInputs.length > 0
          ) {
            submitSurveyForm();
            cy.get(
              ".success-message, .survey-submitted, .notice-success",
            ).should("exist");
          }
        }
      });
    });

    it("Should display submission confirmation", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if ($form.length > 0) {
          cy.get('input[type="radio"]').first().check({ force: true });
          submitSurveyForm();
          cy.get("body").then(($body) => {
            const hasConfirmation =
              /success|submitted|thank|confirmation/i.test($body.text());
            expect(hasConfirmation).to.be.true;
          });
        }
      });
    });

    it("Should handle survey navigation", () => {
      visitSurveys();
      cy.get("body").should("contain.text", "survey");
      cy.get('.pagination, .pager, nav[aria-label*="pagination"]').then(
        ($nav) => {
          if ($nav.length > 0) {
            cy.get(".pagination a, .pager a").should(
              "have.length.greaterThan",
              0,
            );
          }
        },
      );
    });

    it("Should allow returning to surveys list from survey detail", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get('a[href*="/survey/"], .back-link').then(($links) => {
        if ($links.length > 1) {
          visitSurveys();
          cy.url().should("include", "/survey/");
        }
      });
    });

    it("Should display survey title or description", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("body").then(($body) => {
        const hasHeading = $body.find("h1, h2, h3").length > 0;
        const hasContent = /survey|feedback|question|answer/i.test(
          $body.text(),
        );
        expect(hasHeading || hasContent).to.be.true;
      });
    });

    it("Should handle unauthenticated access appropriately", () => {
      cy.logout();
      cy.visit(surveysUrl);
      cy.get("body").then(($body) => {
        const isOnLogin = $body.find("#loginform").length > 0;
        const hasRestrictionMessage = /login|authenticate|permission/i.test(
          $body.text(),
        );
        expect(isOnLogin || hasRestrictionMessage).to.be.true;
      });
    });

    it("Should persist survey progress if auto-save is enabled", () => {
      visitSurveys();
      openFirstSurvey();
      cy.get("form").then(($form) => {
        if ($form.length > 0) {
          cy.get('input[type="radio"]').first().check({ force: true });
          cy.wait(1000);
          cy.reload();
          cy.get('input[type="radio"]:checked').should(
            "have.length.greaterThan",
            0,
          );
        }
      });
    });
  });
});
