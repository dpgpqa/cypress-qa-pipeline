/// <reference types="cypress" />

export class InventoryPage {
  readonly url = '/inventory.html';
  readonly productSort = '[data-test="product_sort_container"]';
  readonly productItems = '[data-test="inventory-item"]';
  readonly productNames = '.inventory_item_name';
  readonly productPrices = '.inventory_item_price';
  readonly addToCartButtons = '[data-test^="add-to-cart-"]';
  readonly cartLink = '[data-test="shopping_cart_link"]';
  readonly cartBadge = '[data-test="shopping_cart_badge"]';
  readonly menuButton = '#react-burger-menu-btn';

  shouldBeOnInventory() {
    cy.url().should('include', '/inventory.html');
    cy.get(this.productItems).should('have.length', 6);
    return this;
  }

  getProductCount() {
    return cy.get(this.productItems);
  }

  getProductNames() {
    return cy.get(this.productNames);
  }

  sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    cy.get(this.productSort).select(option);
    return this;
  }

  addProductToCart(productName: string) {
    cy.get(this.productItems)
      .contains('.inventory_item_name', productName)
      .parent()
      .find('button')
      .click();
    return this;
  }

  getCartBadge() {
    return cy.get(this.cartBadge);
  }

  goToCart() {
    cy.get(this.cartLink).click();
    return this;
  }

  openMenu() {
    cy.get(this.menuButton).click();
    return this;
  }

  logout() {
    this.openMenu();
    cy.get('#logout_sidebar_link').click();
    return this;
  }
}

export const inventoryPage = new InventoryPage();