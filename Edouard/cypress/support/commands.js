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