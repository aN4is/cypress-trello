import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly createBoardButton = '[data-cy="create-board"]';
  private readonly boardTitle = '[data-cy="new-board-input"]';
  private readonly createBoardSubmit = '[data-cy="new-board-submit"]';
  private readonly boardList = '[data-cy="board-list"]';
  private readonly boards = '[data-cy="board-item"]';

  visit(): void {
    cy.visit('/');
  }

  createFirstBoard(boardName: string): this {
    this.getByDataCy('first-board').type(boardName).type('{enter}');
    return this;
  }

  clickCreateBoard(): this {
    this.getByDataCy('create-board').click();
    return this;
  }

  createBoard(boardName: string): this {
    this.getByDataCy('create-board').click();
    this.getByDataCy('new-board-input').type(boardName);
    this.getByDataCy('new-board-create').click();
    return this;
  }

  openBoard(boardName: string): void {
    this.getByDataCy('board-item').contains(boardName).click();
  }

  assertBoardExists(boardName: string): this {
    this.getByDataCy('board-item').should('contain.text', boardName);
    return this;
  }

  assertBoardCount(count: number): this {
    this.getByDataCy('board-item').should('have.length', count);
    return this;
  }

  assertHomePageVisible(): this {
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    return this;
  }
}
