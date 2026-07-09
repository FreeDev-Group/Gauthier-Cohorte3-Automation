class LoginPage {
  visit() {
    cy.visit("https://student.michaelkentburns.com/wp-login.php");
  }

  fillUsername(username) {
    cy.get("#user_login").clear().type(username);
  }

  fillPassword(password) {
    cy.get("#user_pass").clear().type(password);
  }

  submit() {
    cy.get("#wp-submit").click();
  }

  login(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.submit();
  }
}

export default new LoginPage();