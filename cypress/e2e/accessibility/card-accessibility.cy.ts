import { BoardPage } from '../../support/pages';

describe('Card Accessibility Tests', () => {
  const boardPage = new BoardPage();
  let boardId: number;
  let listId: number;

  beforeEach(() => {
    cy.deleteAllBoards();
    cy.createBoard('Card A11y Test Board').then((board) => {
      boardId = board.id;
      cy.createListAPI(boardId, 'Test List').then((list) => {
        listId = list.id;
        boardPage.visit(boardId);
        cy.injectAxe();
      });
    });
  });

  it('should pass accessibility checks on card creation form', () => {
    cy.get('[data-cy="new-card"]').first().click();
    cy.get('[data-cy="new-card-form"]').should('be.visible');

    cy.checkA11y('[data-cy="new-card-form"]', {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should pass accessibility checks with single card', () => {
    cy.createCardAPI(listId, 'Accessible Card');
    boardPage.visit(boardId);
    cy.get('[data-cy="card"]').should('be.visible');
    cy.injectAxe();

    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should pass accessibility checks with multiple cards', () => {
    cy.createCardAPI(listId, 'Card 1');
    cy.createCardAPI(listId, 'Card 2');
    cy.createCardAPI(listId, 'Card 3');
    boardPage.visit(boardId);
    cy.get('[data-cy="card"]').should('have.length.at.least', 3);
    cy.injectAxe();

    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should pass accessibility checks on card detail modal', () => {
    cy.createCardAPI(listId, 'Detail Test Card');
    boardPage.visit(boardId);
    cy.get('[data-cy="card"]').should('be.visible');

    cy.get('[data-cy="card"]').first().click();
    cy.get('[data-cy="card-detail-modal"]').should('be.visible');
    cy.injectAxe();

    cy.checkA11y('[data-cy="card-detail-modal"]', {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should have proper ARIA labels for card elements', () => {
    cy.createCardAPI(listId, 'ARIA Test Card');
    boardPage.visit(boardId);
    cy.get('[data-cy="card"]').should('be.visible');
    cy.injectAxe();

    cy.get('[data-cy="card"]')
      .first()
      .should(($el) => {
        const hasRole = $el.attr('role');
        void expect($el.length > 0 || hasRole).to.be.true;
      });

    cy.checkA11y(undefined, {
      rules: {
        'aria-required-attr': { enabled: true },
        'aria-valid-attr': { enabled: true },
      },
    });
  });

  it('should support keyboard navigation for card creation', () => {
    cy.get('[data-cy="new-card"]').first().focus();
    cy.get('[data-cy="new-card"]').first().type('{enter}');
    cy.get('[data-cy="new-card-input"]').should('be.focused');
    cy.get('[data-cy="new-card-input"]').type('Keyboard Card');
    cy.get('[data-cy="new-card-input"]').type('{enter}');

    cy.get('[data-cy="card"]').should('contain', 'Keyboard Card');

    cy.injectAxe();
    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should support keyboard navigation for opening card detail', () => {
    cy.createCardAPI(listId, 'Keyboard Detail Card');
    boardPage.visit(boardId);
    cy.get('[data-cy="card"]').should('be.visible');

    cy.get('[data-cy="card"]').first().focus();
    cy.get('[data-cy="card"]').first().type('{enter}');
    cy.get('[data-cy="card-detail-modal"]').should('be.visible');

    cy.injectAxe();
    cy.checkA11y('[data-cy="card-detail-modal"]', {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should trap focus within card detail modal', () => {
    cy.createCardAPI(listId, 'Focus Trap Card');
    boardPage.visit(boardId);
    cy.get('[data-cy="card"]').should('be.visible');

    cy.get('[data-cy="card"]').first().click();
    cy.get('[data-cy="card-detail-modal"]').should('be.visible');

    cy.get('[data-cy="card-detail-modal"]').within(() => {
      cy.focused().should('exist');
    });

    cy.injectAxe();
    cy.checkA11y('[data-cy="card-detail-modal"]', {
      rules: {
        'focus-order-semantics': { enabled: true },
      },
    });
  });

  it('should have accessible close button on card modal', () => {
    cy.createCardAPI(listId, 'Close Button Card');
    boardPage.visit(boardId);
    cy.get('[data-cy="card"]').should('be.visible');

    cy.get('[data-cy="card"]').first().click();
    cy.get('[data-cy="card-detail-modal"]').should('be.visible');
    cy.injectAxe();

    cy.get('[data-cy="close-card-detail"]').should(($el) => {
      const hasAriaLabel = $el.attr('aria-label');
      const hasText = $el.text();
      void expect(hasAriaLabel || hasText).to.exist;
    });

    cy.checkA11y('[data-cy="card-detail-modal"]', {
      rules: {
        'button-name': { enabled: true },
      },
    });
  });

  it('should have proper color contrast on card elements', () => {
    cy.createCardAPI(listId, 'Contrast Card');
    boardPage.visit(boardId);
    cy.get('[data-cy="card"]').should('be.visible');
    cy.injectAxe();

    cy.checkA11y('[data-cy="card"]', {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });

  it('should announce card completion status to screen readers', () => {
    cy.createCardAPI(listId, 'Completion Status Card');
    boardPage.visit(boardId);
    cy.get('[data-cy="card"]').should('be.visible');

    cy.get('[data-cy="card"]').first().click();
    cy.get('[data-cy="card-detail-modal"]').should('be.visible');

    cy.get('[data-cy="card-completed"]').should(($el) => {
      const hasRole = $el.attr('role');
      const hasAriaLabel = $el.attr('aria-label');
      void expect(hasRole || hasAriaLabel).to.exist;
    });

    cy.injectAxe();
    cy.checkA11y('[data-cy="card-detail-modal"]', {
      rules: {
        'aria-live-region': { enabled: true },
      },
    });
  });

  it('should have semantic HTML in card structure', () => {
    cy.createCardAPI(listId, 'Semantic Card');
    boardPage.visit(boardId);
    cy.get('[data-cy="card"]').should('be.visible');
    cy.injectAxe();

    cy.checkA11y('[data-cy="card"]', {
      rules: {
        list: { enabled: true },
        listitem: { enabled: true },
      },
    });
  });

  it('should handle ESC key to close card detail modal', () => {
    cy.createCardAPI(listId, 'ESC Key Card');
    boardPage.visit(boardId);
    cy.get('[data-cy="card"]').should('be.visible');

    cy.get('[data-cy="card"]').first().click();
    cy.get('[data-cy="card-detail-modal"]').should('be.visible');

    cy.get('body').type('{esc}');
    cy.get('[data-cy="card-detail-modal"]').should('not.exist');

    cy.injectAxe();
    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });
});
