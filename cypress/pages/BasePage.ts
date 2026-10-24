export class BasePage {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = Cypress.config('baseUrl') || '';
  }

  visit(path = '') {
    cy.visit(path);
    return this;
  }

  getTitle() {
    return cy.title();
  }

  getUrl() {
    return cy.url();
  }

  waitForLoad() {
    cy.document().should('have.property', 'readyState', 'complete');
    return this;
  }

  screenshot(name: string) {
    cy.screenshot(name, { capture: 'viewport' });
    return this;
  }
}
