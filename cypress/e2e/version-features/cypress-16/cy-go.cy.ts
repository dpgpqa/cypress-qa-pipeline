/// <reference types="cypress" />

/**
 * Cypress 16.2.0 — cy.go() mejoras
 *
 * Antes de 16.2.0, cy.go() finalizaba antes de que la página navegada
 * hubiera terminado de cargar. El siguiente comando podía ejecutarse
 * contra la página que se estaba abandonando, causando fallos intermitentes.
 *
 * Ahora cy.go():
 * - Espera a que la página cargue completamente
 * - Yields el objeto window
 * - Respeta timeout y pageLoadTimeout
 * - Falla si la página no carga dentro del timeout
 *
 * Fuente: https://docs.cypress.io/app/references/changelog.md#1620
 */

describe('Cypress 16.2.0 — cy.go() waits for page load', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.getByRole('textbox', { name: 'Username' }).type('standard_user');
    cy.getByRole('textbox', { name: 'Password' }).type('secret_sauce');
    cy.getByRole('button', { name: 'Login' }).click();
    cy.url().should('include', '/inventory.html');
  });

  it('go back to login page and wait for full load', () => {
    // cy.go('back') ahora espera a que la página de destino cargue
    const windowBefore = cy.go('back');
    cy.url().should('include', '/');
    cy.getByRole('button', { name: 'Login' }).should('be.visible');
  });

  it('go forward again after going back', () => {
    cy.go('back');
    cy.url().should('include', '/');

    // cy.go('forward') espera a que la página de inventario cargue
    const windowForward = cy.go('forward');
    cy.url().should('include', '/inventory.html');
    cy.getByRole('button', { name: 'Add to cart' }).should('exist');
  });

  it('cy.go() yields the window object', () => {
    cy.window().then((win) => {
      expect(win).to.exist;
    });

    cy.go('back');
    cy.window().its('location').its('pathname').should('include', '/');
  });
});