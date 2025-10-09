import { HomePage, BoardPage } from '../../support/pages';
import List from '../../../trelloapp/src/typings/list';
import Card from '../../../trelloapp/src/typings/card';

describe('End-to-End Flow - Smoke Test', () => {
  const homePage = new HomePage();
  const boardPage = new BoardPage();

  beforeEach(() => {
    cy.deleteAllBoards();
  });

  it('should complete full board workflow', () => {
    cy.fixture('testData').then((testData) => {
      const boardData = testData.fullBoard;

      // Create board with lists and cards via API
      cy.createBoardWithListsAndCards(boardData.boardName, boardData.lists).then((result) => {
        // Visit the board
        boardPage.visit(result.board.id);
        boardPage.assertBoardLoaded();

        // Verify structure
        boardPage.assertBoardTitle(boardData.boardName);
        boardPage.assertListCount(boardData.lists.length);

        // Count total cards
        const totalCards = boardData.lists.reduce(
          (sum: number, list: List) => sum + list.cards.length,
          0
        );
        boardPage.assertCardCount(totalCards);

        // Verify specific cards exist
        boardData.lists.forEach((list: List) => {
          list.cards.forEach((card: Card) => {
            boardPage.assertCardExists(card.name);
          });
        });
      });
    });
  });

  it('should handle empty board state', () => {
    homePage.visit();
    homePage.createFirstBoard('Empty Board');

    boardPage.assertBoardLoaded();
    boardPage.assertListCount(0);
    boardPage.assertCardCount(0);
  });
});
