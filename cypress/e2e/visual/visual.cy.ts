/// <reference types="cypress" />
import { loginPage } from '../../pages/LoginPage';
import { inventoryPage } from '../../pages/InventoryPage';
import { cartPage } from '../../pages/CartPage';
import { checkoutInfoPage } from '../../pages/CheckoutInfoPage';
import { checkoutOverviewPage } from '../../pages/CheckoutOverviewPage';
import { checkoutCompletePage } from '../../pages/CheckoutCompletePage';
import { USERS } from '../../fixtures/test-data';

describe('Visual/Page Verification Tests', () => {
  beforeEach(() => {
    cy.login(USERS.standard.username, USERS.standard.password);
  });

  it('should verify login page elements', () => {
    cy.visit('/');
    cy.get('[data-test="username"]').should('be.visible');
    cy.get('[data-test="password"]').should('be.visible');
    cy.get('[data-test="login-button"]').should('be.visible');
  });

  it('should verify inventory page elements', () => {
    inventoryPage.shouldBeOnInventory();
    cy.get('[data-test="inventory-item"]').should('have.length', 6);
    cy.get('[data-test="product_sort_container"]').should('be.visible');
  });

  it('should verify cart page elements', () => {
    cy.visit('/cart.html');
    cy.get('.cart-container').should('exist');
  });

  it('should verify checkout info page elements', () => {
    cy.visit('/checkout-step-one.html');
    cy.get('[data-test="firstName"]').should('be.visible');
    cy.get('[data-test="lastName"]').should('be.visible');
    cy.get('[data-test="postalCode"]').should('be.visible');
    cy.get('[data-test="continue"]').should('be.visible');
  });

  it('should verify checkout overview page elements', () => {
    cy.visit('/checkout-step-two.html');
    cy.get('.summary-total-label').should('exist');
  });

  it('should verify checkout complete page elements', () => {
    cy.visit('/checkout-complete.html');
    cy.get('.complete-header').should('contain', 'Thank you for your order!');
  });

  it('should verify inventory page with different sort orders', () => {
    inventoryPage.shouldBeOnInventory();
    inventoryPage.sortBy('za');
    inventoryPage.sortBy('lohi');
    inventoryPage.sortBy('hilo');
    inventoryPage.sortBy('az');
  });

  it('should verify login page error state', () => {
    cy.visit('/');
    loginPage.clickLogin();
    loginPage.shouldShowError('Epic sadface: Username and password do not match any user in this service');
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