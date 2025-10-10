import { HomePage, BoardPage } from '../../support/pages';
import Board from '../../../trelloapp/src/typings/board';

describe('Board Edge Cases - Regression Test', () => {
  const homePage = new HomePage();
  const boardPage = new BoardPage();

  beforeEach(() => {
    cy.deleteAllBoards();
  });

  describe('Boundary Testing', () => {
    it('should create board with maximum length title', () => {
      const maxLengthTitle = 'A'.repeat(100);
      homePage.visit();
      homePage.createFirstBoard(maxLengthTitle);

      boardPage.assertBoardLoaded();
      boardPage.assertBoardTitle(maxLengthTitle);
    });

    it('should create board with minimum length title', () => {
      const minLengthTitle = 'A';
      homePage.visit();
      homePage.createFirstBoard(minLengthTitle);

      boardPage.assertBoardLoaded();
      boardPage.assertBoardTitle(minLengthTitle);
    });

    it('should handle board title with special characters', () => {
      const specialCharTitle = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      homePage.visit();
      homePage.createFirstBoard(specialCharTitle);

      boardPage.assertBoardLoaded();
      boardPage.assertBoardTitle(specialCharTitle);
    });

    it('should handle board title with unicode characters', () => {
      const unicodeTitle = '测试 Board 🚀 Тест';
      homePage.visit();
      homePage.createFirstBoard(unicodeTitle);

      boardPage.assertBoardLoaded();
      boardPage.assertBoardTitle(unicodeTitle);
    });

    it('should handle board title with leading and trailing spaces', () => {
      const titleWithSpaces = '  Board Name  ';
      homePage.visit();
      homePage.createFirstBoard(titleWithSpaces);

      boardPage.assertBoardLoaded();
      boardPage.assertBoardTitle(titleWithSpaces);
    });
  });

  describe('Error Handling', () => {
    it('should not create board with empty title', () => {
      homePage.visit();
      cy.getByDataCy('first-board').type('{enter}');

      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.getByDataCy('first-board').should('be.visible');
    });

    it('should not create board with only whitespace', () => {
      homePage.visit();
      cy.getByDataCy('first-board').type('   {enter}');

      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Board Rename Edge Cases', () => {
    beforeEach(() => {
      cy.createBoard('Original Board Name').as('board');
    });

    it('should rename board to empty and restore previous name', () => {
      cy.get<Board>('@board').then((board) => {
        boardPage.visit(board.id);
        boardPage.changeBoardTitle('');

        boardPage.assertBoardTitle('Original Board Name');
      });
    });

    it('should rename board multiple times consecutively', () => {
      cy.get<Board>('@board').then((board) => {
        boardPage.visit(board.id);

        boardPage.changeBoardTitle('First Rename');
        boardPage.assertBoardTitle('First Rename');

        boardPage.changeBoardTitle('Second Rename');
        boardPage.assertBoardTitle('Second Rename');

        boardPage.changeBoardTitle('Third Rename');
        boardPage.assertBoardTitle('Third Rename');
      });
    });

    it('should preserve board name on page reload', () => {
      cy.get<Board>('@board').then((board) => {
        boardPage.visit(board.id);
        boardPage.changeBoardTitle('Persistent Name');

        cy.reload();
        boardPage.assertBoardLoaded();
        boardPage.assertBoardTitle('Persistent Name');
      });
    });
  });

  describe('Star/Unstar Edge Cases', () => {
    beforeEach(() => {
      cy.createBoard('Test Board').as('board');
    });

    it('should toggle star multiple times', () => {
      cy.get<Board>('@board').then((board) => {
        boardPage.visit(board.id);

        boardPage.toggleStar();
        boardPage.assertStarred();

        boardPage.toggleStar();
        boardPage.assertNotStarred();

        boardPage.toggleStar();
        boardPage.assertStarred();
      });
    });

    it('should preserve star state on page reload', () => {
      cy.get<Board>('@board').then((board) => {
        boardPage.visit(board.id);
        boardPage.toggleStar();
        boardPage.assertStarred();

        cy.reload();
        boardPage.assertBoardLoaded();
        boardPage.assertStarred();
      });
    });
  });

  describe('Multiple Boards', () => {
    it('should create multiple boards with same name', () => {
      const sameName = 'Duplicate Board';

      cy.createBoard(sameName);
      cy.createBoard(sameName);
      cy.createBoard(sameName);

      homePage.visit();
      homePage.assertBoardCount(3);
    });

    it('should handle creating many boards', () => {
      for (let i = 1; i <= 10; i++) {
        cy.createBoard(`Board ${i}`);
      }

      homePage.visit();
      homePage.assertBoardCount(10);
    });
  });
});
