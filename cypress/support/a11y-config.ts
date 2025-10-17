/**
 * Shared accessibility testing configuration for axe-core
 *
 * This configuration excludes known base-level violations that affect the entire application,
 * allowing tests to focus on component-specific accessibility issues.
 */

/**
 * Axe configuration that excludes known application-wide violations
 * Use this for component-specific accessibility testing
 */
export const axeConfigExcludeKnownIssues = {
  rules: {
    'color-contrast': { enabled: false }, // Known issue: Login button contrast
    'image-alt': { enabled: false }, // Known issue: Logo and images missing alt text
    'page-has-heading-one': { enabled: false }, // Known issue: Missing h1 heading
    region: { enabled: false }, // Known issue: Missing landmark regions
  },
};

/**
 * Axe configuration for testing specific rules only
 * Use this to enable only the rules you want to test
 */
export const axeConfigSpecificRules = (ruleIds: string[]) => ({
  rules: ruleIds.map((id) => ({ id, enabled: true })),
});

/**
 * Common axe options for consistent testing
 */
export const axeOptions = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  },
};
