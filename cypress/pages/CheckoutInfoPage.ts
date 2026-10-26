/// <reference types="cypress" />

export class CheckoutInfoPage {
  readonly url = '/checkout-step-one.html';
  readonly firstName = '[data-test="firstName"], #first-name, input[name="firstName"]';
  readonly lastName = '[data-test="lastName"], #last-name, input[name="lastName"]';
  readonly postalCode = '[data-test="postalCode"], #postal-code, input[name="postalCode"]';
  readonly continueButton = '[data-test="continue"], #continue, button[type="submit"]';
  readonly cancelButton = '[data-test="cancel"], #cancel, a[data-test="cancel"]';
  readonly errorMessage = '[data-test="error"], .error-message-container, .error';

  shouldBeOnCheckoutInfo() {
    cy.url().should('include', '/checkout-step-one.html');
    return this;
  }

  fillFirstName(name: string) {
      if (name) {
        cy.get(this.firstName).should('be.visible').clear().type(name);
      }
      return this;
    }

    fillLastName(name: string) {
      if (name) {
        cy.get(this.lastName).should('be.visible').clear().type(name);
      }
      return this;
    }

    fillPostalCode(code: string) {
      if (code) {
        cy.get(this.postalCode).should('be.visible').clear().type(code);
      }
      return this;
    }

  fillInfo(firstName: string, lastName: string, postalCode: string) {
    return this.fillFirstName(firstName).fillLastName(lastName).fillPostalCode(postalCode);
  }

  clickContinue(expectNavigation: boolean = true) {
      cy.get(this.continueButton).should('be.visible').click();
      if (expectNavigation) {
        cy.url().should('include', '/checkout-step-two.html');
      }
      return this;
    }

    continue() {
      return this.clickContinue();
    }

    clickContinueExpectingError() {
      return this.clickContinue(false);
    }

    clickCancel() {
        cy.get(this.cancelButton).should('be.visible').click();
        cy.url().should('include', '/cart.html');
        return this;
      }

  shouldShowError(message: string) {
    cy.get(this.errorMessage).should('be.visible').and('contain', message);
    return this;
  }
}

export const checkoutInfoPage = new CheckoutInfoPage();