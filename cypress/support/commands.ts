/// <reference types="cypress" />
/// <reference types="cypress-image-diff-js" />

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
      compareSnapshot(name: string, options?: object): Chainable<void>;
      checkA11y(context?: string, options?: object): Chainable<void>;
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
  cy.get('[data-test="open-menu"]').click({ force: true });
  cy.get('[data-test="logout-sidebar-link"]').click({ force: true });
  cy.url().should('eq', Cypress.config('baseUrl') + '/');
});

Cypress.Commands.add('checkA11y', (context = 'body', _options = {}) => {
  cy.get(context).then(($el) => {
    const issues: string[] = [];

    $el.find('img').each((_, img) => {
      const alt = img.getAttribute('alt');
      if (alt === null || alt === undefined) {
        issues.push(`Image missing alt attribute: ${(img as HTMLImageElement).src}`);
      }
    });

    $el.find('input, select, textarea').each((_, input) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      const inputType = input.getAttribute('type');
      const inputValue = input.getAttribute('value');
      const hasLabel = id ? $el.find(`label[for="${id}"]`).length > 0 : false;
      const hasValue =
        inputValue &&
        inputValue.trim().length > 0 &&
        (inputType === 'submit' || inputType === 'button');
      if (!hasLabel && !ariaLabel && !ariaLabelledBy && !hasValue) {
        issues.push(`Input missing accessible name: ${input.tagName}#${id || 'no-id'}`);
      }
    });

    $el.find('button').each((_, btn) => {
      const text = btn.textContent?.trim();
      const ariaLabel = btn.getAttribute('aria-label');
      if (!text && !ariaLabel) {
        issues.push('Button missing accessible text');
      }
    });

    $el.find('a').each((_, link) => {
      const text = link.textContent?.trim();
      const ariaLabel = link.getAttribute('aria-label');
      if (!text && !ariaLabel) {
        issues.push(`Link missing accessible text: ${(link as HTMLAnchorElement).href}`);
      }
    });

    if (issues.length > 0) {
      throw new Error(`Accessibility violations found:\n${issues.join('\n')}`);
    }
  });
});

Cypress.Commands.add('compareSnapshot', (name: string, options = {}) => {
  const updateSnapshots = process.env.UPDATE_SNAPSHOTS === 'true';
  const snapshotPath = `cypress/snapshots/${name}.png`;

  cy.task('fileExists', snapshotPath).then((snapshotExists: unknown) => {
    const baselineExists = Boolean(snapshotExists);
    if (!baselineExists && !updateSnapshots) {
      cy.log(`No visual baseline for "${name}" — skipping comparison`);
      return;
    }

    cy.task('compareImages', {
      imageA: snapshotPath,
      imageB: `cypress/screenshots/${name}.png`,
      threshold: 0.1,
      ...options,
    }).then((result: any) => {
      if (updateSnapshots) {
        cy.writeFile(snapshotPath, result.actualImage, 'base64');
        cy.log(`Updated snapshot: ${name}`);
      } else {
        void expect(result.isSameDimensions).to.be.true;
        void expect(result.misMatchPercentage).to.be.lessThan(1);
      }
    });
  });
});
