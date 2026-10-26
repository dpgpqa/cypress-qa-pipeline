/// <reference types="cypress" />

describe('Accessibility - SauceDemo Pages', () => {
  it('should have no accessibility violations on login page', () => {
    cy.visit('/');
    cy.get('[data-test="username"]').should('have.attr', 'placeholder', 'Username');
    cy.get('[data-test="password"]').should('have.attr', 'type', 'password');
    cy.get('[data-test="login-button"]').should('have.attr', 'type', 'submit');
    cy.get('form').should('exist');
  });

  it('should have no accessibility violations on inventory page', () => {
    cy.visit('/inventory.html');
    cy.get('[data-test="inventory-item"]').should('have.length', 6);
    cy.get('[data-test="product_sort_container"]').should('be.visible');
  });

  it('should have no accessibility violations on cart page', () => {
    cy.visit('/cart.html');
    cy.get('.cart_container').should('exist');
  });
});