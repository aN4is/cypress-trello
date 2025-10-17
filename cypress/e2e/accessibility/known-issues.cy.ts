/**
 * Known Accessibility Issues
 *
 * This test suite documents known application-wide accessibility violations.
 * These issues are excluded from component-specific tests to allow focused testing
 * of component accessibility features.
 *
 * Priority issues for future remediation:
 * 1. color-contrast: Login button
 * 2. image-alt: Logo and application images
 * 3. page-has-heading-one: Missing main heading
 * 4. region: Missing landmark regions
 */

describe('Known Accessibility Issues', () => {
  it('should document color-contrast violation on login button', () => {
    cy.visit('/');
    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        rules: {
          'color-contrast': { enabled: true },
        },
        includedImpacts: ['critical', 'serious'],
      },
      (violations) => {
        const contrastViolations = violations.filter((v) => v.id === 'color-contrast');

        if (contrastViolations.length > 0) {
          cy.log('KNOWN ISSUE: Color contrast violations found');
          cy.log(`Found ${contrastViolations.length} color-contrast violation(s)`);
        } else {
          cy.log('No color-contrast violations found - issue may be fixed');
        }
      },
      true // Skip failure
    );
  });

  it('should document missing alt text on images', () => {
    cy.visit('/');
    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        rules: {
          'image-alt': { enabled: true },
        },
        includedImpacts: ['critical', 'serious'],
      },
      (violations) => {
        const imageAltViolations = violations.filter((v) => v.id === 'image-alt');

        if (imageAltViolations.length > 0) {
          cy.log('KNOWN ISSUE: Images missing alt text attributes');
          cy.log(`Found ${imageAltViolations.length} image-alt violation(s)`);
        } else {
          cy.log('No image-alt violations found - issue may be fixed');
        }
      },
      true // Skip failure
    );
  });

  it('should document missing h1 heading', () => {
    cy.visit('/');
    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        rules: {
          'page-has-heading-one': { enabled: true },
        },
        includedImpacts: ['critical', 'serious'],
      },
      (violations) => {
        const h1Violations = violations.filter((v) => v.id === 'page-has-heading-one');

        if (h1Violations.length > 0) {
          cy.log('KNOWN ISSUE: Page missing h1 heading element');
        } else {
          cy.log('No h1 violations found - issue may be fixed');
        }
      },
      true // Skip failure
    );
  });

  it('should document missing landmark regions', () => {
    cy.visit('/');
    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        rules: {
          region: { enabled: true },
        },
        includedImpacts: ['critical', 'serious'],
      },
      (violations) => {
        const regionViolations = violations.filter((v) => v.id === 'region');

        if (regionViolations.length > 0) {
          cy.log('KNOWN ISSUE: Content not contained within landmark regions');
          cy.log(`Found ${regionViolations.length} region violation(s)`);
        } else {
          cy.log('No region violations found - issue may be fixed');
        }
      },
      true // Skip failure
    );
  });
});
