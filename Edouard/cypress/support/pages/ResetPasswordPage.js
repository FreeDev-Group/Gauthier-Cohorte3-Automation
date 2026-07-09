class ResetPasswordPage {
  visit() {
    cy.visit("https://student.michaelkentburns.com/wp-login.php?action=lostpassword");
  }

  fillEmail(email) {
    cy.get("#user_login").type(email);
  }

  submit() {
    cy.get("#wp-submit").click();
  }
}

export default new ResetPasswordPage();