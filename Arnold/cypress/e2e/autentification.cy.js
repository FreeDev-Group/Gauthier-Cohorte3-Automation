describe("Create an account and connecting with a new user", () => {
  const username = `arnold_${Date.now()}`;
  const password = "password123";

  beforeEach(() => {
    cy.visit("https://demoblaze.com/");
  });

  it("creation de compte utilisateur", () => {
    cy.get("#signin2").click();
    cy.get("#sign-username").type("username", { force: true });
    cy.get("#sign-password").type("password", { force: true });
    cy.get(".btn-primary").contains("Sign up").click();

    cy.on("window:alert", (validerAvecSucces) => {
      expect(validerAvecSucces).to.equal("Sign up successful.");
    });
  });
});
