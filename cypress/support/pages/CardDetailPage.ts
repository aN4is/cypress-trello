import { BasePage } from './BasePage';

export class CardDetailPage extends BasePage {
  private readonly cardTitle = '[data-cy="card-detail-title"]';
  private readonly cardDescription = '[data-cy="card-description-input"]';
  private readonly closeButton = '[data-cy="card-detail-close"]';
  private readonly deleteButton = '[data-cy="card-detail-delete"]';
  private readonly dueDateInput = '[data-cy="due-date"]';

  visit(): void {
    throw new Error('CardDetailPage cannot be visited directly. Use BoardPage.openCard()');
  }

  assertCardDetailVisible(): this {
    this.getByDataCy('card-detail-title').should('be.visible');
    return this;
  }

  assertCardTitle(title: string): this {
    this.getElement(this.cardTitle).should('have.value', title);
    return this;
  }

  changeCardTitle(newTitle: string): this {
    this.clearAndType(this.cardTitle, newTitle);
    this.getElement(this.cardTitle).blur();
    return this;
  }

  setDescription(description: string): this {
    this.getByDataCy('card-description-button').click();
    this.clearAndType(this.cardDescription, description);
    this.getByDataCy('card-description-save').click();
    return this;
  }

  assertDescription(description: string): this {
    this.getElement(this.cardDescription).should('have.value', description);
    return this;
  }

  private getCompletionCheckbox() {
    return cy.contains('h2', 'DUE DATE').closest('div').find('[data-cy="card-checkbox"]');
  }

  toggleComplete(): this {
    this.getCompletionCheckbox().click();
    return this;
  }

  assertCompleted(): this {
    this.getCompletionCheckbox().should('be.checked');
    return this;
  }

  assertNotCompleted(): this {
    this.getCompletionCheckbox().should('not.be.checked');
    return this;
  }

  close(): this {
    this.clickElement(this.closeButton);
    return this;
  }

  deleteCard(): this {
    this.clickElement(this.deleteButton);
    return this;
  }

  setDueDate(date: string): this {
    this.clearAndType(this.dueDateInput, date);
    return this;
  }
}
