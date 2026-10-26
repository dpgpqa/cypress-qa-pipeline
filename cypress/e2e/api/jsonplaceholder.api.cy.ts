/// <reference types="cypress" />

describe('API - JSONPlaceholder Mock', () => {
  it('should get all users', () => {
    cy.request('GET', '/api/users').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.length.greaterThan(0);
    });
  });

  it('should get single user by id', () => {
    cy.request('GET', '/api/users/1').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', 1);
      expect(response.body).to.have.property('name');
    });
  });

  it('should handle non-existent user', () => {
    cy.request({
      method: 'GET',
      url: '/api/users/999',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});