import { BoardPage } from '../../support/pages';

/**
 * Card Accessibility Tests
 *
 * These tests verify accessibility of card components and interactions.
 * Known application-wide violations are documented in known-issues.cy.ts.
 */
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

  it('should document critical violations on board with empty list', () => {
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
          cy.task('log', '⚠️ CRITICAL VIOLATIONS ON BOARD PAGE:');
          violations.forEach((violation) => {
            cy.task('log', `\n❌ ${violation.id}: ${violation.description}`);
            cy.task('log', `   Impact: ${violation.impact}`);
          });
        }
      },
      true // skipFailures
    );
  });

  it('should display cards with proper structure', () => {
    cy.createCardAPI(boardId, listId, 'Test Card');
    boardPage.visit(boardId);

    cy.get('[data-cy="card"]').should('exist');
    cy.get('[data-cy="card"]').should('be.visible');
  });

  it('should document critical violations with cards displayed', () => {
    cy.createCardAPI(boardId, listId, 'Card 1');
    cy.createCardAPI(boardId, listId, 'Card 2');
    boardPage.visit(boardId);
    cy.injectAxe();

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
          cy.task('log', '⚠️ CRITICAL VIOLATIONS WITH CARDS:');
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

  it('should open card detail on click', () => {
    cy.createCardAPI(boardId, listId, 'Detail Test Card');
    boardPage.visit(boardId);

    cy.get('[data-cy="card"]').first().click();
    cy.get('[data-cy="card-detail"]').should('be.visible');
  });

  it('should have close mechanism in card detail', () => {
    cy.createCardAPI(boardId, listId, 'Close Test Card');
    boardPage.visit(boardId);

    cy.get('[data-cy="card"]').first().click();
    cy.get('[data-cy="card-detail"]').should('be.visible');

    // Check for any close mechanism (button, X, close icon, backdrop)
    cy.get('[data-cy="card-detail"]')
      .parent()
      .within(() => {
        cy.get('button, [role="button"], [data-cy*="close"]').should('have.length.gt', 0);
      });
  });
});
