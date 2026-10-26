/// <reference types="cypress" />

describe('Smoke - Login Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display login form with all fields', () => {
    cy.get('[data-test="username"]').should('be.visible');
    cy.get('[data-test="password"]').should('be.visible');
    cy.get('[data-test="login-button"]').should('be.visible');
  });

  it('should show error for empty credentials', () => {
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('be.visible');
  });

  it('should navigate to inventory after successful login', () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
    cy.get('.inventory-list').should('be.visible');
  });
});

describe('Smoke - Inventory Page', () => {
  beforeEach(() => {
    cy.visit('/inventory.html');
  });

  it('should display all 6 products', () => {
    cy.get('[data-test="inventory-item"]').should('have.length', 6);
  });

  it('should have add to cart buttons', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('be.visible');
  });

  it('should have product sort container', () => {
    cy.get('[data-test="product_sort_container"]').should('be.visible');
  });

  it('should have cart link', () => {
    cy.get('[data-test="shopping_cart_link"]').should('be.visible');
  });
});