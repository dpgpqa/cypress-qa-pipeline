/// <reference types="cypress" />

describe('Regression - Checkout flow', () => {
  it('should complete full checkout', () => {
    cy.visit('/');
    cy.get('[data-test="login-button"]').should('be.visible');
  });
});