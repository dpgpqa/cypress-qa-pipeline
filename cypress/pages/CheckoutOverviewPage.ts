/// <reference types="cypress" />

export class CheckoutOverviewPage {
  readonly url = '/checkout-step-two.html';
  readonly cartItems = '[data-test="inventory-item"], .cart_item, .inventory_item';
  readonly itemNames = '.inventory_item_name, .cart_item_name';
  readonly itemPrices = '.inventory_item_price, .cart_item_price';
  readonly subtotalLabel = '[data-test="subtotal-label"], .summary_subtotal_label, .summary_subtotal';
  readonly taxLabel = '[data-test="tax-label"], .summary_tax_label, .summary_tax';
  readonly totalLabel = '[data-test="total-label"], .summary_total_label, .summary_total';
  readonly finishButton = '[data-test="finish"], #finish, button[data-test="finish"]';
  readonly cancelButton = '[data-test="cancel"], #cancel, a[data-test="cancel"]';

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
    cy.get(this.finishButton).should('be.visible').click();
    cy.url().should('include', '/checkout-complete.html');
    return this;
  }

  finish() {
    return this.clickFinish();
  }

  clickCancel() {
      cy.get(this.cancelButton).should('be.visible').click();
      return this;
    }
}

export const checkoutOverviewPage = new CheckoutOverviewPage();