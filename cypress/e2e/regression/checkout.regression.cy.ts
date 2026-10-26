/// <reference types="cypress" />
import { loginPage } from '../../pages/LoginPage';
import { inventoryPage } from '../../pages/InventoryPage';
import { cartPage } from '../../pages/CartPage';
import { checkoutInfoPage } from '../../pages/CheckoutInfoPage';
import { checkoutOverviewPage } from '../../pages/CheckoutOverviewPage';
import { checkoutCompletePage } from '../../pages/CheckoutCompletePage';
import { USERS, PRODUCTS, CHECKOUT_INFO } from '../../fixtures/test-data';

describe('Regression Tests - Checkout Flow', () => {
  beforeEach(() => {
    loginPage.visit().login(USERS.standard.username, USERS.standard.password);
    inventoryPage.shouldBeOnInventory();
  });

  it('should complete full checkout with single item', () => {
    inventoryPage.addProductToCart(PRODUCTS[0].name);
    inventoryPage.getCartBadge().should('contain', '1');

    inventoryPage.goToCart();
    cartPage.shouldBeOnCart();

    cartPage.clickCheckout();
    checkoutInfoPage.shouldBeOnCheckoutInfo();

    checkoutInfoPage.fillInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.postalCode
    );
    checkoutInfoPage.clickContinue();

    checkoutOverviewPage.shouldBeOnCheckoutOverview();
    checkoutOverviewPage.getItems().should('have.length', 1);
    checkoutOverviewPage.getSubtotal().should('contain', PRODUCTS[0].price);

    checkoutOverviewPage.clickFinish();

    cy.url().should('include', '/checkout-complete.html');
    checkoutCompletePage.shouldShowSuccessMessage();
  });

  it('should complete full checkout with multiple items', () => {
    inventoryPage.addProductToCart(PRODUCTS[0].name);
    inventoryPage.addProductToCart(PRODUCTS[1].name);
    inventoryPage.getCartBadge().should('contain', '2');

    inventoryPage.goToCart();
    cartPage.getItemCount().should('eq', 2);

    cartPage.clickCheckout();
    checkoutInfoPage.fillInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.postalCode
    );
    checkoutInfoPage.clickContinue();

    checkoutOverviewPage.getItems().should('have.length', 2);

    checkoutOverviewPage.clickFinish();
    checkoutCompletePage.shouldShowSuccessMessage();
  });

  it('should show validation error for empty first name', () => {
    inventoryPage.addProductToCart(PRODUCTS[0].name);
    inventoryPage.goToCart();
    cartPage.clickCheckout();

    checkoutInfoPage.fillInfo(
      CHECKOUT_INFO.emptyFirstName.firstName,
      CHECKOUT_INFO.emptyFirstName.lastName,
      CHECKOUT_INFO.emptyFirstName.postalCode
    );
    checkoutInfoPage.clickContinueExpectingError();

    checkoutInfoPage.shouldShowError('Error: First Name is required');
  });

  it('should show validation error for empty last name', () => {
    inventoryPage.addProductToCart(PRODUCTS[0].name);
    inventoryPage.goToCart();
    cartPage.clickCheckout();

    checkoutInfoPage.fillInfo(
      CHECKOUT_INFO.emptyLastName.firstName,
      CHECKOUT_INFO.emptyLastName.lastName,
      CHECKOUT_INFO.emptyLastName.postalCode
    );
    checkoutInfoPage.clickContinueExpectingError();

    checkoutInfoPage.shouldShowError('Error: Last Name is required');
  });

  it('should show validation error for empty postal code', () => {
    inventoryPage.addProductToCart(PRODUCTS[0].name);
    inventoryPage.goToCart();
    cartPage.clickCheckout();

    checkoutInfoPage.fillInfo(
      CHECKOUT_INFO.emptyPostalCode.firstName,
      CHECKOUT_INFO.emptyPostalCode.lastName,
      CHECKOUT_INFO.emptyPostalCode.postalCode
    );
    checkoutInfoPage.clickContinueExpectingError();

    checkoutInfoPage.shouldShowError('Error: Postal Code is required');
  });

  it('should cancel checkout at info step and return to cart', () => {
    inventoryPage.addProductToCart(PRODUCTS[0].name);
    inventoryPage.goToCart();
    cartPage.clickCheckout();

    checkoutInfoPage.clickCancel();
    cartPage.shouldBeOnCart();
  });

  it('should cancel checkout at overview step and return to inventory', () => {
    inventoryPage.addProductToCart(PRODUCTS[0].name);
    inventoryPage.goToCart();
    cartPage.clickCheckout();

    checkoutInfoPage.fillInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.postalCode
    );
    checkoutInfoPage.clickContinue();

    checkoutOverviewPage.clickCancel();
    inventoryPage.shouldBeOnInventory();
  });

  it('should continue shopping from cart and return to inventory', () => {
    inventoryPage.addProductToCart(PRODUCTS[0].name);
    inventoryPage.goToCart();
    cartPage.clickContinueShopping();
    inventoryPage.shouldBeOnInventory();
  });

  it('should remove item from cart', () => {
    inventoryPage.addProductToCart(PRODUCTS[0].name);
    inventoryPage.getCartBadge().should('contain', '1');

    inventoryPage.goToCart();
    cartPage.removeProduct(PRODUCTS[0].name);
    cartPage.getItemCount().should('eq', 0);
  });
});