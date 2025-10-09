export {};
// API Helper Commands for data setup and teardown
Cypress.Commands.add('resetDatabase', () => {
  cy.request('POST', '/api/reset');
});

Cypress.Commands.add('deleteAllBoards', () => {
  cy.request('DELETE', '/api/boards');
});

Cypress.Commands.add('deleteAllLists', () => {
  cy.request('DELETE', '/api/lists');
});

Cypress.Commands.add('deleteAllCards', () => {
  cy.request('DELETE', '/api/cards');
});

Cypress.Commands.add('deleteAllUsers', () => {
  cy.request('DELETE', '/api/users');
});
