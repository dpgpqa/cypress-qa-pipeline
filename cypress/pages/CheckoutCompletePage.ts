/// <reference types="cypress" />

export class CheckoutCompletePage {
  readonly url = '/checkout-complete.html';
  readonly completeHeader = '.complete-header';
  readonly completeText = '.complete-text';
  readonly backHomeButton = '[data-test="back-to-home"]';

  shouldBeOnCheckoutComplete() {
    cy.url().should('include', '/checkout-complete.html');
    return this;
  }

  shouldShowSuccessMessage() {
    cy.get(this.completeHeader).should('contain', 'Thank you for your order!');
    return this;
  }

  clickBackHome() {
    cy.get(this.backHomeButton).click();
    return this;
  }
}

export const checkoutCompletePage = new CheckoutCompletePage();