describe('UC-Login - Student Survey App', () => {

  const url = 'https://student.michaelkentburns.com/wp-login.php'

  it('LG-001 - Should open login page correctly', () => {
    cy.visit(url)

    cy.url().should('include', 'wp-login.php')

    cy.get('#user_login').should('be.visible')
    cy.get('#user_pass').should('be.visible')
    cy.get('#wp-submit').should('be.visible')
  })

})
it('LG-002 - Should block login when fields are empty', () => {

  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  cy.get('#wp-submit').click()

  // WordPress affiche généralement un message d'erreur
  cy.get('#login_error')
    .should('be.visible')

})
it('LG-003 - Should show error when username is empty', () => {

  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  cy.get('#user_pass').type('dummyPassword123')
  cy.get('#wp-submit').click()

  cy.get('#login_error')
    .should('be.visible')

})

it('LG-004 - Should show error when password is empty', () => {

  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  cy.get('#user_login').type('Bag3')
  cy.get('#wp-submit').click()

  cy.get('#login_error')
    .should('be.visible')

})

it('LG-005 - Should reject invalid credentials', () => {

  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  cy.get('#user_login').type('WrongUser123')
  cy.get('#user_pass').type('WrongPassword123')
  cy.get('#wp-submit').click()

  cy.get('#login_error')
    .should('be.visible')
    .and('contain', 'incorrect')

})

it('LG-006 - Should login successfully with valid credentials', () => {

  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  cy.get('#user_login').type('Bag3')
  cy.get('#user_pass').type('kiza2001@')

  cy.get('#wp-submit').click()

  // Vérification post-login
  cy.url().should('not.include', 'wp-login.php')

})

it('LG-007 - Should logout successfully and destroy session', () => {

  // 1. Login d'abord
  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  cy.get('#user_login').type('Bag3')
  cy.get('#user_pass').type('kiza2001@')
  cy.get('#wp-submit').click()

  // 2. Vérifier qu’on est connecté
  cy.url().should('not.include', 'wp-login.php')

  // 3. Aller sur logout
  cy.visit('https://student.michaelkentburns.com/wp-login.php?action=logout')

  // 4. Confirmer retour page login
  cy.url().should('include', 'wp-login.php')

})

it('LG-008 - Should not access dashboard after logout', () => {

  // 1. Login
  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  cy.get('#user_login').type('Bag3')
  cy.get('#user_pass').type('kiza2001@')
  cy.get('#wp-submit').click()

  // 2. Vérifier login réussi
  cy.url().should('not.include', 'wp-login.php')

  // 3. Logout
  cy.visit('https://student.michaelkentburns.com/wp-login.php?action=logout')

  // 4. Essayer d’accéder à une page protégée (dashboard)
  cy.visit('https://student.michaelkentburns.com/wp-admin')

  // 5. Vérifier qu’on est redirigé vers login
  cy.url().should('include', 'wp-login.php')

})

it('LG-009 - Should handle multiple failed login attempts', () => {

  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  const fakePassword = 'wrong_password'

  for (let i = 0; i < 5; i++) {

    cy.get('#user_login').clear().type('Bag3')
    cy.get('#user_pass').clear().type(fakePassword)
    cy.get('#wp-submit').click()

    // Vérifier message d’erreur WordPress
    cy.get('#login_error')
      .should('be.visible')
  }

})

describe("LG-008 - Invalid login shows error message", () => {

  beforeEach(() => {
    cy.visit("https://student.michaelkentburns.com/wp-login.php");
  });

  it("should display error message for invalid credentials", () => {

    // Saisie credentials invalides
    cy.get("#user_login").type("wrongUser");
    cy.get("#user_pass").type("wrongPassword");

    // Submit login
    cy.get("#wp-submit").click();

    // Vérification message erreur (à adapter selon le vrai UI)
    cy.get("#login_error").should("be.visible");

  });

});

it('LG-010 - Should access forgot password flow', () => {

  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  // Clique sur "Forgot password?"
  cy.contains('Lost your password?').click()

  // Vérifie redirection page reset
  cy.url().should('include', 'lostpassword')

  // Vérifie champ email
  cy.get('#user_login').should('be.visible')

})


it('LG-011 - Should check case sensitivity of username', () => {

  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  cy.get('#user_login').type('bag3') // lowercase version
  cy.get('#user_pass').type('kiza2001@')
  cy.get('#wp-submit').click()

  // comportement attendu : soit succès soit erreur (on vérifie pas URL login)
  cy.url().should('not.include', 'wp-login.php')

})

it('LG-012 - Should handle empty spaces in credentials', () => {

  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  cy.get('#user_login').type('   ')
  cy.get('#user_pass').type('   ')
  cy.get('#wp-submit').click()

  cy.get('#login_error').should('be.visible')

})

it('LG-013 - Should maintain session after page refresh', () => {

  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  cy.get('#user_login').type('Bag3')
  cy.get('#user_pass').type('kiza2001@')
  cy.get('#wp-submit').click()

  cy.url().should('not.include', 'wp-login.php')

  // refresh page
  cy.reload()

  cy.url().should('not.include', 'wp-login.php')

})

it('LG-014 - Should block access to admin without login', () => {

  cy.visit('https://student.michaelkentburns.com/wp-admin')

  cy.url().should('include', 'wp-login.php')

})

it('LG-015 - Should invalidate session after logout', () => {

  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  cy.get('#user_login').type('Bag3')
  cy.get('#user_pass').type('kiza2001@')
  cy.get('#wp-submit').click()

  cy.visit('https://student.michaelkentburns.com/wp-login.php?action=logout')

  cy.visit('https://student.michaelkentburns.com/wp-admin')

  cy.url().should('include', 'wp-login.php')

})

it('LG-016 - Should reset login form on reload', () => {

  cy.visit('https://student.michaelkentburns.com/wp-login.php')

  cy.get('#user_login').type('testUser')
  cy.get('#user_pass').type('testPass')

  cy.reload()

  cy.get('#user_login').should('have.value', '')
  cy.get('#user_pass').should('have.value', '')

})