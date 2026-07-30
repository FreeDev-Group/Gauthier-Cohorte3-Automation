// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add("resetPassword", (user) => {
  cy.visit("https://student.michaelkentburns.com/wp-login.php?action=lostpassword");
  cy.get("#user_login").type(user);
  cy.get("#wp-submit").click();
});


Cypress.Commands.add('loginAsStudent', () => {

  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  cy.get('#user_login')
    .should('be.visible')
    .clear()
    .click()
    .invoke('val', 'Bag3')
    .trigger('input')
    .should('have.value', 'Bag3')

  cy.get('#user_pass')
    .should('be.visible')
    .clear()
    .click()
    .invoke('val', 'kiza2001@')
    .trigger('input')

  cy.get('#wp-submit')
    .should('be.enabled')
    .click()

  cy.url({ timeout: 15000 })
    .should('not.include', 'wp-login.php')

})

Cypress.Commands.add('openSurveyByName', (surveyName) => {

  cy.contains('All Surveys')
    .should('be.visible')
    .click()

  function searchSurvey() {

    cy.get('body').then(($body) => {

      if ($body.text().includes(surveyName)) {

        cy.contains('a', surveyName)
          .scrollIntoView()
          .should('be.visible')
          .click()

      } else {

        cy.contains('Next Page')
          .scrollIntoView()
          .should('be.visible')
          .click()

        cy.url().should('include', '/survey')

        cy.wait(1000)

        searchSurvey()

      }

    })

  }

  searchSurvey()

})

// ======================================================
// LOGIN AS INSTRUCTOR
// ======================================================

Cypress.Commands.add("loginAsInstructor", () => {

    cy.session("InstructorSession", () => {

        cy.visit(
            "https://student.michaelkentburns.com/wp-login.php"
        );


        cy.get("#user_login", { timeout: 15000 })
            .should("be.visible")
            .click()
            .clear()
            .type("EdouardK", { delay: 150 })
            .should("have.value", "EdouardK");


        cy.get("#user_pass")
            .should("be.visible")
            .click()
            .clear()
            .type("Kiza2001@", { delay: 150 })
            .should("have.value", "Kiza2001@");


        cy.get("#wp-submit")
            .should("be.enabled")
            .click();


        cy.url({ timeout: 30000 })
            .should("include", "/wp-admin/");


        cy.contains("Dashboard")
            .should("be.visible");

    });


    // Après restauration de session
    cy.visit(
        "https://student.michaelkentburns.com/wp-admin/"
    );


    cy.url()
        .should("include", "/wp-admin/");


    cy.contains("Dashboard")
        .should("be.visible");

});


// ======================================================
// OPEN SURVEYS PAGE
// ======================================================

Cypress.Commands.add("openSurveyPage", () => {

    cy.contains("Surveys")
        .should("be.visible")
        .click();

    cy.url().should("include", "survey");

});


// ======================================================
// OPEN CREATE SURVEY PAGE
// ======================================================

Cypress.Commands.add("openCreateSurvey", () => {

    cy.contains("Add New Survey")
        .should("be.visible")
        .click();

    cy.contains("Add New Survey")
        .should("be.visible");

});

// ======================================================
// OPEN SURVEY MANAGEMENT
// ======================================================

Cypress.Commands.add("openSurveyManagement", () => {

    cy.visit("https://student.michaelkentburns.com/wp-admin/edit.php?post_type=survey");

    cy.contains("Surveys")
        .should("be.visible");

});



// ======================================================
// OPEN QUESTIONS PAGE
// ======================================================

Cypress.Commands.add("openQuestionManagement", () => {

    cy.contains("Questions")
        .should("be.visible")
        .click();


    cy.url()
        .should("include","post_type=question");

});




// ======================================================
// OPEN CREATE QUESTION PAGE
// ======================================================

Cypress.Commands.add("openCreateQuestion", () => {


    cy.contains("Add New Question")
        .should("be.visible")
        .click();


    cy.contains("Add New Question")
        .should("be.visible");


});


// ======================================================
// SELECT SURVEY IN QUESTION FORM
// ======================================================

Cypress.Commands.add("selectSurvey", (surveyName) => {

    cy.contains("Associated Survey")
        .parent()
        .click();


    function searchSurvey() {

        cy.get("body").then(($body) => {


            if ($body.text().includes(surveyName)) {


                cy.contains(surveyName)
                    .scrollIntoView()
                    .click();


            } else {


                // Scroll inside dropdown/list
                cy.contains("Associated Survey")
                    .parent()
                    .scrollTo("bottom");


                cy.wait(1000);


                searchSurvey();

            }


        });

    }


    searchSurvey();

});


// ======================================================
// SELECT QUESTION TYPE
// ======================================================

Cypress.Commands.add("selectQuestionType", (questionType) => {

    cy.contains("Question Type")
        .parent()
        .click();

    cy.contains(questionType)
        .scrollIntoView()
        .click();

});