/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
        login(username: string, password: string): Chainable<void>;
        injectAxe(): Chainable<void>;
        checkA11y(): Chainable<void>;
        checkA11yRuns(): Chainable<void>;
      }
  }

  interface Window {
    axe?: any;
  }
}

export {};