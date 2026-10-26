/// <reference types="cypress" />

describe('Visual - SauceDemo Pages', () => {
  it('should load login page', () => {
    cy.visit('/');
    cy.get('[data-test="login-button"]').should('be.visible');
  });

  it('should load inventory page', () => {
    cy.visit('/inventory.html');
    cy.get('[data-test="inventory-item"]').should('have.length', 6);
  });

  it('should load cart page', () => {
    cy.visit('/cart.html');
    cy.get('.cart-container').should('exist');
  });

  it('should load checkout info page', () => {
    cy.visit('/checkout-step-one.html');
    cy.get('[data-test="firstName"]').should('be.visible');
  });

  it('should load checkout overview page', () => {
    cy.visit('/checkout-step-two.html');
    cy.get('.summary-total-label').should('exist');
  });

  it('should load checkout complete page', () => {
    cy.visit('/checkout-complete.html');
    cy.get('.complete-header').should('exist');
  });

  it('should show login page error state', () => {
    cy.visit('/');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('be.visible');
  });
});