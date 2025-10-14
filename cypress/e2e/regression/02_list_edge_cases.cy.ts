import { BoardPage } from '../../support/pages';
import Board from '../../../trelloapp/src/typings/board';

describe('List Edge Cases - Regression Test', () => {
  const boardPage = new BoardPage();
  let boardId: number;

  beforeEach(() => {
    cy.deleteAllBoards();
    cy.createBoard('Test Board').then((board: Board) => {
      boardId = board.id;
    });
  });

  describe('Boundary Testing', () => {
    it('should create list with maximum length name', () => {
      const maxLengthName = 'L'.repeat(100);
      boardPage.visit(boardId);
      boardPage.createList(maxLengthName);

      boardPage.assertListExists(maxLengthName);
      boardPage.assertListCount(1);
    });

    it('should create list with minimum length name', () => {
      const minLengthName = 'L';
      boardPage.visit(boardId);
      boardPage.createList(minLengthName);

      boardPage.assertListExists(minLengthName);
      boardPage.assertListCount(1);
    });

    it('should create list with special characters', () => {
      const specialCharName = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      boardPage.visit(boardId);
      boardPage.createList(specialCharName);

      boardPage.assertListExists(specialCharName);
    });

    it('should create list with unicode characters', () => {
      const unicodeName = '列表 List 📋 Список';
      boardPage.visit(boardId);
      boardPage.createList(unicodeName);

      boardPage.assertListExists(unicodeName);
    });

    it('should handle list name with leading and trailing spaces', () => {
      const nameWithSpaces = '  List Name  ';
      const expectedTrimmedName = 'List Name';
      boardPage.visit(boardId);
      boardPage.createList(nameWithSpaces);

      boardPage.assertListExists(expectedTrimmedName);
    });
  });

  describe('Error Handling', () => {
    it('should not create list with empty name', () => {
      boardPage.visit(boardId);
      cy.getByDataCy('add-list').click();

      boardPage.assertListCount(0);
    });

    it('should not create list with only whitespace', () => {
      boardPage.visit(boardId);
      cy.getByDataCy('add-list-input').type('   ');
      cy.getByDataCy('add-list').click();

      boardPage.assertListCount(0);
    });
  });

  describe('Multiple Lists', () => {
    it('should create multiple lists with same name', () => {
      const sameName = 'Duplicate List';

      cy.createList(boardId, sameName);
      cy.createList(boardId, sameName);
      cy.createList(boardId, sameName);

      boardPage.visit(boardId);
      boardPage.assertListCount(3);
    });

    it('should create many lists', () => {
      for (let i = 1; i <= 20; i++) {
        cy.createList(boardId, `List ${i}`);
      }

      boardPage.visit(boardId);
      boardPage.assertListCount(20);
    });

    it('should maintain list order after page reload', () => {
      cy.createList(boardId, 'First List');
      cy.createList(boardId, 'Second List');
      cy.createList(boardId, 'Third List');

      boardPage.visit(boardId);
      boardPage.assertListCount(3);

      cy.reload();
      boardPage.assertBoardLoaded();
      boardPage.assertListCount(3);

      cy.getByDataCy('list-name').eq(0).should('have.value', 'First List');
      cy.getByDataCy('list-name').eq(1).should('have.value', 'Second List');
      cy.getByDataCy('list-name').eq(2).should('have.value', 'Third List');
    });
  });

  describe('List Operations via API and UI Integration', () => {
    it('should display lists created via API', () => {
      cy.createList(boardId, 'API List 1');
      cy.createList(boardId, 'API List 2');

      boardPage.visit(boardId);
      boardPage.assertListExists('API List 1');
      boardPage.assertListExists('API List 2');
      boardPage.assertListCount(2);
    });

    it('should create list via UI after API lists exist', () => {
      cy.createList(boardId, 'API List');

      boardPage.visit(boardId);
      boardPage.createList('UI List');

      boardPage.assertListCount(2);
      boardPage.assertListExists('API List');
      boardPage.assertListExists('UI List');
    });
  });

  describe('Performance and Stress Testing', () => {
    it('should handle rapid list creation', () => {
      boardPage.visit(boardId);

      for (let i = 1; i <= 5; i++) {
        boardPage.createList(`Rapid List ${i}`);
      }

      boardPage.assertListCount(5);
    });
  });
});
