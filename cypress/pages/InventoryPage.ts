import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private selectors = {
    inventoryContainer: '[data-test="inventory-container"]',
    inventoryList: '[data-test="inventory-list"]',
    inventoryItem: '[data-test="inventory-item"]',
    inventoryItemName: '[data-test="inventory-item-name"]',
    inventoryItemPrice: '[data-test="inventory-item-price"]',
    addToCartButton: '[data-test="add-to-cart-"]',
    removeButton: '[data-test="remove-"]',
    cartLink: '[data-test="shopping-cart-link"]',
    cartBadge: '[data-test="shopping-cart-badge"]',
    menuButton: '[data-test="open-menu"]',
    logoutLink: '[data-test="logout-sidebar-link"]',
    sortSelect: '[data-test="product-sort-container"]',
  };

  shouldBeVisible() {
    cy.get(this.selectors.inventoryContainer).should('be.visible');
    return this;
  }

  getInventoryItems() {
    return cy.get(this.selectors.inventoryItem);
  }

  getItemNames() {
    return cy.get(this.selectors.inventoryItemName);
  }

  getItemPrices() {
    return cy.get(this.selectors.inventoryItemPrice);
  }

  addToCart(itemName: string) {
    const buttonSelector = `${this.selectors.addToCartButton}${itemName.toLowerCase().replace(/\s+/g, '-')}`;
    cy.get(buttonSelector).click();
    return this;
  }

  removeFromCart(itemName: string) {
    const buttonSelector = `${this.selectors.removeButton}${itemName.toLowerCase().replace(/\s+/g, '-')}`;
    cy.get(buttonSelector).click();
    return this;
  }

  getCartBadgeCount() {
    return cy.get(this.selectors.cartBadge).invoke('text');
  }

  goToCart() {
    cy.get(this.selectors.cartLink).click();
    return this;
  }

  openMenu() {
    cy.get(this.selectors.menuButton).click();
    return this;
  }

  logout() {
    this.openMenu();
    cy.get(this.selectors.logoutLink).click();
    return this;
  }

  sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    const valueMap = {
      az: 'az',
      za: 'za',
      lohi: 'lohi',
      hilo: 'hilo',
    };
    cy.get(this.selectors.sortSelect).select(valueMap[option]);
    return this;
  }

  shouldHaveItems(count: number) {
    this.getInventoryItems().should('have.length', count);
    return this;
  }

  shouldBeOnInventoryPage() {
    cy.url().should('include', '/inventory.html');
    return this;
  }
}
