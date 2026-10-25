import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private selectors = {
    cartContainer: '[data-test="cart-container"]',
    cartList: '[data-test="cart-list"]',
    cartItem: '[data-test="cart-item"]',
    cartItemName: '[data-test="inventory-item-name"]',
    cartItemPrice: '[data-test="inventory-item-price"]',
    removeButton: '[data-test="remove-"]',
    continueShoppingButton: '[data-test="continue-shopping"]',
    checkoutButton: '[data-test="checkout"]',
  };

  shouldBeVisible() {
    cy.get('[data-test="cart-list"], [data-test="cart-container"]').should('be.visible');
    return this;
  }

  getCartItems() {
    return cy.get(this.selectors.cartItem);
  }

  getItemNames() {
    return cy.get(this.selectors.cartItemName);
  }

  getItemPrices() {
    return cy.get(this.selectors.cartItemPrice);
  }

  removeItem(itemName: string) {
    const buttonSelector = `[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
    cy.get(buttonSelector).click();
    return this;
  }

  continueShopping() {
    cy.get(this.selectors.continueShoppingButton).click();
    return this;
  }

  checkout() {
    cy.get(this.selectors.checkoutButton).click();
    cy.get('[data-test="checkout-info-container"], [data-test="checkout-info"]').should('exist');
    return this;
  }

  shouldHaveItems(count: number) {
    cy.get('[data-test="cart-item"], [data-test="cart-list"] [data-test="cart-item"]').should(
      'be.visible'
    );
    this.getCartItems().should('have.length', count);
    return this;
  }

  shouldBeOnCartPage() {
    cy.url().should('include', '/cart.html');
    return this;
  }
}
