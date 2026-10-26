/// <reference types="cypress" />

export class CartPage {
  readonly url = '/cart.html';
  readonly cartItems = '[data-test="inventory-item"]';
  readonly cartItemNames = '.inventory_item_name';
  readonly cartItemPrices = '.inventory_item_price';
  readonly removeButtons = '[data-test^="remove-"]';
  readonly checkoutButton = '[data-test="checkout"]';
  readonly continueShoppingButton = '[data-test="continue-shopping"]';

  shouldBeOnCart() {
    cy.url().should('include', '/cart.html');
    return this;
  }

  getCartItems() {
    return cy.get(this.cartItems);
  }

  getItemCount() {
    return cy.get(this.cartItems).its('length');
  }

  removeProduct(productName: string) {
    cy.get(this.cartItems)
      .contains('.inventory_item_name', productName)
      .parent()
      .find('button')
      .click();
    return this;
  }

  clickCheckout() {
    cy.get(this.checkoutButton).click();
    return this;
  }

  clickContinueShopping() {
    cy.get(this.continueShoppingButton).click();
    return this;
  }
}

export const cartPage = new CartPage();