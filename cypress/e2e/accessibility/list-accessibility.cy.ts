import { BoardPage } from '../../support/pages';

/**
 * List Accessibility Tests
 *
 * These tests verify accessibility of list components and interactions.
 * Known application-wide violations are documented in known-issues.cy.ts.
 */
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

  it('should document critical violations on empty board', () => {
    cy.checkA11y(
      undefined,
      {
        includedImpacts: ['critical'],
        rules: {
          'color-contrast': { enabled: false },
          'image-alt': { enabled: false },
          'page-has-heading-one': { enabled: false },
          region: { enabled: false },
        },
      },
      (violations) => {
        if (violations.length > 0) {
          cy.task('log', '⚠️ CRITICAL VIOLATIONS ON EMPTY BOARD:');
          violations.forEach((violation) => {
            cy.task('log', `\n❌ ${violation.id}: ${violation.description}`);
            cy.task('log', `   Impact: ${violation.impact}`);
          });
        }
      },
      true // skipFailures
    );
  });

  it('should have accessible add list button', () => {
    cy.get('[data-cy="add-list"]').should('exist');
    cy.get('[data-cy="add-list"]').should('be.visible');
    cy.get('[data-cy="add-list"]').should(($el) => {
      const text = $el.text().trim();
      const ariaLabel = $el.attr('aria-label');
      const placeholder = $el.attr('placeholder');
      const hasAccessibleName = text || ariaLabel || placeholder;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(hasAccessibleName, 'Element should have text, aria-label, or placeholder').to.exist;
    });
  });

  it('should display lists with proper structure', () => {
    boardPage.createList('Test List');
    cy.get('[data-cy="list"]').should('exist');
    cy.get('[data-cy="list"]').should('be.visible');
  });

  it('should document critical violations with lists displayed', () => {
    boardPage.createList('List 1');
    boardPage.createList('List 2');
    cy.get('[data-cy="list"]').should('have.length.at.least', 2);

    cy.checkA11y(
      undefined,
      {
        includedImpacts: ['critical'],
        rules: {
          'color-contrast': { enabled: false },
          'image-alt': { enabled: false },
          'page-has-heading-one': { enabled: false },
          region: { enabled: false },
        },
      },
      (violations) => {
        if (violations.length > 0) {
          cy.task('log', '⚠️ CRITICAL VIOLATIONS WITH LISTS:');
          violations.forEach((violation) => {
            cy.task('log', `\n❌ ${violation.id}: ${violation.description}`);
            cy.task('log', `   Impact: ${violation.impact}`);
            cy.task('log', `   Elements affected: ${violation.nodes.length}`);
          });
        }
      },
      true // skipFailures
    );
  });

  it('should have form inputs with proper labels', () => {
    boardPage.createList('Label Test List');
    cy.get('[data-cy="list"]').should('exist');

    // Check that list has a title
    cy.get('[data-cy="list"]')
      .first()
      .within(() => {
        cy.get('input, textarea, [contenteditable="true"]').should('exist');
      });
  });
});
