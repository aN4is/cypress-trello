import { BoardPage, CardDetailPage } from '../../support/pages';

describe('Card Operations - Smoke Test', () => {
  const boardPage = new BoardPage();
  const cardDetailPage = new CardDetailPage();
  let boardId: number;
  let listId: number;

  interface BoardListResult {
    board: { id: number };
    lists: { id: number }[];
  }

  beforeEach(() => {
    cy.deleteAllBoards();
    cy.createBoardWithLists('Task Board', ['To Do', 'In Progress', 'Done']).as('setupData');

    cy.get<BoardListResult>('@setupData').then((data) => {
      boardId = data.board.id;
      listId = data.lists[0].id;
    });
  });

  it('should create a card', () => {
    cy.createCard(boardId, listId, 'New Task');

    boardPage.visit(boardId);
    boardPage.assertCardExists('New Task');
  });

  it('should open and edit card details', () => {
    cy.createCard(boardId, listId, 'Edit Me').then((_card) => {
      boardPage.visit(boardId);
      boardPage.openCard('Edit Me');

      cardDetailPage.assertCardDetailVisible();
      cardDetailPage.changeCardTitle('Updated Task');
      cardDetailPage.assertCardTitle('Updated Task');
    });
  });

  it('should mark card as complete', () => {
    cy.createCard(boardId, listId, 'Complete Me').then((_card) => {
      boardPage.visit(boardId);
      boardPage.openCard('Complete Me');

      cardDetailPage.toggleComplete();
      cardDetailPage.assertCompleted();
    });
  });

  it('should delete a card', () => {
    cy.createCard(boardId, listId, 'Delete Me').then((_card) => {
      boardPage.visit(boardId);
      boardPage.assertCardCount(1);

      boardPage.openCard('Delete Me');
      cardDetailPage.deleteCard();

      boardPage.assertCardCount(0);
    });
  });
});
