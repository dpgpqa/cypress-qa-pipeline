/// <reference types="cypress" />
import { loginPage } from '../../pages/LoginPage';
import { inventoryPage } from '../../pages/InventoryPage';
import { USERS } from '../../fixtures/test-data';

describe('Smoke Tests - Login', () => {
  beforeEach(() => {
    loginPage.visit();
  });

  it('should display login form with all fields', () => {
    cy.get(loginPage.username).should('be.visible');
    cy.get(loginPage.password).should('be.visible');
    cy.get(loginPage.loginButton).should('be.visible');
  });

  it('should show error for empty credentials', () => {
    loginPage.clickLogin();
    loginPage.shouldShowError('Epic sadface: Username and password do not match any user in this service');
  });

  it('should show error for locked out user', () => {
    loginPage.login(USERS.locked.username, USERS.locked.password);
    loginPage.shouldShowError('Epic sadface: Sorry, this user has been locked out.');
  });

  it('should show error for invalid credentials', () => {
    loginPage.login(USERS.invalid.username, USERS.invalid.password);
    loginPage.shouldShowError('Epic sadface: Username and password do not match any user in this service');
  });

  it('should login successfully with standard user', () => {
    loginPage.login(USERS.standard.username, USERS.standard.password);
    inventoryPage.shouldBeOnInventory();
  });

  it('should login successfully with problem user', () => {
    loginPage.login(USERS.problem.username, USERS.problem.password);
    inventoryPage.shouldBeOnInventory();
  });

  it('should login successfully with performance glitch user', () => {
    loginPage.login(USERS.performance.username, USERS.performance.password);
    inventoryPage.shouldBeOnInventory();
  });
});

describe('Smoke Tests - Inventory', () => {
  beforeEach(() => {
    loginPage.visit().login(USERS.standard.username, USERS.standard.password);
    inventoryPage.shouldBeOnInventory();
  });

  it('should display all 6 products', () => {
    inventoryPage.getProductCount().should('have.length', 6);
  });

  it('should display correct product names', () => {
    inventoryPage.getProductNames().should('have.length', 6);
  });

  it('should sort products A to Z', () => {
    inventoryPage.sortBy('az');
    inventoryPage.getProductNames().first().should('contain', 'Sauce Labs Backpack');
  });

  it('should sort products Z to A', () => {
    inventoryPage.sortBy('za');
    inventoryPage.getProductNames().first().should('contain', 'Test.allTheThings() T-Shirt (Red)');
  });

  it('should sort products low to high', () => {
    inventoryPage.sortBy('lohi');
    inventoryPage.getProductNames().first().should('contain', 'Sauce Labs Onesie');
  });

  it('should sort products high to low', () => {
    inventoryPage.sortBy('hilo');
    inventoryPage.getProductNames().first().should('contain', 'Sauce Labs Fleece Jacket');
  });

  it('should add product to cart and update badge', () => {
    inventoryPage.addProductToCart('Sauce Labs Backpack');
    inventoryPage.getCartBadge().should('contain', '1');
  });

  it('should navigate to cart page', () => {
    inventoryPage.goToCart();
    cy.url().should('include', '/cart.html');
  });

  it('should logout successfully', () => {
    inventoryPage.logout();
    cy.url().should('include', '/');
  });
});