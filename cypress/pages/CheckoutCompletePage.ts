/// <reference types="cypress" />

export class CheckoutCompletePage {
  readonly url = '/checkout-complete.html';
  readonly completeHeader = '.complete-header, h2.complete-header';
  readonly completeText = '.complete-text, .complete-text p';
  readonly backHomeButton = '[data-test="back-to-home"], #back-to-products, button[data-test="back-to-home"]';

  shouldBeOnCheckoutComplete() {
    cy.url().should('include', '/checkout-complete.html');
    return this;
  }

  shouldShowSuccessMessage() {
    cy.get(this.completeHeader).should('be.visible').and('contain', 'Thank you for your order!');
    return this;
  }

  clickBackHome() {
    cy.get(this.backHomeButton).should('be.visible').click();
    cy.url().should('include', '/inventory.html');
    return this;
  }
}

export const checkoutCompletePage = new CheckoutCompletePage();