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
    const element = this.getElement(this.boardTitle);
    element.clear();
    if (newTitle) {
      element.type(newTitle);
    }
    element.blur();
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
    // Wait for page to be ready, then click create-list if it's visible
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100); // Small wait for DOM to stabilize
    cy.get('body').then(($body) => {
      const $createButton = $body.find('[data-cy="create-list"]:visible');
      if ($createButton.length > 0) {
        cy.log('Clicking create-list button to reveal input');
        cy.get('[data-cy="create-list"]').click();
      } else {
        cy.log('create-list button not visible, checking if input exists');
      }
    });

    this.getByDataCy('add-list-input').type(listName);
    this.getByDataCy('add-list').click();
    return this;
  }

  assertListExists(listName: string): this {
    this.getByDataCy('list-name').should(($inputs) => {
      const values = $inputs.map((i, el) => Cypress.$(el).val()).get();
      expect(values).to.include(listName);
    });
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
