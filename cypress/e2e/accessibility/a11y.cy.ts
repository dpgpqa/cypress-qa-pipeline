/// <reference types="cypress" />

describe('Accessibility - SauceDemo', () => {
  it('should check login page', () => {
    cy.visit('/');
    cy.get('[data-test="login-button"]').should('be.visible');
  });
});