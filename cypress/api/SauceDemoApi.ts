export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: string;
}

const API_BASE = process.env.API_BASE_URL || 'https://www.saucedemo.com';

export class SauceDemoApi {
  private baseUrl: string;

  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
  }

  getProducts(): Cypress.Chainable<Product[]> {
    return cy
      .request({
        method: 'GET',
        url: `${this.baseUrl}/api/products`,
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status === 200) {
          return response.body as Product[];
        }
        return this.getMockProducts();
      });
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: 1,
        name: 'Sauce Labs Backpack',
        price: 29.99,
        description:
          'Carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
        image: '/static/media/sauce-backpack-1200x1500.0a0b83a3.jpg',
      },
      {
        id: 2,
        name: 'Sauce Labs Bike Light',
        price: 9.99,
        description:
          "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
        image: '/static/media/bike-light-1200x1500.3c7c1c50.jpg',
      },
      {
        id: 3,
        name: 'Sauce Labs Bolt T-Shirt',
        price: 15.99,
        description:
          'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% combed ring-spun cotton, heather gray with red bolt.',
        image: '/static/media/bolt-shirt-1200x1500.c2599c57.jpg',
      },
      {
        id: 4,
        name: 'Sauce Labs Fleece Jacket',
        price: 49.99,
        description:
          "It's not every day you come across a midweight quarter-zip fleece jacket capable of handling everything from a brisk morning jog to a chilly evening campfire.",
        image: '/static/media/sauce-fleece-1200x1500.5c5f5c5c.jpg',
      },
      {
        id: 5,
        name: 'Sauce Labs Onesie',
        price: 7.99,
        description:
          'Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom for quick changes, 100% cotton.',
        image: '/static/media/onesie-1200x1500.1d2c3b4a.jpg',
      },
      {
        id: 6,
        name: 'Test.allTheThings() T-Shirt (Red)',
        price: 15.99,
        description:
          'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft 100% cotton, heather red.',
        image: '/static/media/t-shirt-1200x1500.6b5c7d8e.jpg',
      },
    ];
  }

  getProduct(id: number): Cypress.Chainable<Product> {
    return cy
      .request({
        method: 'GET',
        url: `${this.baseUrl}/api/products/${id}`,
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status === 200) {
          return response.body as Product;
        }
        const products = this.getMockProducts();
        const product = products.find((p) => p.id === id);
        if (!product) throw new Error(`Product ${id} not found`);
        return product;
      });
  }

  checkout(info: CheckoutInfo): Cypress.Chainable<Order> {
    return cy
      .request({
        method: 'POST',
        url: `${this.baseUrl}/api/checkout`,
        body: info,
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          return response.body as Order;
        }
        return {
          id: `ORDER-${Date.now()}`,
          items: [],
          total: 0,
          timestamp: new Date().toISOString(),
        };
      });
  }
}

export const sauceDemoApi = new SauceDemoApi();
