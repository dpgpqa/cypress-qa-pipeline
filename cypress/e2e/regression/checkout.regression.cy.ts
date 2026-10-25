/// <reference types="cypress" />

import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutInfoPage } from '@pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '@pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '@pages/CheckoutCompletePage';
import { validUsers, products, generateCheckoutInfo } from '@fixtures/test-data';

describe('@regression Full Checkout Flow', () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();
  const checkoutInfoPage = new CheckoutInfoPage();
  const checkoutOverviewPage = new CheckoutOverviewPage();
  const checkoutCompletePage = new CheckoutCompletePage();

  beforeEach(() => {
    loginPage.visit();
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.shouldBeVisible();
  });

  it('should complete full checkout with single item', () => {
    const product = products[0];
    const checkoutInfo = generateCheckoutInfo();

    inventoryPage.addToCart(product.name);
    inventoryPage.goToCart();
    cartPage.shouldBeVisible();
    cartPage.shouldHaveItems(1);
    cartPage.checkout();
    checkoutInfoPage.shouldBeVisible();
    checkoutInfoPage.fillInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    checkoutInfoPage.continue();
    cy.url().should('include', '/checkout-step-two.html');
    cy.get('[data-test="subtotal-label"]').should('be.visible');
    checkoutOverviewPage.shouldBeVisible();
    checkoutOverviewPage.shouldHaveItems(1);
    checkoutOverviewPage.finish();
    checkoutCompletePage.shouldBeVisible();
    checkoutCompletePage.shouldHaveSuccessMessage(
      'Thank you for your order!',
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    );
    checkoutCompletePage.backHome();
    inventoryPage.shouldBeVisible();
  });

  it('should complete full checkout with multiple items', () => {
    const selectedProducts = products.slice(0, 3);
    const checkoutInfo = generateCheckoutInfo();

    selectedProducts.forEach((product: { name: string; price: number }) => {
      inventoryPage.addToCart(product.name);
    });
    inventoryPage.getCartBadgeCount().should('eq', String(selectedProducts.length));

    inventoryPage.goToCart();
    cartPage.shouldHaveItems(selectedProducts.length);
    cartPage.checkout();
    checkoutInfoPage.fillInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    checkoutInfoPage.continue();
    cy.url().should('include', '/checkout-step-two.html');
    cy.get('[data-test="subtotal-label"]').should('be.visible');
    checkoutOverviewPage.shouldHaveItems(selectedProducts.length);
    checkoutOverviewPage.finish();
    checkoutCompletePage.shouldHaveSuccessMessage(
      'Thank you for your order!',
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    );
  });

  it('should cancel checkout at info step', () => {
    const product = products[0];
    inventoryPage.addToCart(product.name);
    inventoryPage.goToCart();
    cartPage.checkout();
    checkoutInfoPage.cancel();
    cartPage.shouldBeVisible();
    cartPage.shouldBeOnCartPage();
    cartPage.continueShopping();
    inventoryPage.shouldBeVisible();
    inventoryPage.shouldBeOnInventoryPage();
  });

  it('should cancel checkout at overview step', () => {
    const product = products[0];
    const checkoutInfo = generateCheckoutInfo();
    inventoryPage.addToCart(product.name);
    inventoryPage.goToCart();
    cartPage.checkout();
    checkoutInfoPage.fillInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    checkoutInfoPage.continue();
    cy.url().should('include', '/checkout-step-two.html');
    cy.get('[data-test="subtotal-label"]').should('be.visible');
    checkoutOverviewPage.cancel();
    inventoryPage.shouldBeVisible();
    inventoryPage.shouldBeOnInventoryPage();
  });

  it('should show validation errors for empty checkout fields', () => {
    const product = products[0];
    inventoryPage.addToCart(product.name);
    inventoryPage.goToCart();
    cartPage.checkout();
    checkoutInfoPage.continue();
    checkoutInfoPage.shouldHaveError('Error: First Name is required');
  });

  it('should persist cart after logout and login', () => {
    const product = products[0];
    inventoryPage.addToCart(product.name);
    inventoryPage.logout();
    loginPage.shouldBeOnLoginPage();
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.shouldBeVisible();
    inventoryPage.getCartBadgeCount().should('eq', '1');
  });
});
