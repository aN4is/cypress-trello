/// <reference types="cypress" />

export abstract class BasePage {
  abstract visit(params?: unknown): void;

  protected getElement(selector: string) {
    return cy.get(selector);
  }

  protected getByDataCy(dataCy: string) {
    return cy.get(`[data-cy="${dataCy}"]`);
  }

  protected clickElement(selector: string) {
    return this.getElement(selector).click();
  }

  protected typeText(selector: string, text: string) {
    return this.getElement(selector).type(text);
  }

  protected clearAndType(selector: string, text: string) {
    return this.getElement(selector).clear().type(text);
  }

  protected assertVisible(selector: string) {
    return this.getElement(selector).should('be.visible');
  }

  protected assertText(selector: string, text: string) {
    return this.getElement(selector).should('contain.text', text);
  }

  protected waitForUrl(urlPattern: string | RegExp) {
    return cy.url().should('match', new RegExp(urlPattern));
  }
}
