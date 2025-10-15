import { HomePage } from '../../support/pages';

describe('Board Accessibility Tests', () => {
  const homePage = new HomePage();

  beforeEach(() => {
    cy.deleteAllBoards();
    cy.visit('/');
    cy.injectAxe();
  });

  it('should pass accessibility checks on empty board page', () => {
    cy.configureAxe({
      rules: [
        { id: 'color-contrast', enabled: true },
        { id: 'label', enabled: true },
        { id: 'button-name', enabled: true },
        { id: 'link-name', enabled: true },
      ],
    });

    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      },
    });
  });

  it('should pass accessibility checks on board creation modal', () => {
    homePage.clickCreateBoard();
    cy.get('[data-cy="new-board-modal"]').should('be.visible');

    cy.checkA11y('[data-cy="new-board-modal"]', {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should pass accessibility checks with single board displayed', () => {
    cy.createBoard('Accessible Board');
    cy.visit('/');
    cy.injectAxe();

    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should pass accessibility checks with multiple boards', () => {
    cy.createBoard('Board 1');
    cy.createBoard('Board 2');
    cy.createBoard('Board 3');
    cy.visit('/');
    cy.injectAxe();

    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should pass accessibility checks on starred boards section', () => {
    cy.createBoard('Starred Board').then(() => {
      cy.visit('/');
      cy.get(`[data-cy="board-item"]`).first().find('[data-cy="star-button"]').click();
      cy.injectAxe();

      cy.checkA11y('[data-cy="starred-boards"]', {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      });
    });
  });

  it.skip('should have proper focus indicators on interactive elements', () => {
    cy.createBoard('Focus Test Board');
    cy.visit('/');
    cy.injectAxe();

    cy.get('[data-cy="board-item"]').first().focus();
    cy.get('[data-cy="board-item"]').first().should('have.css', 'outline').and('not.equal', 'none');

    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should have proper ARIA labels for board actions', () => {
    cy.createBoard('ARIA Test Board');
    cy.visit('/');
    cy.injectAxe();

    cy.get('[data-cy="create-board-button"]').should(($el) => {
      const hasAriaLabel = $el.attr('aria-label');
      const hasText = $el.text();
      void expect(hasAriaLabel || hasText).to.exist;
    });
    cy.get('[data-cy="board-item"]')
      .first()
      .find('[data-cy="star-button"]')
      .should(($el) => {
        const hasAriaLabel = $el.attr('aria-label');
        const hasTitle = $el.attr('title');
        void expect(hasAriaLabel || hasTitle).to.exist;
      });

    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it.skip('should support keyboard navigation for board selection', () => {
    cy.createBoard('Keyboard Nav Board');
    cy.visit('/');
    cy.injectAxe();

    cy.get('body').type('{tab}');
    cy.focused().should('be.visible');

    cy.checkA11y(undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });

  it('should have proper heading structure', () => {
    cy.visit('/');
    cy.injectAxe();

    cy.checkA11y(undefined, {
      rules: {
        'heading-order': { enabled: true },
        'page-has-heading-one': { enabled: true },
      },
    });
  });

  it('should have proper color contrast ratios', () => {
    cy.createBoard('Contrast Test Board');
    cy.visit('/');
    cy.injectAxe();

    cy.checkA11y(undefined, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });
});
