/// <reference types="cypress" />

import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutInfoPage } from '@pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '@pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '@pages/CheckoutCompletePage';
import { validUsers, products, a11yContexts } from '@fixtures/test-data';

describe('@a11y Accessibility Tests', () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();
  const checkoutInfoPage = new CheckoutInfoPage();
  const checkoutOverviewPage = new CheckoutOverviewPage();
  const checkoutCompletePage = new CheckoutCompletePage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should have no accessibility violations on login page', () => {
    loginPage.shouldBeVisible();
    cy.checkA11y(a11yContexts.fullPage);
  });

  it('should have no accessibility violations on inventory page', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.shouldBeVisible();
    cy.checkA11y(a11yContexts.fullPage);
  });

  it('should have no accessibility violations on header component', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.shouldBeVisible();
    cy.checkA11y(a11yContexts.header);
  });

  it('should have no accessibility violations on main content', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.shouldBeVisible();
    cy.checkA11y(a11yContexts.mainContent);
  });

  it('should have no accessibility violations on cart page', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.addToCart(products[0].name);
    inventoryPage.goToCart();
    cartPage.shouldBeVisible();
    cy.checkA11y(a11yContexts.fullPage);
  });

  it('should have no accessibility violations on checkout info page', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.addToCart(products[0].name);
    inventoryPage.goToCart();
    cartPage.checkout();
    checkoutInfoPage.shouldBeVisible();
    cy.checkA11y(a11yContexts.fullPage);
  });

  it('should have no accessibility violations on checkout overview page', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.addToCart(products[0].name);
    inventoryPage.goToCart();
    cartPage.checkout();
    checkoutInfoPage.fillInfo('John', 'Doe', '12345');
    checkoutInfoPage.continue();
    checkoutOverviewPage.shouldBeVisible();
    cy.checkA11y(a11yContexts.fullPage);
  });

  it('should have no accessibility violations on checkout complete page', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.addToCart(products[0].name);
    inventoryPage.goToCart();
    cartPage.checkout();
    checkoutInfoPage.fillInfo('John', 'Doe', '12345');
    checkoutInfoPage.continue();
    checkoutOverviewPage.finish();
    checkoutCompletePage.shouldBeVisible();
    cy.checkA11y(a11yContexts.fullPage);
  });

  it('should have no accessibility violations on login error state', () => {
    loginPage.login('invalid', 'invalid');
    loginPage.getErrorMessage().should('be.visible');
    cy.checkA11y(a11yContexts.fullPage);
  });
});
