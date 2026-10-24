import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private selectors = {
    username: '[data-test="username"]',
    password: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
    errorButton: '[data-test="error-button"]',
    loginContainer: '[data-test="login-container"]',
  };

  visit() {
    return super.visit('/');
  }

  fillUsername(username: string) {
    cy.get(this.selectors.username).clear().type(username);
    return this;
  }

  fillPassword(password: string) {
    cy.get(this.selectors.password).clear().type(password, { log: false });
    return this;
  }

  clickLogin() {
    cy.get(this.selectors.loginButton).click();
    return this;
  }

  login(username: string, password: string) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLogin();
    return this;
  }

  getErrorMessage() {
    return cy.get(this.selectors.errorMessage);
  }

  dismissError() {
    cy.get(this.selectors.errorButton).click();
    return this;
  }

  shouldBeVisible() {
    cy.get(this.selectors.loginContainer).should('be.visible');
    return this;
  }

  shouldHaveError(message: string) {
    this.getErrorMessage().should('contain', message);
    return this;
  }

  shouldBeOnLoginPage() {
    cy.url().should('eq', this.baseUrl + '/');
    return this;
  }
}
