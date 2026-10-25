import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  private selectors = {
    checkoutCompleteContainer: '[data-test="checkout-complete-container"]',
    completeHeader: '[data-test="complete-header"]',
    completeText: '[data-test="complete-text"]',
    backHomeButton: '[data-test="back-to-products"]',
  };

  shouldBeVisible() {
    cy.get(this.selectors.checkoutCompleteContainer).should('be.visible');
    return this;
  }

  getCompleteHeader() {
    return cy.get(this.selectors.completeHeader);
  }

  getCompleteText() {
    return cy.get(this.selectors.completeText);
  }

  backHome() {
    cy.get(this.selectors.backHomeButton).click();
    cy.url().should('include', '/inventory.html');
    return this;
  }

  shouldHaveSuccessMessage(header: string, text: string) {
    this.getCompleteHeader().should('contain', header);
    this.getCompleteText().should('contain', text);
    return this;
  }

  shouldBeOnCheckoutCompletePage() {
    cy.url().should('include', '/checkout-complete.html');
    return this;
  }
}
