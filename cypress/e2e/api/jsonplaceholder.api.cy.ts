/// <reference types="cypress" />

describe('API - JSONPlaceholder', () => {
  it('should get all users', () => {
    cy.request('https://jsonplaceholder.typicode.com/users').its('status').should('eq', 200);
  });
});