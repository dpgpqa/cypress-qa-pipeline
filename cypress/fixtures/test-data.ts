import { validUsers, invalidCredentials, products, generateCheckoutInfo } from '../factories';

export const testUsers = validUsers;

export const testProducts = products;

export const testInvalidCredentials = invalidCredentials;

export const checkoutData = generateCheckoutInfo();

export { validUsers, products, generateCheckoutInfo, invalidCredentials };

export const apiTestData = {
  users: {
    valid: validUsers.standard,
    invalid: invalidCredentials.wrongPassword,
  },
  products: {
    single: products[0],
    multiple: products.slice(0, 3),
  },
  posts: {
    create: {
      title: 'Test Post',
      body: 'This is a test post body',
      userId: 1,
    },
    update: {
      title: 'Updated Test Post',
      body: 'This is an updated test post body',
    },
  },
};

export const visualBaselines = {
  loginPage: 'login-page',
  inventoryPage: 'inventory-page',
  cartPage: 'cart-page',
  checkoutInfoPage: 'checkout-info-page',
  checkoutOverviewPage: 'checkout-overview-page',
  checkoutCompletePage: 'checkout-complete-page',
};

export const a11yContexts = {
  fullPage: 'document',
  header: '[data-test="header"]',
  mainContent:
    '[data-test="inventory-container"], [data-test="cart-container"], [data-test="checkout-info-container"], [data-test="checkout-overview-container"], [data-test="checkout-complete-container"]',
  footer: 'footer',
};
