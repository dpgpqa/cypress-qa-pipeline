/// <reference types="cypress" />

beforeEach(() => {
  cy.intercept('**/*', { log: false });
});

afterEach(function () {
  if (this.currentTest && this.currentTest.state === 'failed') {
    const testName = this.currentTest.title.replace(/\s+/g, '-').toLowerCase();
    cy.screenshot(`failed-${testName}`, { capture: 'runner' });
  }
});

before(() => {
  cy.task('log', 'Starting test run');
});

after(() => {
  cy.task('log', 'Test run completed');
});
