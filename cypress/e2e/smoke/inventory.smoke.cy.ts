/// <reference types="cypress" />

import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { CartPage } from '@pages/CartPage';
import { validUsers, products } from '@fixtures/test-data';

describe('@smoke Inventory', () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    loginPage.visit();
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.shouldBeVisible();
  });

  it('should display all 6 products', () => {
    inventoryPage.shouldHaveItems(6);
  });

  it('should add product to cart', () => {
    const product = products[0];
    inventoryPage.addToCart(product.name);
    inventoryPage.getCartBadgeCount().should('eq', '1');
  });

  it('should remove product from cart', () => {
    const product = products[0];
    inventoryPage.addToCart(product.name);
    inventoryPage.removeFromCart(product.name);
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });

  it('should navigate to cart page', () => {
    inventoryPage.goToCart();
    cartPage.shouldBeVisible();
    cartPage.shouldBeOnCartPage();
  });

  it('should sort products A to Z', () => {
    inventoryPage.sortBy('az');
    inventoryPage.getItemNames().then(($items) => {
      const names = [...$items].map((el) => el.innerText.trim());
      const sorted = [...names].sort();
      expect(names).to.deep.equal(sorted);
    });
  });

  it('should sort products Z to A', () => {
    inventoryPage.sortBy('za');
    inventoryPage.getItemNames().then(($items) => {
      const names = [...$items].map((el) => el.innerText.trim());
      const sorted = [...names].sort().reverse();
      expect(names).to.deep.equal(sorted);
    });
  });

  it('should sort products low to high', () => {
    inventoryPage.sortBy('lohi');
    inventoryPage.getItemPrices().then(($prices) => {
      const prices = [...$prices].map((el) => parseFloat(el.innerText.replace('$', '')));
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sorted);
    });
  });

  it('should sort products high to low', () => {
    inventoryPage.sortBy('hilo');
    inventoryPage.getItemPrices().then(($prices) => {
      const prices = [...$prices].map((el) => parseFloat(el.innerText.replace('$', '')));
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).to.deep.equal(sorted);
    });
  });
});
