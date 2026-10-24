import { BasePage } from './BasePage';

export class CheckoutOverviewPage extends BasePage {
  private selectors = {
    checkoutOverviewContainer: '[data-test="checkout-overview-container"]',
    summaryInfo: '[data-test="summary-info"]',
    summarySubtotal: '[data-test="subtotal-label"]',
    summaryTax: '[data-test="tax-label"]',
    summaryTotal: '[data-test="total-label"]',
    finishButton: '[data-test="finish"]',
    cancelButton: '[data-test="cancel"]',
    inventoryItem: '[data-test="inventory-item"]',
    inventoryItemName: '[data-test="inventory-item-name"]',
    inventoryItemPrice: '[data-test="inventory-item-price"]',
  };

  shouldBeVisible() {
    cy.get(this.selectors.checkoutOverviewContainer).should('be.visible');
    return this;
  }

  getItemNames() {
    return cy.get(this.selectors.inventoryItemName);
  }

  getItemPrices() {
    return cy.get(this.selectors.inventoryItemPrice);
  }

  getSubtotal() {
    return cy.get(this.selectors.summarySubtotal);
  }

  getTax() {
    return cy.get(this.selectors.summaryTax);
  }

  getTotal() {
    return cy.get(this.selectors.summaryTotal);
  }

  finish() {
    cy.get(this.selectors.finishButton).click();
    return this;
  }

  cancel() {
    cy.get(this.selectors.cancelButton).click();
    return this;
  }

  shouldHaveItems(count: number) {
    cy.get(this.selectors.inventoryItem).should('have.length', count);
    return this;
  }

  shouldBeOnCheckoutOverviewPage() {
    cy.url().should('include', '/checkout-step-two.html');
    return this;
  }
}
