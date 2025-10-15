import Board from '../../../trelloapp/src/typings/board';

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

// UI Helper Commands
Cypress.Commands.add('getByDataCy', (dataCy: string) => {
  return cy.get(`[data-cy="${dataCy}"]`);
});

// Visual Test Helper Commands
Cypress.Commands.add('setupBoardForVisualTest', (boardName: string) => {
  return cy.createBoard(boardName).then((board: Board) => {
    cy.visit(`/board/${board.id}`);
    cy.getByDataCy('board-detail').should('be.visible');
    return cy.wrap(board);
  });
});

Cypress.Commands.add('markCardComplete', (cardId: number): void => {
  cy.request('PATCH', `/api/cards/${cardId}`, {
    completed: true,
  });
});
