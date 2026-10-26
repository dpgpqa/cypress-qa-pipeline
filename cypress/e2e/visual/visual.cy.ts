/// <reference types="cypress" />
import { loginPage } from '../../pages/LoginPage';
import { inventoryPage } from '../../pages/InventoryPage';
import { cartPage } from '../../pages/CartPage';
import { checkoutInfoPage } from '../../pages/CheckoutInfoPage';
import { checkoutOverviewPage } from '../../pages/CheckoutOverviewPage';
import { checkoutCompletePage } from '../../pages/CheckoutCompletePage';
import { USERS } from '../../fixtures/test-data';

describe('Visual/Page Verification Tests', () => {
  it('should verify login page elements', () => {
    loginPage.visit();
    cy.get('[data-test="username"]').should('be.visible');
    cy.get('[data-test="password"]').should('be.visible');
    cy.get('[data-test="login-button"]').should('be.visible');
  });

  it('should verify inventory page elements', () => {
      loginPage.visit().loginAndWait(USERS.standard.username, USERS.standard.password);
      inventoryPage.shouldBeOnInventory();
      cy.get('[data-test="inventory-item"]').should('have.length', 6);
      inventoryPage.sortBy('az');
    });

  it('should verify cart page elements', () => {
    loginPage.visit().loginAndWait(USERS.standard.username, USERS.standard.password);
    inventoryPage.addProductToCart('Sauce Labs Backpack');
    inventoryPage.goToCart();
    cy.get('.cart-container, .cart_list').should('exist');
    cy.get('[data-test="inventory-item"], .cart_item').should('have.length', 1);
  });

  it('should verify checkout info page elements', () => {
    loginPage.visit().loginAndWait(USERS.standard.username, USERS.standard.password);
    inventoryPage.addProductToCart('Sauce Labs Backpack');
    inventoryPage.goToCart();
    cartPage.clickCheckout();
    cy.get('[data-test="firstName"]').should('be.visible');
    cy.get('[data-test="lastName"]').should('be.visible');
    cy.get('[data-test="postalCode"]').should('be.visible');
    cy.get('[data-test="continue"]').should('be.visible');
  });

  it('should verify checkout overview page elements', () => {
    loginPage.visit().loginAndWait(USERS.standard.username, USERS.standard.password);
    inventoryPage.addProductToCart('Sauce Labs Backpack');
    inventoryPage.goToCart();
    cartPage.clickCheckout();
    checkoutInfoPage.fillInfo('John', 'Doe', '12345');
    checkoutInfoPage.clickContinue();
    cy.get('.summary-total-label, .summary_total_label').should('exist');
  });

  it('should verify checkout complete page elements', () => {
    loginPage.visit().loginAndWait(USERS.standard.username, USERS.standard.password);
    inventoryPage.addProductToCart('Sauce Labs Backpack');
    inventoryPage.goToCart();
    cartPage.clickCheckout();
    checkoutInfoPage.fillInfo('John', 'Doe', '12345');
    checkoutInfoPage.clickContinue();
    checkoutOverviewPage.clickFinish();
    cy.get('.complete-header').should('contain', 'Thank you for your order!');
  });

  it('should verify inventory page with different sort orders', () => {
    loginPage.visit().loginAndWait(USERS.standard.username, USERS.standard.password);
    inventoryPage.shouldBeOnInventory();
    inventoryPage.sortBy('za');
    inventoryPage.sortBy('lohi');
    inventoryPage.sortBy('hilo');
    inventoryPage.sortBy('az');
  });

  it('should verify login page error state', () => {
    loginPage.visit();
    loginPage.clickLogin();
    loginPage.shouldShowError('Epic sadface: Username is required');
  });
});