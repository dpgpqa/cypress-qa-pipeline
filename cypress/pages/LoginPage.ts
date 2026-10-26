/// <reference types="cypress" />

export class LoginPage {
  readonly url = '/';
  readonly username = '[data-test="username"], #user-name, input[name="username"]';
  readonly password = '[data-test="password"], #password, input[name="password"]';
  readonly loginButton = '[data-test="login-button"], #login-button, input[type="submit"]';
  readonly errorMessage = '[data-test="error"], .error-message-container, .error, h3[data-test="error"]';

  visit() {
    cy.visit(this.url);
    return this;
  }

  fillUsername(username: string) {
    cy.get(this.username).should('be.visible').clear().type(username);
    return this;
  }

  fillPassword(password: string) {
    cy.get(this.password).should('be.visible').clear().type(password);
    return this;
  }

  clickLogin() {
    cy.get(this.loginButton).should('be.visible').click();
    return this;
  }

  login(username: string, password: string) {
    return this.fillUsername(username).fillPassword(password).clickLogin();
  }

  loginAndWait(username: string, password: string) {
    this.fillUsername(username).fillPassword(password).clickLogin();
    cy.url().should('include', '/inventory.html');
    return this;
  }

  shouldShowError(message: string) {
    cy.get(this.errorMessage).should('be.visible').and('contain', message);
    return this;
  }

  shouldBeOnInventory() {
    cy.url().should('include', '/inventory.html');
    return this;
  }
}

export const loginPage = new LoginPage();