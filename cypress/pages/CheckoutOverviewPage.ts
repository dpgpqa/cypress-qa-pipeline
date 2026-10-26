/// <reference types="cypress" />

export class CheckoutOverviewPage {
  readonly url = '/checkout-step-two.html';
  readonly cartItems = '[data-test="inventory-item"]';
  readonly itemNames = '.inventory_item_name';
  readonly itemPrices = '.inventory_item_price';
  readonly subtotalLabel = '[data-test="subtotal-label"]';
  readonly taxLabel = '[data-test="tax-label"]';
  readonly totalLabel = '[data-test="total-label"]';
  readonly finishButton = '[data-test="finish"]';
  readonly cancelButton = '[data-test="cancel"]';

  shouldBeOnCheckoutOverview() {
    cy.url().should('include', '/checkout-step-two.html');
    return this;
  }

  getItems() {
    return cy.get(this.cartItems);
  }

  getItemNames() {
    return cy.get(this.itemNames);
  }

  getSubtotal() {
    return cy.get(this.subtotalLabel);
  }

  getTax() {
    return cy.get(this.taxLabel);
  }

  getTotal() {
    return cy.get(this.totalLabel);
  }

  clickFinish() {
    cy.get(this.finishButton).click();
    return this;
  }

  clickCancel() {
    cy.get(this.cancelButton).click();
    return this;
  }
}

export const checkoutOverviewPage = new CheckoutOverviewPage();