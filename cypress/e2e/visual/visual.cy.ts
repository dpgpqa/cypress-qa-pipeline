/// <reference types="cypress" />

describe('Visual - SauceDemo Pages', () => {
  it('should match login page baseline', () => {
    cy.visit('/');
    cy.get('[data-test="login-button"]').should('be.visible');
    cy.screenshot('login-page');
  });

  it('should match inventory page baseline', () => {
    cy.visit('/inventory.html');
    cy.get('[data-test="inventory-item"]').should('have.length', 6);
    cy.screenshot('inventory-page');
  });

  it('should match cart page baseline', () => {
    cy.visit('/cart.html');
    cy.get('.cart-container').should('exist');
    cy.screenshot('cart-page');
  });

  it('should match checkout info page baseline', () => {
    cy.visit('/checkout-step-one.html');
    cy.get('[data-test="firstName"]').should('be.visible');
    cy.screenshot('checkout-info-page');
  });

  it('should match checkout overview page baseline', () => {
    cy.visit('/checkout-step-two.html');
    cy.get('.summary-total-label').should('exist');
    cy.screenshot('checkout-overview-page');
  });

  it('should match checkout complete page baseline', () => {
    cy.visit('/checkout-complete.html');
    cy.get('.complete-header').should('contain', 'Thank you for your purchase!');
    cy.screenshot('checkout-complete-page');
  });

  it('should match inventory page with product sort', () => {
    cy.visit('/inventory.html');
    cy.get('[data-test="product_sort_container"]').select('za');
    cy.screenshot('inventory-sorted-z-a');
  });

  it('should match login page error state baseline', () => {
    cy.visit('/');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('be.visible');
    cy.screenshot('login-error-state');
  });
});