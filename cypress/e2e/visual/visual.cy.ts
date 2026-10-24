/// <reference types="cypress" />

import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutInfoPage } from '@pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '@pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '@pages/CheckoutCompletePage';
import { validUsers, products, visualBaselines } from '@fixtures/test-data';

describe('@visual Visual Regression Tests', () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();
  const checkoutInfoPage = new CheckoutInfoPage();
  const checkoutOverviewPage = new CheckoutOverviewPage();
  const checkoutCompletePage = new CheckoutCompletePage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should match login page baseline', () => {
    loginPage.shouldBeVisible();
    cy.compareSnapshot(visualBaselines.loginPage);
  });

  it('should match inventory page baseline', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.shouldBeVisible();
    cy.compareSnapshot(visualBaselines.inventoryPage);
  });

  it('should match cart page baseline', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.addToCart(products[0].name);
    inventoryPage.addToCart(products[1].name);
    inventoryPage.goToCart();
    cartPage.shouldBeVisible();
    cy.compareSnapshot(visualBaselines.cartPage);
  });

  it('should match checkout info page baseline', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.addToCart(products[0].name);
    inventoryPage.goToCart();
    cartPage.checkout();
    checkoutInfoPage.shouldBeVisible();
    cy.compareSnapshot(visualBaselines.checkoutInfoPage);
  });

  it('should match checkout overview page baseline', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.addToCart(products[0].name);
    inventoryPage.goToCart();
    cartPage.checkout();
    checkoutInfoPage.fillInfo('John', 'Doe', '12345');
    checkoutInfoPage.continue();
    checkoutOverviewPage.shouldBeVisible();
    cy.compareSnapshot(visualBaselines.checkoutOverviewPage);
  });

  it('should match checkout complete page baseline', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.addToCart(products[0].name);
    inventoryPage.goToCart();
    cartPage.checkout();
    checkoutInfoPage.fillInfo('John', 'Doe', '12345');
    checkoutInfoPage.continue();
    checkoutOverviewPage.finish();
    checkoutCompletePage.shouldBeVisible();
    cy.compareSnapshot(visualBaselines.checkoutCompletePage);
  });

  it('should match inventory page with different sort orders', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.shouldBeVisible();

    const sortOptions = ['az', 'za', 'lohi', 'hilo'] as const;
    sortOptions.forEach((option: string, _index: number) => {
      inventoryPage.sortBy(option);
      cy.compareSnapshot(`${visualBaselines.inventoryPage}-${option}`);
    });
  });

  it('should match login page error state baseline', () => {
    loginPage.login('invalid_user', 'invalid_password');
    loginPage.getErrorMessage().should('be.visible');
    cy.compareSnapshot(`${visualBaselines.loginPage}-error`);
  });
});
