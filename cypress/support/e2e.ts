/// <reference types="cypress" />
/// <reference types="cypress-axe" />
/// <reference types="cypress-image-diff-js" />

import './commands';
import './hooks';

declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
      compareSnapshot(name: string, options?: object): Chainable<void>;
    }
  }
}
