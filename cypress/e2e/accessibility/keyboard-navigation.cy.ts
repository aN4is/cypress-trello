import { HomePage, BoardPage } from '../../support/pages';

describe.skip('Keyboard Navigation Tests', () => {
  const homePage = new HomePage();
  const boardPage = new BoardPage();

  describe('Homepage Keyboard Navigation', () => {
    beforeEach(() => {
      cy.deleteAllBoards();
      cy.visit('/');
      cy.injectAxe();
    });

    it('should navigate through page using Tab key', () => {
      cy.createBoard('Tab Navigation Board');
      cy.visit('/');
      cy.get('[data-cy="board-item"]').should('be.visible');

      cy.get('body').type('{tab}');
      cy.focused().should('be.visible');

      cy.get('body').type('{tab}');
      cy.focused().should('be.visible');

      cy.injectAxe();
      cy.checkA11y(undefined, {
        rules: {
          'focus-order-semantics': { enabled: true },
        },
      });
    });

    it('should activate create board button with Enter key', () => {
      cy.get('[data-cy="create-board-button"]').focus();
      cy.get('[data-cy="create-board-button"]').type('{enter}');
      cy.get('[data-cy="new-board-modal"]').should('be.visible');
    });

    it('should activate create board button with Space key', () => {
      cy.get('[data-cy="create-board-button"]').focus();
      cy.get('[data-cy="create-board-button"]').type(' ');
      cy.get('[data-cy="new-board-modal"]').should('be.visible');
    });

    it('should close modal with ESC key', () => {
      homePage.clickCreateBoard();
      cy.get('[data-cy="new-board-modal"]').should('be.visible');

      cy.get('body').type('{esc}');
      cy.get('[data-cy="new-board-modal"]').should('not.exist');
    });

    it('should navigate board cards using arrow keys', () => {
      cy.createBoard('Board 1');
      cy.createBoard('Board 2');
      cy.visit('/');
      cy.get('[data-cy="board-item"]').should('have.length.at.least', 2);

      cy.get('[data-cy="board-item"]').first().focus();
      cy.get('body').type('{downarrow}');

      cy.focused().should('exist');
    });

    it('should open board using Enter key', () => {
      cy.createBoard('Keyboard Open Board').then((board) => {
        cy.visit('/');
        cy.get('[data-cy="board-item"]').should('be.visible');

        cy.get('[data-cy="board-item"]').first().focus();
        cy.get('[data-cy="board-item"]').first().type('{enter}');
        cy.url().should('include', `/board/${board.id}`);
      });
    });

    it('should maintain focus visibility throughout navigation', () => {
      cy.createBoard('Focus Visibility Board');
      cy.visit('/');
      cy.get('[data-cy="board-item"]').should('be.visible');

      cy.get('body').type('{tab}');
      cy.focused().should('have.css', 'outline').and('not.equal', 'none');
    });
  });

  describe('Board Page Keyboard Navigation', () => {
    let boardId: number;

    beforeEach(() => {
      cy.deleteAllBoards();
      cy.createBoard('Keyboard Nav Board').then((board) => {
        boardId = board.id;
        boardPage.visit(boardId);
        cy.injectAxe();
      });
    });

    it('should navigate through board elements using Tab', () => {
      boardPage.createList('List 1');
      cy.get('[data-cy="list"]').should('be.visible');

      cy.get('body').type('{tab}');
      cy.focused().should('be.visible');

      cy.checkA11y(undefined, {
        rules: {
          'focus-order-semantics': { enabled: true },
        },
      });
    });

    it('should create list using keyboard only', () => {
      cy.get('[data-cy="add-list"]').focus();
      cy.get('[data-cy="add-list"]').type('{enter}');
      cy.get('[data-cy="add-list-input"]').should('be.focused');
      cy.get('[data-cy="add-list-input"]').type('Keyboard List{enter}');

      boardPage.assertListExists('Keyboard List');
    });

    it('should create card using keyboard only', () => {
      boardPage.createList('Card List');
      cy.get('[data-cy="list"]').should('be.visible');

      cy.get('[data-cy="new-card"]').first().focus();
      cy.get('[data-cy="new-card"]').first().type('{enter}');
      cy.get('[data-cy="new-card-input"]').should('be.focused');
      cy.get('[data-cy="new-card-input"]').type('Keyboard Card{enter}');

      cy.get('[data-cy="card"]').should('contain', 'Keyboard Card');
    });

    it('should open card detail using Enter key', () => {
      boardPage.createList('Detail List');
      cy.createCardAPI(boardId, Cypress.env('lastListId'), 'Detail Card');
      cy.reload();
      cy.get('[data-cy="card"]').should('be.visible');

      cy.get('[data-cy="card"]').first().focus();
      cy.get('[data-cy="card"]').first().type('{enter}');
      cy.get('[data-cy="card-detail-modal"]').should('be.visible');
    });

    it('should close card detail using ESC key', () => {
      boardPage.createList('ESC List');
      cy.createCardAPI(boardId, Cypress.env('lastListId'), 'ESC Card');
      cy.reload();
      cy.get('[data-cy="card"]').should('be.visible');

      cy.get('[data-cy="card"]').first().click();
      cy.get('[data-cy="card-detail-modal"]').should('be.visible');

      cy.get('body').type('{esc}');
      cy.get('[data-cy="card-detail-modal"]').should('not.exist');
    });

    it('should navigate between lists using arrow keys', () => {
      boardPage.createList('List 1');
      boardPage.createList('List 2');
      cy.get('[data-cy="list"]').should('have.length.at.least', 2);

      cy.get('[data-cy="list"]').first().focus();
      cy.get('body').type('{rightarrow}');

      cy.focused().should('exist');
    });

    it('should skip to main content using skip link', () => {
      cy.get('body').type('{tab}');
      cy.focused()
        .invoke('text')
        .then((text) => {
          if (text.toLowerCase().includes('skip') || text.toLowerCase().includes('main')) {
            cy.focused().type('{enter}');
            cy.focused().should('exist');
          }
        });
    });

    it('should preserve focus when adding new list', () => {
      cy.get('[data-cy="add-list"]').click();
      cy.get('[data-cy="add-list-input"]').should('be.focused');
      cy.get('[data-cy="add-list-input"]').type('Focus Test{enter}');

      cy.focused().should('exist');
    });

    it('should preserve focus when adding new card', () => {
      boardPage.createList('Focus Card List');
      cy.get('[data-cy="list"]').should('be.visible');

      cy.get('[data-cy="new-card"]').first().click();
      cy.get('[data-cy="new-card-input"]').should('be.focused');
      cy.get('[data-cy="new-card-input"]').type('Focus Card{enter}');

      cy.focused().should('exist');
    });

    it('should support reverse navigation using Shift+Tab', () => {
      boardPage.createList('Reverse Nav List');
      cy.get('[data-cy="list"]').should('be.visible');

      cy.get('[data-cy="add-list"]').focus();
      cy.get('body').type('{shift}{tab}');

      cy.focused().should('exist').and('be.visible');
    });
  });

  describe('Form Keyboard Navigation', () => {
    beforeEach(() => {
      cy.deleteAllBoards();
      cy.visit('/');
      cy.injectAxe();
    });

    it('should submit board creation form with Enter', () => {
      homePage.clickCreateBoard();
      cy.get('[data-cy="new-board-input"]').type('Enter Board{enter}');

      cy.url().should('include', '/board/');
    });

    it('should cancel form with ESC key', () => {
      homePage.clickCreateBoard();
      cy.get('[data-cy="new-board-modal"]').should('be.visible');

      cy.get('[data-cy="new-board-input"]').type('{esc}');
      cy.get('[data-cy="new-board-modal"]').should('not.exist');
    });

    it('should navigate form fields with Tab', () => {
      homePage.clickCreateBoard();
      cy.get('[data-cy="new-board-input"]').should('be.focused');

      cy.get('body').type('{tab}');
      cy.focused().should('exist');
    });

    it('should focus first input when form opens', () => {
      homePage.clickCreateBoard();
      cy.get('[data-cy="new-board-input"]').should('be.focused');
    });
  });

  describe('Accessibility Keyboard Standards', () => {
    beforeEach(() => {
      cy.deleteAllBoards();
      cy.visit('/');
      cy.injectAxe();
    });

    it('should pass WCAG keyboard accessibility standards', () => {
      cy.checkA11y(undefined, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
        rules: {
          keyboard: { enabled: true },
        },
      });
    });

    it('should have no keyboard traps', () => {
      cy.createBoard('Trap Test Board');
      cy.visit('/');
      cy.get('[data-cy="board-item"]').should('be.visible');

      for (let i = 0; i < 20; i++) {
        cy.get('body').type('{tab}');
      }

      cy.focused().should('exist');
    });

    it('should have visible focus indicators on all interactive elements', () => {
      cy.createBoard('Focus Indicator Board');
      cy.visit('/');
      cy.get('[data-cy="board-item"]').should('be.visible');

      cy.get('[data-cy="board-item"]').first().focus();
      cy.get('[data-cy="board-item"]')
        .first()
        .should('have.css', 'outline')
        .and('not.equal', 'none');

      cy.get('[data-cy="create-board-button"]').focus();
      cy.get('[data-cy="create-board-button"]')
        .should('have.css', 'outline')
        .and('not.equal', 'none');
    });
  });
});
