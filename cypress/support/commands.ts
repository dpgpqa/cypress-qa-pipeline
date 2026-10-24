/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="cypress" />
/// <reference types="cypress-axe" />
/// <reference types="cypress-image-diff-js" />
/* eslint-enable @typescript-eslint/triple-slash-reference */

import 'cypress-axe';

declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
      compareSnapshot(name: string, options?: object): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  'login',
  (
    username = process.env.TEST_USER || 'standard_user',
    password = process.env.TEST_PASS || 'secret_sauce'
  ) => {
    cy.session([username, password], () => {
      cy.visit('/');
      cy.get('[data-test="username"]').clear().type(username);
      cy.get('[data-test="password"]').clear().type(password, { log: false });
      cy.get('[data-test="login-button"]').click();
      cy.url().should('include', '/inventory.html');
      cy.get('[data-test="inventory-container"]').should('be.visible');
    });
  }
);

Cypress.Commands.add('logout', () => {
  cy.get('[data-test="open-menu"]').click();
  cy.get('[data-test="logout-sidebar-link"]').click();
  cy.url().should('eq', Cypress.config('baseUrl') + '/');
});

Cypress.Commands.add('checkA11y', (context = 'document', options = {}) => {
  cy.injectAxe();
  cy.checkA11y(context, options);
});

Cypress.Commands.add('compareSnapshot', (name: string, options = {}) => {
  const updateSnapshots = process.env.UPDATE_SNAPSHOTS === 'true';

  cy.task('compareImages', {
    imageA: `cypress/snapshots/${name}.png`,
    imageB: `cypress/screenshots/${name}.png`,
    threshold: 0.1,
    ...options,
  }).then((result: any) => {
    if (updateSnapshots) {
      cy.writeFile(`cypress/snapshots/${name}.png`, result.actualImage, 'base64');
      cy.log(`Updated snapshot: ${name}`);
    } else {
      void expect(result.isSameDimensions).to.be.true;
      void expect(result.misMatchPercentage).to.be.lessThan(1);
    }
  });
});
