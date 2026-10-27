/// <reference types="cypress" />

export abstract class BasePage {
  constructor(protected readonly path: string = '/') {}

  visit() {
    cy.visit(this.path);
    return this;
  }

  abstract waitForLoad(): void;

  url() {
    return cy.url();
  }

  shouldBeOn(expectedUrl: string) {
    cy.url().should('include', expectedUrl);
    return this;
  }

  getPage() {
    return cy;
  }
}