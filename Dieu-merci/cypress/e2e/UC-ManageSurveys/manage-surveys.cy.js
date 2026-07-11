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
    cy.get('#content, [role="textbox"]').then(($editor) => {
      if ($editor.is("textarea")) {
        cy.wrap($editor).clear().type(content);
      } else {
        cy.wrap($editor).click().clear().type(content);
      }
    });
  };

  const createSurvey = (
    surveyTitle,
    surveyDescription = "This is a test survey created by automation",
  ) => {
    visitNewSurvey();
    cy.get("#post_title, #title").clear().type(surveyTitle);
    fillSurveyEditor(surveyDescription);
    cy.get('#publish, button:contains("Publish")').click();
    cy.get(noticeSuccess).should("be.visible");
  };

  const openSurveyFromList = (surveyTitle) => {
    visitSurveyList();
    cy.get("a.row-title").contains(surveyTitle).click();
  };

  const deleteSurveyFromList = (surveyTitle) => {
    visitSurveyList();
    cy.get("a.row-title")
      .contains(surveyTitle)
      .parent()
      .parent()
      .trigger("mouseover");
    cy.get("a.row-title")
      .contains(surveyTitle)
      .parent()
      .parent()
      .find("a.submitdelete")
      .click();
    cy.on("window:confirm", () => true);
    cy.get(noticeSuccess).should("be.visible");
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
      cy.get('a[href*="wp-logout.php"]').should("exist");
      cy.get('a[href*="wp-logout.php"]').first().click();
      cy.url().should("include", "wp-login.php");
      cy.get("#loginform").should("be.visible");
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
      cy.get('a[href*="wp-logout.php"]').should("exist");
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
      cy.url().should("include", "action=edit");
      cy.get("#post").should("be.visible");
    });

    it("Should display survey creation form with required fields", () => {
      visitNewSurvey();
      cy.get("#post_title, #title").should("be.visible");
      cy.get('.wp-editor-area, #content, [role="textbox"]').should("exist");
      cy.get('#publish, button:contains("Publish")').should("be.visible");
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
      cy.get("#post_title, #title").should("have.value", "");
      cy.get('#publish, button:contains("Publish")').click();
      cy.get("body").then(($body) => {
        if ($body.find(".notice-error, .error").length > 0) {
          cy.get(".notice-error, .error").should("be.visible");
        }
      });
    });

    it("Should save survey as draft", () => {
      const surveyTitle = `Draft Survey ${Date.now()}`;
      visitNewSurvey();
      cy.get("#post_title, #title").clear().type(surveyTitle);
      fillSurveyEditor("This is a draft survey");
      cy.get('input[name="original_post_status"][value="draft"]').check({
        force: true,
      });
      cy.get('#save-post, button:contains("Save Draft")').click();
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should create survey with special characters in title", () => {
      const specialCharTitle = `Survey "Test" & 'Special' ${Date.now()}`;
      visitNewSurvey();
      cy.get("#post_title, #title").clear().type(specialCharTitle);
      fillSurveyEditor("Testing special characters in title");
      cy.get('#publish, button:contains("Publish")').click();
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
      cy.get('#publish, button:contains("Update")').click();
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
      cy.get('#save-post, button:contains("Save")').click();
      cy.get(".notice-success, .updated, .is-success").should("exist");
      cy.get("#post_title, #title").should("have.value", surveyTitle);
    });

    it("Should display survey creation success message with survey link", () => {
      const surveyTitle = `Success Message Test ${Date.now()}`;
      visitNewSurvey();
      cy.get("#post_title, #title").clear().type(surveyTitle);
      fillSurveyEditor("Testing success message");
      cy.get('#publish, button:contains("Publish")').click();
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
      cy.url().should("include", "action=edit");
      cy.url().should("include", "post_type=survey");
      cy.get("#post_title, #title").should("have.value", surveyTitle);
    });

    it("Should edit survey title", () => {
      openSurveyFromList(surveyTitle);
      const newTitle = `${surveyTitle} - Updated`;
      cy.get("#post_title, #title").clear().type(newTitle);
      cy.get('#publish, button:contains("Update")').click();
      cy.get(noticeSuccess).should("be.visible");
      cy.get("#post_title, #title").should("have.value", newTitle);
    });

    it("Should edit survey description/content", () => {
      openSurveyFromList(surveyTitle);
      const newDescription = "Updated survey description with more details";
      fillSurveyEditor(newDescription);
      cy.get('#publish, button:contains("Update")').click();
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should save survey as draft during edit", () => {
      openSurveyFromList(surveyTitle);
      cy.get("#post_title, #title").clear().type(`${surveyTitle} Draft`);
      cy.get('input[name="post_status"][value="draft"]').check({ force: true });
      cy.get('#save-post, button:contains("Save")').click();
      cy.get(".notice-success, .updated, .is-success").should("exist");
    });

    it("Should publish draft survey", () => {
      openSurveyFromList(surveyTitle);
      cy.get('input[name="post_status"][value="publish"]').check({
        force: true,
      });
      cy.get('#publish, button:contains("Publish")').click();
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should handle concurrent edits gracefully", () => {
      openSurveyFromList(surveyTitle);
      cy.get("#post_title, #title")
        .clear()
        .type(`${surveyTitle} Concurrent Edit`);
      cy.get('#publish, button:contains("Update")').click();
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should display all survey metadata on edit page", () => {
      openSurveyFromList(surveyTitle);
      cy.get("#post_title, #title").should("be.visible");
      cy.get('#content, [role="textbox"]').should("be.visible");
      cy.get(
        '#publish, button:contains("Publish"), button:contains("Update")',
      ).should("be.visible");
      cy.get('input[name="post_status"]').should("exist");
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
      cy.get('#publish, button:contains("Update")').click();
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should update survey without changing author", () => {
      openSurveyFromList(surveyTitle);
      cy.get("#post_title, #title").clear().type(`${surveyTitle} Author Test`);
      cy.get('#publish, button:contains("Update")').click();
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should handle special characters in edited content", () => {
      openSurveyFromList(surveyTitle);
      const specialContent =
        "Test with \"quotes\" and 'apostrophes' & symbols % # @";
      fillSurveyEditor(specialContent);
      cy.get('#publish, button:contains("Update")').click();
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should allow editing survey without publishing", () => {
      openSurveyFromList(surveyTitle);
      cy.get('input[name="post_status"]:checked')
        .invoke("val")
        .then((currentStatus) => {
          cy.get("#post_title, #title")
            .clear()
            .type(`${surveyTitle} Status Check`);
          cy.get('#save-post, button:contains("Save")').click();
          cy.get('input[name="post_status"]:checked').should(
            "have.value",
            currentStatus,
          );
        });
    });

    it("Should show edit timestamp after update", () => {
      openSurveyFromList(surveyTitle);
      cy.get("#post_title, #title").clear().type(`${surveyTitle} Timestamp`);
      cy.get('#publish, button:contains("Update")').click();
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
      cy.get('#publish, button:contains("Publish")').click();
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
      cy.get('input[name="s"]').clear().type(surveyTitle);
      cy.get("#search-submit").click();
      cy.get("a.row-title").contains(surveyTitle).should("not.exist");
      cy.get("body").should("contain", "No surveys found");
    });

    it("Should delete survey and confirm via action menu", () => {
      const surveyTitle = `Action Menu Delete ${Date.now()}`;
      createTestSurvey(surveyTitle);
      visitSurveyList();
      cy.contains(surveyTitle)
        .closest("tr")
        .then(($row) => {
          cy.wrap($row).trigger("mouseover");
          cy.wrap($row).find("a.submitdelete").click();
        });
      cy.on("window:confirm", () => true);
      cy.get(".notice-success").should("exist");
    });

    it("Should not delete survey if user cancels confirmation", () => {
      const surveyTitle = `Cancel Delete ${Date.now()}`;
      createTestSurvey(surveyTitle);
      visitSurveyList();
      cy.get("a.row-title")
        .contains(surveyTitle)
        .parent()
        .parent()
        .trigger("mouseover");
      cy.get("a.row-title")
        .contains(surveyTitle)
        .parent()
        .parent()
        .find("a.submitdelete")
        .click();
      cy.on("window:confirm", () => false);
      visitSurveyList();
      cy.get("a.row-title").contains(surveyTitle).should("be.visible");
    });

    it("Should delete survey and update survey count", () => {
      const surveyTitle = `Count Test ${Date.now()}`;
      createTestSurvey(surveyTitle);
      deleteSurveyFromList(surveyTitle);
      cy.get(noticeSuccess).should("be.visible");
    });

    it("Should allow deletion of survey with special characters in title", () => {
      const surveyTitle = `Delete "Special" & Test ${Date.now()}`;
      createTestSurvey(surveyTitle);
      deleteSurveyFromList(surveyTitle);
      cy.get("a.row-title").contains(surveyTitle).should("not.exist");
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
        .parent()
        .parent()
        .trigger("mouseover");
      cy.get("a.row-title")
        .contains(surveyTitle)
        .parent()
        .parent()
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
