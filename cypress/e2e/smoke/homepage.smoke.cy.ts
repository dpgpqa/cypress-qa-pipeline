/// <reference types="cypress" />

describe('Smoke - Homepage loads', () => {
  it('should load saucedemo login page', () => {
    cy.visit('/');
    cy.get('[data-test="login-button"]').should('be.visible');
  });
});