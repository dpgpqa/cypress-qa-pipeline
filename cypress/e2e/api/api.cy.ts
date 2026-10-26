/// <reference types="cypress" />

interface CypressResponse {
  status: number;
  body: any;
}

describe('API Tests - JSONPlaceholder', () => {
  const API_BASE = 'https://jsonplaceholder.typicode.com';

  it('should get all users', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE}/users`,
    }).then((response: CypressResponse) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  it('should get single user by id', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE}/users/1`,
    }).then((response: CypressResponse) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', 1);
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('email');
    });
  });

  it('should get all users with correct structure', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE}/users`,
    }).then((response: CypressResponse) => {
      expect(response.body[0]).to.have.property('id');
      expect(response.body[0]).to.have.property('name');
      expect(response.body[0]).to.have.property('username');
      expect(response.body[0]).to.have.property('email');
    });
  });

  it('should get all posts', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE}/posts`,
    }).then((response: CypressResponse) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  it('should create a post', () => {
    cy.request({
      method: 'POST',
      url: `${API_BASE}/posts`,
      body: {
        title: 'Test Post',
        body: 'This is a test post',
        userId: 1,
      },
    }).then((response: CypressResponse) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body.title).to.eq('Test Post');
    });
  });
});