/// <reference types="cypress" />

import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { validUsers } from '@fixtures/test-data';

describe('@smoke Login', () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should login successfully with standard user', () => {
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    inventoryPage.shouldBeVisible();
    inventoryPage.shouldBeOnInventoryPage();
    inventoryPage.shouldHaveItems(6);
  });

  it('should show error for locked out user', () => {
    loginPage.login(validUsers.locked.username, validUsers.locked.password);
    loginPage.shouldHaveError('Epic sadface: Sorry, this user has been locked out.');
  });

  it('should show error for invalid credentials', () => {
    loginPage.login('invalid_user', 'invalid_password');
    loginPage.shouldHaveError(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  it('should show error for empty username', () => {
    loginPage.fillPassword(validUsers.standard.password);
    loginPage.clickLogin();
    loginPage.shouldHaveError('Epic sadface: Username is required');
  });

  it('should show error for empty password', () => {
    loginPage.fillUsername(validUsers.standard.username);
    loginPage.clickLogin();
    loginPage.shouldHaveError('Epic sadface: Password is required');
  });
});
