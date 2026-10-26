/// <reference types="cypress" />

export class LoginPage {
  readonly url = '/';
  readonly username = '[data-test="username"]';
  readonly password = '[data-test="password"]';
  readonly loginButton = '[data-test="login-button"]';
  readonly errorMessage = '[data-test="error"]';

  visit() {
    cy.visit(this.url);
    return this;
  }

  fillUsername(username: string) {
    cy.get(this.username).clear().type(username);
    return this;
  }

  fillPassword(password: string) {
    cy.get(this.password).clear().type(password);
    return this;
  }

  clickLogin() {
    cy.get(this.loginButton).click();
    return this;
  }

  login(username: string, password: string) {
    return this.fillUsername(username).fillPassword(password).clickLogin();
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