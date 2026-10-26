/// <reference types="cypress" />
import { loginPage } from '../../pages/LoginPage';
import { inventoryPage } from '../../pages/InventoryPage';
import { cartPage } from '../../pages/CartPage';
import { checkoutInfoPage } from '../../pages/CheckoutInfoPage';
import { checkoutOverviewPage } from '../../pages/CheckoutOverviewPage';
import { checkoutCompletePage } from '../../pages/CheckoutCompletePage';
import { USERS } from '../../fixtures/test-data';

describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('should have no accessibility violations on login page', () => {
    loginPage.visit();
    cy.checkA11y();
  });

  it('should have no accessibility violations on inventory page', () => {
    cy.login(USERS.standard.username, USERS.standard.password);
    inventoryPage.shouldBeOnInventory();
    cy.checkA11y();
  });

  it('should have no accessibility violations on cart page', () => {
    cy.login(USERS.standard.username, USERS.standard.password);
    cy.visit('/cart.html');
    cartPage.shouldBeOnCart();
    cy.checkA11y();
  });

  it('should have no accessibility violations on checkout info page', () => {
    cy.login(USERS.standard.username, USERS.standard.password);
    cy.visit('/checkout-step-one.html');
    checkoutInfoPage.shouldBeOnCheckoutInfo();
    cy.checkA11y();
  });

  it('should have no accessibility violations on checkout overview page', () => {
    cy.login(USERS.standard.username, USERS.standard.password);
    cy.visit('/checkout-step-two.html');
    checkoutOverviewPage.shouldBeOnCheckoutOverview();
    cy.checkA11y();
  });

  it('should have no accessibility violations on checkout complete page', () => {
    cy.login(USERS.standard.username, USERS.standard.password);
    cy.visit('/checkout-complete.html');
    checkoutCompletePage.shouldBeOnCheckoutComplete();
    cy.checkA11y();
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

Cypress.Commands.add('injectAxe', () => {
  cy.visit('/');
  cy.then(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js';
    document.head.appendChild(script);
  });
});

Cypress.Commands.add('checkA11y', () => {
  cy.window().then((win: Window & { axe?: any }) => {
    if (win.axe) {
      win.axe.run().then((results: any) => {
        if (results.violations.length > 0) {
          cy.log('Accessibility violations found:', JSON.stringify(results.violations, null, 2));
          throw new Error(`Accessibility violations: ${results.violations.length}`);
        }
      });
    }
  });
});