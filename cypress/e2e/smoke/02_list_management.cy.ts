import { BoardPage } from '../../support/pages';

describe('List Management - Smoke Test', () => {
  const boardPage = new BoardPage();
  let testBoardId: number;

  beforeEach(() => {
    cy.deleteAllBoards();
    cy.createBoard('Test Board').then((board) => {
      testBoardId = board.id;
    });
  });

  it('should create lists on a board', () => {
    cy.fixture('lists').then((lists) => {
      boardPage.visit(testBoardId);

      lists.kanbanLists.forEach((listName: string) => {
        boardPage.createList(listName);
      });

      boardPage.assertListCount(lists.kanbanLists.length);
    });
  });

  it('should create multiple lists via API', () => {
    cy.fixture('lists').then((lists) => {
      lists.sprintLists.forEach((listName: string) => {
        cy.createList(testBoardId, listName);
      });

      boardPage.visit(testBoardId);
      boardPage.assertListCount(lists.sprintLists.length);
    });
  });
});
