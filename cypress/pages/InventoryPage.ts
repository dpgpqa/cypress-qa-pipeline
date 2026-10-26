/// <reference types="cypress" />

export class InventoryPage {
  readonly url = '/inventory.html';
  // Multiple fallback selectors for sort dropdown
  readonly productSort = 'select.product_sort_container, [data-test="product_sort_container"], select[data-test="product_sort_container"]';
  readonly productItems = '[data-test="inventory-item"], .inventory_item';
  readonly productNames = '.inventory_item_name, [data-test="inventory-item-name"]';
  readonly productPrices = '.inventory_item_price, [data-test="inventory-item-price"]';
  // Add to cart buttons - multiple fallbacks
  readonly addToCartButtons = '[data-test^="add-to-cart-"], button.btn_primary.btn_inventory, .inventory_item button';
  // Cart link - multiple fallbacks
  readonly cartLink = '[data-test="shopping_cart_link"], .shopping_cart_link, a.shopping_cart_link, #shopping_cart_container a';
  readonly cartBadge = '[data-test="shopping_cart_badge"], .shopping_cart_badge, .cart_badge';
  readonly menuButton = '#react-burger-menu-btn, #menu_button, button[id*="menu"]';

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
    cy.get(this.productSort).should('be.visible').select(option);
    return this;
  }

  addProductToCart(productName: string) {
    // Use parents to go up to the inventory item, then find the button
    cy.get(this.productItems)
      .contains(productName)
      .parents(this.productItems)
      .find(this.addToCartButtons)
      .first()
      .click();
    return this;
  }

  getCartBadge() {
    return cy.get(this.cartBadge);
  }

  goToCart() {
    cy.get(this.cartLink).should('be.visible').click();
    cy.url().should('include', '/cart.html');
    return this;
  }

  openMenu() {
    cy.get(this.menuButton).click();
    return this;
  }

  logout() {
    this.openMenu();
    cy.get('#logout_sidebar_link, a[id="logout_sidebar_link"]').click();
    cy.url().should('include', '/');
    return this;
  }
}

export const inventoryPage = new InventoryPage();