/// <reference types="cypress" />

export class CheckoutInfoPage {
  readonly url = '/checkout-step-one.html';
  readonly firstName = '[data-test="firstName"]';
  readonly lastName = '[data-test="lastName"]';
  readonly postalCode = '[data-test="postalCode"]';
  readonly continueButton = '[data-test="continue"]';
  readonly cancelButton = '[data-test="cancel"]';
  readonly errorMessage = '[data-test="error"]';

  shouldBeOnCheckoutInfo() {
    cy.url().should('include', '/checkout-step-one.html');
    return this;
  }

  fillFirstName(name: string) {
    cy.get(this.firstName).clear().type(name);
    return this;
  }

  fillLastName(name: string) {
    cy.get(this.lastName).clear().type(name);
    return this;
  }

  fillPostalCode(code: string) {
    cy.get(this.postalCode).clear().type(code);
    return this;
  }

  fillInfo(firstName: string, lastName: string, postalCode: string) {
    return this.fillFirstName(firstName).fillLastName(lastName).fillPostalCode(postalCode);
  }

  clickContinue() {
    cy.get(this.continueButton).click();
    return this;
  }

  clickCancel() {
    cy.get(this.cancelButton).click();
    return this;
  }

  shouldShowError(message: string) {
    cy.get(this.errorMessage).should('be.visible').and('contain', message);
    return this;
  }
}

export const checkoutInfoPage = new CheckoutInfoPage();