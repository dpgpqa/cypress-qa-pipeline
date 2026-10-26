/// <reference types="cypress" />

describe('Visual - SauceDemo', () => {
  it('should check login page visual', () => {
    cy.visit('/');
    cy.get('[data-test="login-button"]').should('be.visible');
  });
});