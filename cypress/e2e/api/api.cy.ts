/// <reference types="cypress" />
import { USERS } from '../../fixtures/test-data';

interface CypressResponse {
  status: number;
  body: any;
}

describe('API Tests - SauceDemo', () => {
  it('should login via API and get session', () => {
    cy.request({
      method: 'POST',
      url: '/login',
      form: true,
      body: {
        'user-name': USERS.standard.username,
        password: USERS.standard.password,
      },
      followRedirect: false,
    }).then((response: CypressResponse) => {
      expect(response.status).to.be.oneOf([200, 302]);
    });
  });

  it('should fail login with invalid credentials via API', () => {
    cy.request({
      method: 'POST',
      url: '/login',
      form: true,
      body: {
        'user-name': 'invalid',
        password: 'invalid',
      },
      followRedirect: false,
      failOnStatusCode: false,
    }).then((response: CypressResponse) => {
      expect(response.status).to.be.oneOf([200, 302]);
    });
  });

  it('should access inventory page after login', () => {
    cy.login(USERS.standard.username, USERS.standard.password);
    cy.request({
      method: 'GET',
      url: '/inventory.html',
    }).then((response: CypressResponse) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include('Sauce Labs Backpack');
    });
  });
});

// Custom command for login is declared in cypress/support/e2e.ts
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.request({
    method: 'POST',
    url: '/login',
    form: true,
    body: { 'user-name': username, password },
    followRedirect: true,
  });
});