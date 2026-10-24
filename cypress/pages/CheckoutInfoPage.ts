import { BasePage } from './BasePage';

export class CheckoutInfoPage extends BasePage {
  private selectors = {
    checkoutInfoContainer: '[data-test="checkout-info-container"]',
    firstName: '[data-test="firstName"]',
    lastName: '[data-test="lastName"]',
    postalCode: '[data-test="postalCode"]',
    continueButton: '[data-test="continue"]',
    cancelButton: '[data-test="cancel"]',
    errorMessage: '[data-test="error"]',
  };

  shouldBeVisible() {
    cy.get(this.selectors.checkoutInfoContainer).should('be.visible');
    return this;
  }

  fillFirstName(firstName: string) {
    cy.get(this.selectors.firstName).clear().type(firstName);
    return this;
  }

  fillLastName(lastName: string) {
    cy.get(this.selectors.lastName).clear().type(lastName);
    return this;
  }

  fillPostalCode(postalCode: string) {
    cy.get(this.selectors.postalCode).clear().type(postalCode);
    return this;
  }

  fillInfo(firstName: string, lastName: string, postalCode: string) {
    this.fillFirstName(firstName);
    this.fillLastName(lastName);
    this.fillPostalCode(postalCode);
    return this;
  }

  continue() {
    cy.get(this.selectors.continueButton).click();
    return this;
  }

  cancel() {
    cy.get(this.selectors.cancelButton).click();
    return this;
  }

  getErrorMessage() {
    return cy.get(this.selectors.errorMessage);
  }

  shouldHaveError(message: string) {
    this.getErrorMessage().should('contain', message);
    return this;
  }

  shouldBeOnCheckoutInfoPage() {
    cy.url().should('include', '/checkout-step-one.html');
    return this;
  }
}
