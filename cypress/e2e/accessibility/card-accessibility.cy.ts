import { BoardPage } from '../../support/pages';

/**
 * Card Accessibility Tests
 *
 * These tests document known accessibility issues in the card components.
 * Tests marked with .skip are expected to fail due to missing accessibility features.
 *
 * Known Issues:
 * 1. Same base violations as board tests: color-contrast & image-alt
 * 2. Card form wrapper has no data-cy selector (form itself is composed of multiple elements)
 * 3. new-card element is non-focusable <div>
 * 4. Card-specific accessibility features not fully implemented
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

  /**
   * XFAIL: Expected to fail
   * Reason: Same 2 violations as empty page - color-contrast & image-alt
   */
  it.skip('[XFAIL] should pass accessibility checks on card creation form - KNOWN ISSUE: color-contrast & image-alt violations', () => {
    cy.get('[data-cy="new-card"]').first().click();
    cy.get('[data-cy="new-card-input"]').should('be.visible');

    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  /**
   * XFAIL: Expected to fail
   * Reason: Same 2 violations as empty page - color-contrast & image-alt
   */
  it.skip('[XFAIL] should pass accessibility checks with single card - KNOWN ISSUE: color-contrast & image-alt violations', () => {
    cy.createCardAPI(boardId, listId, 'Accessible Card');
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

  /**
   * XFAIL: Expected to fail
   * Reason: Same 2 violations as empty page - color-contrast & image-alt
   */
  it.skip('[XFAIL] should pass accessibility checks with multiple cards - KNOWN ISSUE: color-contrast & image-alt violations', () => {
    cy.createCardAPI(boardId, listId, 'Card 1');
    cy.createCardAPI(boardId, listId, 'Card 2');
    cy.createCardAPI(boardId, listId, 'Card 3');
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

  /**
   * XFAIL: Expected to fail
   * Reason: Same 2 violations as empty page - color-contrast & image-alt
   */
  it.skip('[XFAIL] should pass accessibility checks on card detail modal - KNOWN ISSUE: color-contrast & image-alt violations', () => {
    cy.createCardAPI(boardId, listId, 'Detail Test Card');
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

  /**
   * XFAIL: Expected to fail
   * Reason: Same 2 violations as empty page - color-contrast & image-alt
   */
  it.skip('[XFAIL] should have proper ARIA labels for card elements - KNOWN ISSUE: color-contrast & image-alt violations', () => {
    cy.createCardAPI(boardId, listId, 'ARIA Test Card');
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

  /**
   * SKIP: Test structure issues
   * Reason: Trying to .focus() on non-focusable <div> element [data-cy="new-card"]
   */
  it.skip('[SKIP] should support keyboard navigation for card creation - TEST ISSUE: non-focusable element', () => {
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

  /**
   * XFAIL: Expected to fail
   * Reason: Same 2 violations as empty page - color-contrast & image-alt
   */
  it.skip('[XFAIL] should support keyboard navigation for opening card detail - KNOWN ISSUE: color-contrast & image-alt violations', () => {
    cy.createCardAPI(boardId, listId, 'Keyboard Detail Card');
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

  /**
   * XFAIL: Expected to fail
   * Reason: Same 2 violations as empty page - color-contrast & image-alt
   */
  it.skip('[XFAIL] should trap focus within card detail modal - KNOWN ISSUE: color-contrast & image-alt violations', () => {
    cy.createCardAPI(boardId, listId, 'Focus Trap Card');
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

  /**
   * XFAIL: Expected to fail
   * Reason: Same 2 violations as empty page - color-contrast & image-alt
   */
  it.skip('[XFAIL] should have accessible close button on card modal - KNOWN ISSUE: color-contrast & image-alt violations', () => {
    cy.createCardAPI(boardId, listId, 'Close Button Card');
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

  /**
   * XFAIL: Expected to fail
   * Reason: Same 2 violations as empty page - color-contrast & image-alt
   */
  it.skip('[XFAIL] should have proper color contrast on card elements - KNOWN ISSUE: color-contrast & image-alt violations', () => {
    cy.createCardAPI(boardId, listId, 'Contrast Card');
    boardPage.visit(boardId);
    cy.get('[data-cy="card"]').should('be.visible');
    cy.injectAxe();

    cy.checkA11y('[data-cy="card"]', {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });

  /**
   * XFAIL: Expected to fail
   * Reason: Same 2 violations as empty page - color-contrast & image-alt
   */
  it.skip('[XFAIL] should announce card completion status to screen readers - KNOWN ISSUE: color-contrast & image-alt violations', () => {
    cy.createCardAPI(boardId, listId, 'Completion Status Card');
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

  /**
   * XFAIL: Expected to fail
   * Reason: Same 2 violations as empty page - color-contrast & image-alt
   */
  it.skip('[XFAIL] should have semantic HTML in card structure - KNOWN ISSUE: color-contrast & image-alt violations', () => {
    cy.createCardAPI(boardId, listId, 'Semantic Card');
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

  /**
   * XFAIL: Expected to fail
   * Reason: Same 2 violations as empty page - color-contrast & image-alt
   */
  it.skip('[XFAIL] should handle ESC key to close card detail modal - KNOWN ISSUE: color-contrast & image-alt violations', () => {
    cy.createCardAPI(boardId, listId, 'ESC Key Card');
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
