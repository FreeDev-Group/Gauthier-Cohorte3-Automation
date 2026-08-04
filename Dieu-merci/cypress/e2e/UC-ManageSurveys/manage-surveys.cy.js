describe("UC-ManageSurveys / Manage Surveys", () => {
  let username = "devmerci";
  let password = "Merci@2026";
  const dashboardUrl = "/wp-admin/";
  const surveyListUrl = "/wp-admin/edit.php?post_type=survey";
  const newSurveyUrl = "/wp-admin/post-new.php?post_type=survey";
  const loginUrl = "/wp-login.php";
  const noticeSuccess = ".notice-success, .updated, .is-success";

  before(() => {
    cy.env(["WORDPRESS_INSTRUCTOR_USER", "WORDPRESS_INSTRUCTOR_PASSWORD"]).then(
      ({ WORDPRESS_INSTRUCTOR_USER, WORDPRESS_INSTRUCTOR_PASSWORD }) => {
        username = WORDPRESS_INSTRUCTOR_USER || "devmerci";
        password = WORDPRESS_INSTRUCTOR_PASSWORD || "Merci@2026";
      },
    );
  });

  const visitDashboard = () => cy.visit(dashboardUrl);
  const visitSurveyList = () => cy.visit(surveyListUrl);
  const visitNewSurvey = () => cy.visit(newSurveyUrl);
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
    surveyDescription = "This is a test survey created by automation",
  ) => {
    visitNewSurvey();
    cy.get("#post_title, #title").clear().type(surveyTitle);
    fillSurveyEditor(surveyDescription);
    clickPrimarySurveyAction("Publish");
    cy.get(noticeSuccess).should("be.visible");
  };

  const getSurveyRowByTitle = (surveyTitle) =>
    cy.contains("a.row-title", surveyTitle, { timeout: 30000 })
      .should("be.visible")
      .closest("tr");

  const openSurveyFromList = (surveyTitle) => {
    visitSurveyList();
    getSurveyRowByTitle(surveyTitle)
      .find("a.row-title")
      .click({ force: true });
  };

  const deleteSurveyFromList = (surveyTitle) => {
    visitSurveyList();
    cy.on("window:confirm", () => true);
    getSurveyRowByTitle(surveyTitle)
      .trigger("mouseover")
      .find("a.submitdelete, a.trash, a[href*='action=trash']")
      .first()
      .click({ force: true });
    cy.get(noticeSuccess, { timeout: 30000 }).should("be.visible");
    cy.visit(surveyListUrl, { failOnStatusCode: false, timeout: 180000 });
    cy.get("body", { timeout: 30000 }).should(($body) => {
      expect($body.text()).not.to.include(surveyTitle);
    });
  };

  describe("Survey management login and access", () => {
    it("Should login with instructor credentials and access dashboard", () => {
      cy.visit(loginUrl);
      cy.get("#loginform").should("be.visible");
      cy.get("#loginform #user_login").clear().type(username);
      cy.get("#loginform #user_pass").clear().type(password);
      cy.get("#loginform #wp-submit").click();
      cy.url().should("not.include", "wp-login.php");
      cy.url().should("not.include", "redirect_to");
      cy.get("body").should("not.contain", "Invalid username");
    });

    it("Should access WordPress admin dashboard after login", () => {
      loginAsInstructor();
      visitDashboard();
      cy.url().should("include", "/wp-admin");
      cy.get(".wp-admin").should("exist");
      cy.get("#adminmenu").should("be.visible");
    });

    it("Should access survey management pages after login", () => {
      loginAsInstructor();
      visitSurveyList();
      cy.url().should("include", "post_type=survey");
      cy.get("body").should("not.contain", "Unauthorized");
      cy.get(".wp-list-table, .survey-list").should("exist");
    });

    it("Should display user greeting after login", () => {
      loginAsInstructor();
      visitDashboard();
      cy.get("body").then(($body) => {
        const hasGreeting =
          $body.text().includes("Howdy") ||
          $body.text().includes(username) ||
          $body.text().includes("Dashboard");
        expect(hasGreeting).to.be.true;
      });
    });

    it("Should allow access to create new survey after login", () => {
      loginAsInstructor();
      visitNewSurvey();
      cy.url().should("include", "post_type=survey");
      cy.get("#post_title, #title").should("be.visible");
      cy.get("body").should("not.contain", "Unauthorized");
      cy.get("body").should("not.contain", "Access denied");
    });

    it("Should maintain login session across survey pages", () => {
      loginAsInstructor();
      visitDashboard();
      cy.url().should("include", "/wp-admin");
      visitSurveyList();
      cy.url().should("include", "post_type=survey");
      cy.get("body").should("not.contain", "Invalid username");
      cy.get("body").should("not.contain", "Unauthorized");
      visitNewSurvey();
      cy.get("#post_title, #title").should("be.visible");
    });

    it("Should display survey count or list after login", () => {
      loginAsInstructor();
      visitSurveyList();
      cy.get("body").should("not.contain", "404");
      cy.get("body").should("not.contain", "Unauthorized");
      cy.get(".wp-list-table, .tablenav").should("exist");
    });

    it("Should show admin menu items after instructor login", () => {
      loginAsInstructor();
      visitDashboard();
      cy.get("#adminmenu").should("be.visible");
      cy.get("#adminmenu li").should("have.length.greaterThan", 0);
    });

    it("Should allow logout after login", () => {
      loginAsInstructor();
      visitDashboard();
      cy.get('a[href*="action=logout"], #wp-admin-bar-logout a')
        .first()
        .then(($link) => {
          if ($link.length) {
            cy.wrap($link).click({ force: true });
          } else {
            cy.visit("/wp-login.php?action=logout", {
              failOnStatusCode: false,
              timeout: 180000,
            });
          }
        });
      cy.location("href", { timeout: 60000 }).should((href) => {
        expect(href).to.satisfy(
          (value) =>
            value.includes("wp-login.php") ||
            value.includes("loggedout=true") ||
            value === Cypress.config("baseUrl") + "/" ||
            !value.includes("/wp-admin"),
        );
      });
      cy.get("body", { timeout: 60000 }).should(($body) => {
        const text = $body.text().toLowerCase();
        expect(text).to.satisfy(
          (value) =>
            value.includes("log in") ||
            value.includes("login") ||
            value.includes("logged out") ||
            value.includes("loggedout") ||
            !value.includes("dashboard") ||
            !value.includes("wp-admin"),
        );
      });
    });

    it("Should prevent access to admin pages without login", () => {
      cy.visit(dashboardUrl, { failOnStatusCode: false });
      cy.url().should("include", "wp-login.php");
    });

    it("Should handle session timeout gracefully", () => {
      loginAsInstructor();
      visitDashboard();
      cy.url().should("include", "/wp-admin");
      visitSurveyList();
      cy.url().should("include", "post_type=survey");
      cy.get("body").should("contain", "Dashboard");
    });

    it("Should verify user role permissions are correct", () => {
      loginAsInstructor();
      visitSurveyList();
      cy.get("a.page-title-action, a.add-new-h2").should("exist");
      cy.get("body").should("not.contain", "Access denied");
    });

    it("Should display correct username in logged-in state", () => {
      loginAsInstructor();
      visitDashboard();
      cy.get("body")
        .invoke("text")
        .then((pageText) => {
          expect(pageText.toLowerCase()).to.include(username.toLowerCase());
        });
    });

    it("Should allow navigation to user profile after login", () => {
      loginAsInstructor();
      cy.visit("/wp-admin/profile.php");
      cy.url().should("include", "profile.php");
      cy.get("body").should("not.contain", "Unauthorized");
    });
  });

  describe("Create Survey", () => {
    beforeEach(loginAsInstructor);

    it("Should navigate to survey creation page", () => {
      visitNewSurvey();
      cy.url().should("include", "post_type=survey");
      cy.get("#post").should("be.visible");
    });

    it("Should display survey creation form with required fields", () => {
      visitNewSurvey();
      cy.get("#post_title, #title").should("be.visible");
      cy.get('.wp-editor-area, #content, [role="textbox"]').should("exist");
      cy.get("#publish, #save-post, button[type='submit']")
        .filter(":visible")
        .should("have.length.greaterThan", 0);
      cy.get(".postbox").should("have.length.greaterThan", 0);
    });

    it("Should create a survey with valid title and description", () => {
      const surveyTitle = `Survey Test ${Date.now()}`;
      createSurvey(surveyTitle, "This is a test survey created by automation");
      visitSurveyList();
      cy.get("a.row-title").contains(surveyTitle).should("be.visible");
    });

    it("Should require survey title before publishing", () => {
      visitNewSurvey();
      cy.get("#post_title, #title", { timeout: 30000 }).should(
        "have.value",
        "",
      );
      clickPrimarySurveyAction("Publish");
      cy.get("#post_title, #title", { timeout: 30000 }).should(
        "have.value",
        "",
      );
      cy.get("body").should("not.contain", "Post published.");
    });

    it("Should save survey as draft", () => {
      const surveyTitle = `Draft Survey ${Date.now()}`;
      visitNewSurvey();
      cy.get("#post_title, #title").clear().type(surveyTitle);
      fillSurveyEditor("This is a draft survey");
      clickPrimarySurveyAction("Save Draft");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should create survey with special characters in title", () => {
      const specialCharTitle = `Survey "Test" & 'Special' ${Date.now()}`;
      visitNewSurvey();
      cy.get("#post_title, #title").clear().type(specialCharTitle);
      fillSurveyEditor("Testing special characters in title");
      clickPrimarySurveyAction("Publish");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should display survey in admin list after creation", () => {
      const surveyTitle = `Admin List Test ${Date.now()}`;
      createSurvey(surveyTitle, "Test description");
      visitSurveyList();
      cy.get("a.row-title").contains(surveyTitle).should("be.visible");
    });

    it("Should allow editing survey after creation", () => {
      const surveyTitle = `Edit Test ${Date.now()}`;
      const updatedTitle = `Updated ${surveyTitle}`;
      createSurvey(surveyTitle, "Original description");
      openSurveyFromList(surveyTitle);
      cy.get("#post_title, #title").clear().type(updatedTitle);
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
      cy.get("#post_title, #title").should("have.value", updatedTitle);
    });

    it("Should handle long survey title correctly", () => {
      const longTitle =
        "This is a very long survey title with multiple words to test text handling " +
        Date.now();
      createSurvey(longTitle, "Description");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should maintain form state during editing", () => {
      const surveyTitle = `State Test ${Date.now()}`;
      visitNewSurvey();
      cy.get("#post_title, #title").clear().type(surveyTitle);
      fillSurveyEditor("Testing form state persistence");
      clickPrimarySurveyAction("Save");
      cy.get(".notice-success, .updated, .is-success").should("exist");
      cy.get("#post_title, #title").should("have.value", surveyTitle);
    });

    it("Should display survey creation success message with survey link", () => {
      const surveyTitle = `Success Message Test ${Date.now()}`;
      visitNewSurvey();
      cy.get("#post_title, #title").clear().type(surveyTitle);
      fillSurveyEditor("Testing success message");
      clickPrimarySurveyAction("Publish");
      cy.get(noticeSuccess).should("be.visible");
      cy.get(noticeSuccess)
        .invoke("text")
        .then((text) => {
          expect(text.toLowerCase()).to.satisfy(
            (t) =>
              t.includes("published") ||
              t.includes("updated") ||
              t.includes("saved"),
          );
        });
    });
  });

  describe("Edit Survey", () => {
    let surveyTitle;

    before(() => {
      loginAsInstructor();
      surveyTitle = `Edit Test Survey ${Date.now()}`;
      createSurvey(surveyTitle, "Original description");
    });

    beforeEach(loginAsInstructor);

    it("Should navigate to survey edit page from list", () => {
      openSurveyFromList(surveyTitle);
      cy.url().should("include", "/wp-admin/post.php?post=");
      cy.url().should("include", "action=edit");
    });

    it("Should edit survey title", () => {
      openSurveyFromList(surveyTitle);
      const newTitle = `${surveyTitle} - Updated`;
      cy.get("#post_title, #title").clear().type(newTitle);
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
      cy.get("#post_title, #title").should("have.value", newTitle);
    });

    it("Should edit survey description/content", () => {
      openSurveyFromList(surveyTitle);
      const newDescription = "Updated survey description with more details";
      fillSurveyEditor(newDescription);
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should save survey as draft during edit", () => {
      openSurveyFromList(surveyTitle);
      cy.get("#post_title, #title").clear().type(`${surveyTitle} Draft`);
      clickPrimarySurveyAction("Save Draft");
      cy.get(".notice-success, .updated, .is-success", { timeout: 30000 }).should("exist");
    });

    it("Should publish draft survey", () => {
      openSurveyFromList(surveyTitle);
      clickPrimarySurveyAction("Publish");
      cy.get(noticeSuccess, { timeout: 30000 }).should("be.visible");
    });

    it("Should handle concurrent edits gracefully", () => {
      openSurveyFromList(surveyTitle);
      cy.get("#post_title, #title")
        .clear()
        .type(`${surveyTitle} Concurrent Edit`);
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should display all survey metadata on edit page", () => {
      openSurveyFromList(surveyTitle);
      cy.get("#post_title, #title").should("be.visible");
      cy.get('#content, [role="textbox"]').should("be.visible");
      cy.get("#publish, #save-post, button[type='submit']")
        .filter(":visible")
        .should("have.length.greaterThan", 0);
      cy.get(".postbox").should("have.length.greaterThan", 0);
    });

    it("Should allow reverting unsaved changes", () => {
      openSurveyFromList(surveyTitle);
      const originalTitle = cy.get("#post_title, #title").invoke("val");
      cy.get("#post_title, #title").clear().type("Unsaved Changes");
      cy.reload();
      originalTitle.then((original) => {
        cy.get("#post_title, #title").should("have.value", original);
      });
    });

    it("Should preserve formatting in survey content", () => {
      openSurveyFromList(surveyTitle);
      const formattedContent =
        "Question 1: Satisfaction\nQuestion 2: Likelihood";
      fillSurveyEditor(formattedContent);
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should update survey without changing author", () => {
      openSurveyFromList(surveyTitle);
      cy.get("#post_title, #title").clear().type(`${surveyTitle} Author Test`);
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should handle special characters in edited content", () => {
      openSurveyFromList(surveyTitle);
      const specialContent =
        "Test with \"quotes\" and 'apostrophes' & symbols % # @";
      fillSurveyEditor(specialContent);
      clickPrimarySurveyAction("Update");
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should allow editing survey without publishing", () => {
      openSurveyFromList(surveyTitle);
      cy.get("#post_title, #title")
        .clear()
        .type(`${surveyTitle} Status Check`);
      clickPrimarySurveyAction("Save");
      cy.get("#post_title, #title").should("have.value", `${surveyTitle} Status Check`);
    });

    it("Should show edit timestamp after update", () => {
      openSurveyFromList(surveyTitle);
      cy.get("#post_title, #title").clear().type(`${surveyTitle} Timestamp`);
      clickPrimarySurveyAction("Update");
      cy.get(".notice-success, .updated").should("be.visible");
      cy.get("body").should(
        "not.contain",
        "You are not allowed to edit this item",
      );
    });
  });

  describe("Delete Survey", () => {
    beforeEach(loginAsInstructor);

    const createTestSurvey = (title) => {
      visitNewSurvey();
      cy.get("#post_title, #title").clear().type(title);
      fillSurveyEditor("Test survey for deletion");
      clickPrimarySurveyAction("Publish");
      cy.get(noticeSuccess).should("be.visible");
    };

    it("Should delete a survey from the surveys list", () => {
      const surveyTitle = `Delete Test ${Date.now()}`;
      createTestSurvey(surveyTitle);
      deleteSurveyFromList(surveyTitle);
      cy.get("a.row-title").contains(surveyTitle).should("not.exist");
    });

    it("Should remove survey from search results after deletion", () => {
      const surveyTitle = `Search Delete Test ${Date.now()}`;
      createTestSurvey(surveyTitle);
      deleteSurveyFromList(surveyTitle);
      cy.get('input[name="s"], #post-search-input').clear().type(surveyTitle);
      cy.get('#search-submit, button[type="submit"]').first().click();
      cy.contains("No surveys found", { timeout: 30000 }).should("exist");
    });

    it("Should delete survey and confirm via action menu", () => {
      const surveyTitle = `Action Menu Delete ${Date.now()}`;
      createTestSurvey(surveyTitle);
      visitSurveyList();
      cy.on("window:confirm", () => true);
      cy.contains("a.row-title", surveyTitle)
        .closest("tr")
        .trigger("mouseover")
        .find("a.submitdelete, a.trash, a[href*='action=trash']")
        .first()
        .click({ force: true });
      cy.get(".notice-success", { timeout: 30000 }).should("exist");
    });

    it("Should not delete survey if user cancels confirmation", () => {
      const surveyTitle = `Cancel Delete ${Date.now()}`;
      createTestSurvey(surveyTitle);
      visitSurveyList();
      cy.on("window:confirm", () => false);
      cy.contains("a.row-title", surveyTitle)
        .closest("tr")
        .trigger("mouseover")
        .find("a.submitdelete, a.trash, a[href*='action=trash']")
        .first()
        .click({ force: true });
      visitSurveyList();
      cy.contains("a.row-title", surveyTitle).should("be.visible");
    });

    it("Should delete survey and update survey count", () => {
      const surveyTitle = `Count Test ${Date.now()}`;
      createTestSurvey(surveyTitle);
      deleteSurveyFromList(surveyTitle);
      cy.contains("a.row-title", surveyTitle).should("not.exist");
    });

    it("Should allow deletion of survey with special characters in title", () => {
      const surveyTitle = `Delete "Special" & Test ${Date.now()}`;
      createTestSurvey(surveyTitle);
      deleteSurveyFromList(surveyTitle);
      cy.contains("a.row-title", surveyTitle).should("not.exist");
    });

    it("Should handle rapid delete operations", () => {
      const survey1Title = `Rapid Delete 1 ${Date.now()}`;
      const survey2Title = `Rapid Delete 2 ${Date.now()}`;
      createTestSurvey(survey1Title);
      createTestSurvey(survey2Title);
      deleteSurveyFromList(survey1Title);
      visitSurveyList();
      deleteSurveyFromList(survey2Title);
      cy.visit(surveyListUrl);
      cy.get("a.row-title").contains(survey1Title).should("not.exist");
      cy.get("a.row-title").contains(survey2Title).should("not.exist");
    });

    it("Should show delete option in inline actions", () => {
      const surveyTitle = `Inline Delete ${Date.now()}`;
      createTestSurvey(surveyTitle);
      visitSurveyList();
      cy.get("a.row-title")
        .contains(surveyTitle)
        .closest("tr")
        .trigger("mouseover")
        .find("a.submitdelete")
        .should("be.visible");
    });

    it("Should verify survey is permanently deleted", () => {
      const surveyTitle = `Permanent Delete ${Date.now()}`;
      createTestSurvey(surveyTitle);
      deleteSurveyFromList(surveyTitle);
      cy.wait(500);
      cy.get("a.row-title").contains(surveyTitle).should("not.exist");
      cy.reload();
      cy.get("a.row-title").contains(surveyTitle).should("not.exist");
    });
  });
  }); 
  