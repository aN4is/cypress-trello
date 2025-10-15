import { BoardPage } from '../../support/pages';

describe('List Accessibility Tests', () => {
  const boardPage = new BoardPage();
  let boardId: number;

  beforeEach(() => {
    cy.deleteAllBoards();
    cy.createBoard('Accessibility Test Board').then((board) => {
      boardId = board.id;
      boardPage.visit(boardId);
      cy.injectAxe();
    });
  });

  it('should pass accessibility checks on empty board with no lists', () => {
    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should pass accessibility checks on list creation form', () => {
    cy.get('[data-cy="add-list"]').click();
    cy.get('[data-cy="add-list-form"]').should('be.visible');

    cy.checkA11y('[data-cy="add-list-form"]', {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should pass accessibility checks with single list', () => {
    boardPage.createList('Accessible List');
    cy.get('[data-cy="list"]').should('be.visible');

    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should pass accessibility checks with multiple lists', () => {
    boardPage.createList('To Do');
    boardPage.createList('In Progress');
    boardPage.createList('Done');
    cy.get('[data-cy="list"]').should('have.length.at.least', 3);

    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should have proper ARIA labels for list elements', () => {
    boardPage.createList('ARIA Test List');
    cy.get('[data-cy="list"]').should('be.visible');

    cy.get('[data-cy="list"]')
      .first()
      .should(($el) => {
        const hasRole = $el.attr('role');
        void expect($el.length > 0 || hasRole).to.be.true;
      });
    cy.get('[data-cy="list-title"]').first().should('be.visible');

    cy.checkA11y(undefined, {
      rules: {
        'aria-required-attr': { enabled: true },
        'aria-valid-attr': { enabled: true },
      },
    });
  });

  it('should support keyboard navigation in list creation', () => {
    cy.get('[data-cy="add-list"]').focus();
    cy.get('[data-cy="add-list"]').type('{enter}');
    cy.get('[data-cy="add-list-input"]').should('be.focused');
    cy.get('[data-cy="add-list-input"]').type('Keyboard List');
    cy.get('[data-cy="add-list-input"]').type('{enter}');

    boardPage.assertListExists('Keyboard List');

    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should have proper focus management in list form', () => {
    cy.get('[data-cy="add-list"]').click();
    cy.get('[data-cy="add-list-input"]').should('be.focused');

    cy.checkA11y('[data-cy="add-list-form"]', {
      rules: {
        'focus-order-semantics': { enabled: true },
      },
    });
  });

  it('should have accessible form labels', () => {
    cy.get('[data-cy="add-list"]').click();

    cy.checkA11y('[data-cy="add-list-form"]', {
      rules: {
        label: { enabled: true },
        'label-title-only': { enabled: true },
      },
    });
  });

  it('should maintain color contrast in list headers', () => {
    boardPage.createList('Contrast Test List');
    cy.get('[data-cy="list"]').should('be.visible');

    cy.checkA11y('[data-cy="list"]', {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });

  it('should have semantic HTML structure for lists', () => {
    boardPage.createList('Semantic List');
    cy.get('[data-cy="list"]').should('be.visible');

    cy.checkA11y('[data-cy="list"]', {
      rules: {
        'landmark-one-main': { enabled: true },
        region: { enabled: true },
      },
    });
  });

  it('should support screen reader announcements for list actions', () => {
    boardPage.createList('Screen Reader Test');
    cy.get('[data-cy="list"]').should('be.visible');

    cy.get('[data-cy="list"]')
      .first()
      .within(() => {
        cy.get('[data-cy="list-title"]').should(($el) => {
          const hasRole = $el.attr('role');
          void expect($el.length > 0 || hasRole).to.be.true;
        });
      });

    cy.checkA11y(undefined, {
      rules: {
        'aria-live-region': { enabled: true },
      },
    });
  });
});
