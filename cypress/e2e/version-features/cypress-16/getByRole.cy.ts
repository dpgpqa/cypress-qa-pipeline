/// <reference types="cypress" />

/**
 * Cypress 16.2.0 — cy.getByRole()
 *
 * Nueva query nativa que encuentra elementos por su rol ARIA y nombre accesible,
 * de la misma manera que un lector de pantalla los anuncia.
 *
 * Reemplaza la necesidad de plugins de terceros (como Cypress Testing Library)
 * para consultas basadas en rol.
 *
 * Fuente: https://docs.cypress.io/api/commands/getbyrole
 */

describe('Cypress 16.2.0 — cy.getByRole()', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('login button by ARIA role and accessible name', () => {
    // Antes (Cypress <16): cy.get('[data-test="login-button"]')
    // Cypress 16.2.0+: consulta semántica por rol y nombre accesible
    cy.getByRole('button', { name: 'Login' }).click();
    cy.url().should('include', '/inventory.html');
  });

  it('username and password textboxes by role', () => {
    cy.getByRole('textbox', { name: 'Username' }).type('standard_user');
    cy.getByRole('textbox', { name: 'Password' }).type('secret_sauce');
    cy.getByRole('button', { name: 'Login' }).click();
    cy.url().should('include', '/inventory.html');
  });

  it('error alert by role after failed login', () => {
    cy.getByRole('button', { name: 'Login' }).click();
    // El error aparece como alerta accesible
    cy.getByRole('alertdialog').should('be.visible');
    cy.getByRole('alertdialog').should('contain.text', 'Epic sadface');
  });

  it('cart link by role with regex name match', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.getByRole('link', { name: /cart/i }).should('be.visible');
  });

  it('getByRole yields every match, chain .first() or .eq() to narrow', () => {
    cy.login('standard_user', 'secret_sauce');
    // getByRole devuelve todos los matches en orden del documento
    cy.getByRole('button').should('have.length.greaterThan', 0);
    cy.getByRole('button').first().should('be.visible');
  });

  it('native HTML element only by default (native: true is implicit)', () => {
    cy.visit('/');
    // getByRole('button') encuentra solo <button>, no <div role="button">
    cy.getByRole('button', { name: 'Login' }).should('have.tagName', 'BUTTON');
  });
});

/**
 * Comando de ayuda para login rápido en estos ejemplos
 */
Cypress.Commands.add('login', (username, password) => {
  cy.getByRole('textbox', { name: 'Username' }).type(username);
  cy.getByRole('textbox', { name: 'Password' }).type(password);
  cy.getByRole('button', { name: 'Login' }).click();
  cy.url().should('include', '/inventory.html');
});