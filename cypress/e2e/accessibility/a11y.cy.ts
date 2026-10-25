/// <reference types="cypress" />

import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { validUsers } from '@fixtures/test-data';

describe('@a11y Accessibility Tests', () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should have no accessibility violations on login page', () => {
    loginPage.shouldBeVisible();
    cy.checkA11y();
  });

  it('should have no accessibility violations on inventory page', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.shouldBeVisible();
    cy.checkA11y();
  });

  it('should have no accessibility violations on login error state', () => {
    loginPage.login('invalid', 'invalid');
    loginPage.getErrorMessage().should('be.visible');
    cy.checkA11y();
  });
});
