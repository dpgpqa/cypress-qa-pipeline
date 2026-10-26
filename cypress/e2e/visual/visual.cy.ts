/// <reference types="cypress" />
import { loginPage } from '../../pages/LoginPage';
import { inventoryPage } from '../../pages/InventoryPage';
import { cartPage } from '../../pages/CartPage';
import { checkoutInfoPage } from '../../pages/CheckoutInfoPage';
import { checkoutOverviewPage } from '../../pages/CheckoutOverviewPage';
import { checkoutCompletePage } from '../../pages/CheckoutCompletePage';
import { USERS } from '../../fixtures/test-data';

describe('Visual Regression Tests', () => {
  beforeEach(() => {
    cy.login(USERS.standard.username, USERS.standard.password);
  });

  it('should match login page baseline', () => {
    cy.visit('/');
    cy.matchImageSnapshot('login-page');
  });

  it('should match inventory page baseline', () => {
    inventoryPage.shouldBeOnInventory();
    cy.matchImageSnapshot('inventory-page');
  });

  it('should match cart page baseline', () => {
    cy.visit('/cart.html');
    cartPage.shouldBeOnCart();
    cy.matchImageSnapshot('cart-page');
  });

  it('should match checkout info page baseline', () => {
    cy.visit('/checkout-step-one.html');
    checkoutInfoPage.shouldBeOnCheckoutInfo();
    cy.matchImageSnapshot('checkout-info-page');
  });

  it('should match checkout overview page baseline', () => {
    cy.visit('/checkout-step-two.html');
    checkoutOverviewPage.shouldBeOnCheckoutOverview();
    cy.matchImageSnapshot('checkout-overview-page');
  });

  it('should match checkout complete page baseline', () => {
    cy.visit('/checkout-complete.html');
    checkoutCompletePage.shouldBeOnCheckoutComplete();
    cy.matchImageSnapshot('checkout-complete-page');
  });

  it('should match inventory page with different sort orders', () => {
    inventoryPage.shouldBeOnInventory();
    cy.matchImageSnapshot('inventory-page-az');

    inventoryPage.sortBy('za');
    cy.matchImageSnapshot('inventory-page-za');

    inventoryPage.sortBy('lohi');
    cy.matchImageSnapshot('inventory-page-lohi');

    inventoryPage.sortBy('hilo');
    cy.matchImageSnapshot('inventory-page-hilo');
  });

  it('should match login page error state baseline', () => {
    cy.visit('/');
    loginPage.clickLogin();
    loginPage.shouldShowError('Epic sadface: Username and password do not match any user in this service');
    cy.matchImageSnapshot('login-error-state');
  });
});

// Custom command for login
declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session([username, password], () => {
    cy.visit('/');
    cy.get('[data-test="username"]').type(username);
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  });
});