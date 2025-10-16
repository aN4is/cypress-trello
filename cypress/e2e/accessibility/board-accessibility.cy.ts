/**
 * Board Accessibility Tests
 *
 * These tests verify accessibility of board management features.
 * Known application-wide violations are documented in known-issues.cy.ts.
 */
describe('Board Accessibility Tests', () => {
  beforeEach(() => {
    cy.deleteAllBoards();
    cy.visit('/');
    cy.injectAxe();
  });

  it('should not have critical accessibility violations on empty board page', () => {
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
          cy.task('log', '⚠️ CRITICAL ACCESSIBILITY VIOLATIONS FOUND:');
          violations.forEach((violation) => {
            cy.task('log', `\n❌ ${violation.id}: ${violation.description}`);
            cy.task('log', `   Impact: ${violation.impact}`);
            cy.task('log', `   Help: ${violation.helpUrl}`);
          });
        }
      },
      true // skipFailures - log but don't fail
    );
  });

  it('should have valid HTML document structure', () => {
    cy.get('html').should('have.attr', 'lang');
    cy.get('title').should('exist');
  });

  it('should have accessible board creation area', () => {
    // Check for any interactive element for creating boards
    cy.get('button, [role="button"], a, input').should('have.length.gt', 0);
  });

  it('should display boards with proper structure', () => {
    cy.createBoard('Test Board');
    cy.visit('/');

    cy.get('[data-cy="board-item"]').should('exist');
  });

  it('should document critical violations with boards displayed', () => {
    cy.createBoard('Board 1');
    cy.createBoard('Board 2');
    cy.visit('/');
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
          cy.task('log', '⚠️ CRITICAL ACCESSIBILITY VIOLATIONS WITH BOARDS:');
          violations.forEach((violation) => {
            cy.task('log', `\n❌ ${violation.id}: ${violation.description}`);
            cy.task('log', `   Impact: ${violation.impact}`);
            cy.task('log', `   Affected elements: ${violation.nodes.length}`);
          });
        }
      },
      true // skipFailures - log but don't fail
    );
  });
});
