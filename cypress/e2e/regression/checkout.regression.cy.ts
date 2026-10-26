/// <reference types="cypress" />

describe('Regression - Checkout Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  });

  it('should have checkout button on cart page', () => {
    cy.visit('/cart.html');
    cy.get('[data-test="checkout"]').should('be.visible');
  });

  it('should have continue button on checkout info page', () => {
    cy.visit('/checkout-step-one.html');
    cy.get('[data-test="continue"]').should('be.visible');
  });

  it('should have finish button on checkout overview page', () => {
    cy.visit('/checkout-step-two.html');
    cy.get('[data-test="finish"]').should('be.visible');
  });

  it('should have cancel button on checkout info page', () => {
    cy.visit('/checkout-step-one.html');
    cy.get('[data-test="cancel"]').should('be.visible');
  });

  it('should have cancel button on checkout overview page', () => {
    cy.visit('/checkout-step-two.html');
    cy.get('[data-test="cancel"]').should('be.visible');
  });

  it('should have back home button on complete page', () => {
    cy.visit('/checkout-complete.html');
    cy.get('[data-test="back-to-home"]').should('be.visible');
  });
});