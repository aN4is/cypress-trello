import { BoardPage, CardDetailPage } from '../../support/pages';

describe('Card Edge Cases - Regression Test', () => {
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

  describe('Boundary Testing', () => {
    it('should create card with maximum length title', () => {
      const maxLengthTitle = 'C'.repeat(200);
      cy.createCard(boardId, listId, maxLengthTitle);

      boardPage.visit(boardId);
      boardPage.assertCardExists(maxLengthTitle);
    });

    it('should create card with minimum length title', () => {
      const minLengthTitle = 'C';
      cy.createCard(boardId, listId, minLengthTitle);

      boardPage.visit(boardId);
      boardPage.assertCardExists(minLengthTitle);
    });

    it('should create card with special characters', () => {
      const specialCharTitle = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      cy.createCard(boardId, listId, specialCharTitle);

      boardPage.visit(boardId);
      boardPage.assertCardExists(specialCharTitle);
    });

    it('should create card with unicode characters', () => {
      const unicodeTitle = '任务 Card 📝 Задача';
      cy.createCard(boardId, listId, unicodeTitle);

      boardPage.visit(boardId);
      boardPage.assertCardExists(unicodeTitle);
    });

    it('should handle card title with leading and trailing spaces', () => {
      const titleWithSpaces = '  Card Title  ';
      cy.createCard(boardId, listId, titleWithSpaces);

      boardPage.visit(boardId);
      boardPage.assertCardExists(titleWithSpaces);
    });

    it('should handle card title with only numbers', () => {
      const numericTitle = '123456789';
      cy.createCard(boardId, listId, numericTitle);

      boardPage.visit(boardId);
      boardPage.assertCardExists(numericTitle);
    });
  });

  describe('Error Handling', () => {
    it('should not create card with empty title', () => {
      boardPage.visit(boardId);
      cy.getByDataCy('new-card').eq(0).click();
      cy.getByDataCy('new-card-submit').click();

      boardPage.assertCardCount(0);
    });

    it('should not create card with only whitespace', () => {
      boardPage.visit(boardId);
      cy.getByDataCy('new-card').eq(0).click();
      cy.getByDataCy('new-card-input').type('   ');
      cy.getByDataCy('new-card-submit').click();

      boardPage.assertCardCount(0);
    });
  });

  describe('Card Title Editing Edge Cases', () => {
    beforeEach(() => {
      cy.createCard(boardId, listId, 'Original Card Title');
    });

    it('should update card title to empty and restore previous title', () => {
      boardPage.visit(boardId);
      boardPage.openCard('Original Card Title');

      cardDetailPage.changeCardTitle('');
      cardDetailPage.assertCardTitle('Original Card Title');
    });

    it('should update card title multiple times consecutively', () => {
      boardPage.visit(boardId);
      boardPage.openCard('Original Card Title');

      cardDetailPage.changeCardTitle('First Update');
      cardDetailPage.assertCardTitle('First Update');

      cardDetailPage.changeCardTitle('Second Update');
      cardDetailPage.assertCardTitle('Second Update');

      cardDetailPage.changeCardTitle('Third Update');
      cardDetailPage.assertCardTitle('Third Update');
    });

    it('should preserve card title after closing and reopening', () => {
      boardPage.visit(boardId);
      boardPage.openCard('Original Card Title');

      cardDetailPage.changeCardTitle('Updated Title');
      cardDetailPage.close();

      boardPage.openCard('Updated Title');
      cardDetailPage.assertCardTitle('Updated Title');
    });

    it('should preserve card title on page reload', () => {
      boardPage.visit(boardId);
      boardPage.openCard('Original Card Title');

      cardDetailPage.changeCardTitle('Persistent Title');
      cardDetailPage.close();

      cy.reload();
      boardPage.assertBoardLoaded();
      boardPage.assertCardExists('Persistent Title');
    });
  });

  describe('Card Complete/Incomplete Toggle', () => {
    beforeEach(() => {
      cy.createCard(boardId, listId, 'Toggle Card');
    });

    it('should toggle complete status multiple times', () => {
      boardPage.visit(boardId);
      boardPage.openCard('Toggle Card');

      cardDetailPage.toggleComplete();
      cardDetailPage.assertCompleted();

      cardDetailPage.toggleComplete();
      cardDetailPage.assertNotCompleted();

      cardDetailPage.toggleComplete();
      cardDetailPage.assertCompleted();
    });

    it('should preserve complete status on page reload', () => {
      boardPage.visit(boardId);
      boardPage.openCard('Toggle Card');

      cardDetailPage.toggleComplete();
      cardDetailPage.assertCompleted();

      cy.reload();
      boardPage.assertBoardLoaded();
      boardPage.openCard('Toggle Card');
      cardDetailPage.assertCompleted();
    });

    it('should preserve complete status after closing and reopening', () => {
      boardPage.visit(boardId);
      boardPage.openCard('Toggle Card');

      cardDetailPage.toggleComplete();
      cardDetailPage.assertCompleted();

      cardDetailPage.close();
      boardPage.openCard('Toggle Card');

      cardDetailPage.assertCompleted();
    });
  });

  describe('Multiple Cards', () => {
    it('should create multiple cards with same title in same list', () => {
      const sameTitle = 'Duplicate Card';

      cy.createCard(boardId, listId, sameTitle);
      cy.createCard(boardId, listId, sameTitle);
      cy.createCard(boardId, listId, sameTitle);

      boardPage.visit(boardId);
      boardPage.assertCardCount(3);
    });

    it('should create many cards in single list', () => {
      for (let i = 1; i <= 20; i++) {
        cy.createCard(boardId, listId, `Card ${i}`);
      }

      boardPage.visit(boardId);
      boardPage.assertCardCount(20);
    });

    it('should handle cards across multiple lists', () => {
      cy.get<BoardListResult>('@setupData').then((data) => {
        const list1 = data.lists[0].id;
        const list2 = data.lists[1].id;
        const list3 = data.lists[2].id;

        cy.createCard(boardId, list1, 'Card in To Do');
        cy.createCard(boardId, list2, 'Card in Progress');
        cy.createCard(boardId, list3, 'Card Done');

        boardPage.visit(boardId);
        boardPage.assertCardCount(3);
      });
    });
  });

  describe('Card Deletion Edge Cases', () => {
    it('should delete last remaining card', () => {
      cy.createCard(boardId, listId, 'Only Card');

      boardPage.visit(boardId);
      boardPage.assertCardCount(1);

      boardPage.openCard('Only Card');
      cardDetailPage.deleteCard();

      boardPage.assertCardCount(0);
    });

    it('should delete card and verify it no longer appears after reload', () => {
      cy.createCard(boardId, listId, 'Card to Delete');

      boardPage.visit(boardId);
      boardPage.openCard('Card to Delete');
      cardDetailPage.deleteCard();

      cy.reload();
      boardPage.assertBoardLoaded();
      boardPage.assertCardCount(0);
    });
  });

  describe('Performance and Stress Testing', () => {
    it('should handle rapid card creation via UI', () => {
      boardPage.visit(boardId);

      for (let i = 1; i <= 5; i++) {
        boardPage.createCard(0, `Rapid Card ${i}`);
      }

      boardPage.assertCardCount(5);
    });

    it('should handle rapid card operations (create, edit, complete, delete)', () => {
      cy.createCard(boardId, listId, 'Operations Card');

      boardPage.visit(boardId);
      boardPage.openCard('Operations Card');

      cardDetailPage.changeCardTitle('Updated Operations Card');
      cardDetailPage.toggleComplete();
      cardDetailPage.assertCompleted();

      cardDetailPage.deleteCard();
      boardPage.assertCardCount(0);
    });
  });
});
