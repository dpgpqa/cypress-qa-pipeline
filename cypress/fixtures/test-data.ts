export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  performance: { username: 'performance_glitch_user', password: 'secret_sauce' },
  invalid: { username: 'invalid_user', password: 'invalid_pass' },
} as const;

export const PRODUCTS = [
  { name: 'Sauce Labs Backpack', price: '$29.99', id: 'sauce-labs-backpack' },
  { name: 'Sauce Labs Bike Light', price: '$9.99', id: 'sauce-labs-bike-light' },
  { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99', id: 'sauce-labs-bolt-t-shirt' },
  { name: 'Sauce Labs Fleece Jacket', price: '$49.99', id: 'sauce-labs-fleece-jacket' },
  { name: 'Sauce Labs Onesie', price: '$7.99', id: 'sauce-labs-onesie' },
  { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99', id: 'test.allthethings()-t-shirt-(red)' },
] as const;

export const CHECKOUT_INFO = {
  valid: { firstName: 'John', lastName: 'Doe', postalCode: '12345' },
  emptyFirstName: { firstName: '', lastName: 'Doe', postalCode: '12345' },
  emptyLastName: { firstName: 'John', lastName: '', postalCode: '12345' },
  emptyPostalCode: { firstName: 'John', lastName: 'Doe', postalCode: '' },
} as const;

export const SORT_OPTIONS = {
  az: { value: 'az', label: 'Name (A to Z)' },
  za: { value: 'za', label: 'Name (Z to A)' },
  lohi: { value: 'lohi', label: 'Price (low to high)' },
  hilo: { value: 'hilo', label: 'Price (high to low)' },
} as const;