/// <reference types="cypress" />

export class CartPage {
  readonly url = '/cart.html';
  readonly cartItems = '.cart_item, .cart_list .cart_item, [data-test="inventory-item"], .inventory_item';
  readonly cartItemNames = '.cart_item_name, .inventory_item_name';
  readonly cartItemPrices = '.cart_item_price, .inventory_item_price';
  readonly removeButtons = '[data-test^="remove-"], .cart_item button';
  readonly checkoutButton = '[data-test="checkout"], #checkout, button[data-test="checkout"]';
  readonly continueShoppingButton = '[data-test="continue-shopping"], #continue-shopping, button[data-test="continue-shopping"]';

  shouldBeOnCart() {
    cy.url().should('include', '/cart.html');
    return this;
  }

  getCartItems() {
    return cy.get(this.cartItems);
  }

  getItemCount() {
      return cy.get('body').then(($body: JQuery<HTMLElement>) => {
        const selectors = ['.cart_item', '.cart_list .cart_item', '[data-test="inventory-item"]', '.inventory_item', '.cart_item_wrap'];
        for (const selector of selectors) {
          const $items = $body.find(selector);
          if ($items.length > 0) {
            return cy.wrap($items.length);
          }
        }
        return cy.wrap(0);
      });
    }

  removeProduct(productName: string) {
    cy.get(this.cartItems)
      .contains(this.cartItemNames, productName)
      .parents(this.cartItems)
      .find(this.removeButtons)
      .first()
      .click();
    return this;
  }

  clickCheckout() {
    cy.get(this.checkoutButton).should('be.visible').click();
    return this;
  }

  goToCheckout() {
    return this.clickCheckout();
  }

  clickContinueShopping() {
    cy.get(this.continueShoppingButton).should('be.visible').click();
    cy.url().should('include', '/inventory.html');
    return this;
  }
}

export const cartPage = new CartPage();