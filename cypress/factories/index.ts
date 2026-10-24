export interface UserData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface ProductData {
  name: string;
  price: number;
  description: string;
}

export const validUsers: Record<string, UserData> = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    firstName: 'Jane',
    lastName: 'Smith',
    postalCode: '67890',
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce',
    firstName: 'Bob',
    lastName: 'Wilson',
    postalCode: '11111',
  },
  performance: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    firstName: 'Alice',
    lastName: 'Brown',
    postalCode: '22222',
  },
  error: {
    username: 'error_user',
    password: 'secret_sauce',
    firstName: 'Charlie',
    lastName: 'Davis',
    postalCode: '33333',
  },
  visual: {
    username: 'visual_user',
    password: 'secret_sauce',
    firstName: 'Diana',
    lastName: 'Miller',
    postalCode: '44444',
  },
};

export const invalidCredentials = {
  wrongPassword: {
    username: 'standard_user',
    password: 'wrong_password',
  },
  wrongUsername: {
    username: 'wrong_user',
    password: 'secret_sauce',
  },
  emptyUsername: {
    username: '',
    password: 'secret_sauce',
  },
  emptyPassword: {
    username: 'standard_user',
    password: '',
  },
  emptyBoth: {
    username: '',
    password: '',
  },
};

export const products = [
  { name: 'Sauce Labs Backpack', price: 29.99, id: 'sauce-labs-backpack' },
  { name: 'Sauce Labs Bike Light', price: 9.99, id: 'sauce-labs-bike-light' },
  { name: 'Sauce Labs Bolt T-Shirt', price: 15.99, id: 'sauce-labs-bolt-t-shirt' },
  { name: 'Sauce Labs Fleece Jacket', price: 49.99, id: 'sauce-labs-fleece-jacket' },
  { name: 'Sauce Labs Onesie', price: 7.99, id: 'sauce-labs-onesie' },
  {
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
    id: 'test.allthethings()-t-shirt-(red)',
  },
];

export function getRandomProduct() {
  return products[Math.floor(Math.random() * products.length)];
}

export function getRandomProducts(count: number) {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateRandomUser(): UserData {
  const randomNum = Math.floor(Math.random() * 10000);
  return {
    username: `user_${randomNum}`,
    password: `Pass${randomNum}!`,
    firstName: `First${randomNum}`,
    lastName: `Last${randomNum}`,
    postalCode: String(randomNum).padStart(5, '0'),
  };
}

export function generateCheckoutInfo(): UserData {
  return {
    username: '',
    password: '',
    firstName: `Test${Math.floor(Math.random() * 1000)}`,
    lastName: `User${Math.floor(Math.random() * 1000)}`,
    postalCode: String(Math.floor(Math.random() * 90000) + 10000),
  };
}
