class RegisterPage {
  visit() {
    cy.visit("https://student.michaelkentburns.com/wp-login.php?action=register");
  }

  fillUsername(username) {
    cy.get("#user_login").type(username);
  }

  fillEmail(email) {
    cy.get("#user_email").type(email);
  }

  submit() {
    cy.get("#wp-submit").click();
  }
}

export default new RegisterPage();