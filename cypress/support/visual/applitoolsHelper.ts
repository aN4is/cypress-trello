export function setupApplitoolsTest(testName: string): void {
  cy.eyesOpen({
    appName: 'Trelloapp',
    testName,
    browser: { width: 1920, height: 1080, name: 'chrome' },
  });
}

export function teardownApplitoolsTest(): void {
  cy.eyesClose();
}
