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
    cy.get('.inventory_list').should('be.visible');
  });
});

describe('Smoke - Inventory Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
    // Wait only for main container
    cy.get('.inventory_list', { timeout: 20000 }).should('be.visible');
  });

  it('should display all 6 products', () => {
    cy.get('[data-test="inventory-item"]').should('have.length', 6);
  });

  it('should have add to cart buttons', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('be.visible');
  });

  it('should have product sort container', () => {
    // Use select action which retries the full command chain
    cy.get('[data-test="product_sort_container"]', { timeout: 20000 }).select('az').should('have.value', 'az');
  });

  it('should have cart link', () => {
    // Use click action which retries the full command chain
    cy.get('[data-test="shopping_cart_link"]', { timeout: 20000 }).click();
    cy.url().should('include', '/cart.html');
    cy.go('back');
  });
});