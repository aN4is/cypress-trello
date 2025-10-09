import { BasePage } from './BasePage';

export class BoardPage extends BasePage {
  private readonly boardTitle = '[data-cy="board-title"]';
  private readonly starButton = '[data-cy="star"]';
  private readonly listPlaceholder = '[data-cy="list-placeholder"]';
  private readonly boardDetail = '[data-cy="board-detail"]';
  private readonly cards = '[data-cy="card"]';
  private readonly lists = '[data-cy="list"]';
  private readonly addListButton = '[data-cy="add-list"]';

  visit(boardId?: number): void {
    const id = boardId || 1;
    cy.visit(`/board/${id}`);
  }

  assertBoardLoaded(): this {
    this.getByDataCy('board-detail').should('be.visible');
    return this;
  }

  assertBoardTitle(title: string): this {
    this.getElement(this.boardTitle).should('have.value', title);
    return this;
  }

  changeBoardTitle(newTitle: string): this {
    this.clearAndType(this.boardTitle, newTitle);
    this.getElement(this.boardTitle).blur();
    return this;
  }

  toggleStar(): this {
    this.clickElement(this.starButton);
    return this;
  }

  assertStarred(): this {
    this.getElement(this.starButton).should('have.class', 'text-yellow-300');
    return this;
  }

  assertNotStarred(): this {
    this.getElement(this.starButton).should('have.class', 'text-white');
    return this;
  }

  createList(listName: string): this {
    // this.getByDataCy('new-list').click();
    this.getByDataCy('add-list-input').type(listName);
    this.getByDataCy('add-list').click();
    return this;
  }

  assertListExists(listName: string): this {
    this.getByDataCy('list-name').should('contain.text', listName);
    return this;
  }

  createCard(listIndex: number, cardName: string): this {
    this.getByDataCy('new-card').eq(listIndex).click();
    this.getByDataCy('new-card-input').type(cardName);
    this.getByDataCy('new-card-submit').click();
    return this;
  }

  assertCardExists(cardName: string): this {
    this.getElement(this.cards).should('contain.text', cardName);
    return this;
  }

  getCard(cardName: string) {
    return this.getElement(this.cards).contains(cardName);
  }

  openCard(cardName: string): this {
    this.getCard(cardName).click();
    return this;
  }

  assertCardCount(count: number): this {
    this.getElement(this.cards).should('have.length', count);
    return this;
  }

  assertListCount(count: number): this {
    this.getElement(this.lists).should('have.length', count);
    return this;
  }
}
