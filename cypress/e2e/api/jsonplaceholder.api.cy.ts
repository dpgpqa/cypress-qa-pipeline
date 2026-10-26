/// <reference types="cypress" />

describe('API - JSONPlaceholder Mock', () => {
  it('should get all users', () => {
    cy.request('GET', '/api/users').then((response) => {
      // @ts-ignore
      expect(response.status).to.eq(200);
      // @ts-ignore
      expect(response.body).to.be.an('array');
      // @ts-ignore
      expect(response.body).to.have.length.greaterThan(0);
    });
  });

  it('should get single user by id', () => {
    cy.request('GET', '/api/users/1').then((response) => {
      // @ts-ignore
      expect(response.status).to.eq(200);
      // @ts-ignore
      expect(response.body).to.have.property('id', 1);
      // @ts-ignore
      expect(response.body).to.have.property('name');
    });
  });

  it('should get all users with correct structure', () => {
    cy.request('GET', '/api/users').then((response) => {
      // @ts-ignore
      expect(response.body[0]).to.have.property('id');
      // @ts-ignore
      expect(response.body[0]).to.have.property('name');
    });
  });
});