export class Header {
  private selectors = {
    header: '[data-test="header"]',
    headerContainer: '[data-test="header-container"]',
    appLogo: '[data-test="app-logo"]',
    shoppingCartLink: '[data-test="shopping-cart-link"]',
    shoppingCartBadge: '[data-test="shopping-cart-badge"]',
    menuButton: '[data-test="open-menu"]',
  };

  shouldBeVisible() {
    cy.get(this.selectors.header).should('be.visible');
    return this;
  }

  getCartBadgeCount() {
    return cy.get(this.selectors.shoppingCartBadge).invoke('text');
  }

  goToCart() {
    cy.get(this.selectors.shoppingCartLink).click();
    return this;
  }

  openMenu() {
    cy.get(this.selectors.menuButton).click({ force: true });
    return this;
  }

  clickAppLogo() {
    cy.get(this.selectors.appLogo).click();
    return this;
  }
}
