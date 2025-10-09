export {};
// List API commands
Cypress.Commands.add('createList', (boardId: number, listName: string) => {
  return cy.request('POST', '/api/lists', { boardId, name: listName }).then((response) => {
    return response.body;
  });
});

Cypress.Commands.add('getLists', (boardId?: number) => {
  const url = boardId ? `/api/lists?boardId=${boardId}` : '/api/lists';
  return cy.request('GET', url).then((response) => {
    return response.body;
  });
});

Cypress.Commands.add('deleteList', (listId: number): void => {
  cy.request('DELETE', `/api/lists/${listId}`).then(() => {});
});

Cypress.Commands.add('updateList', (listId: number, updates: { name?: string }) => {
  return cy.request('PATCH', `/api/lists/${listId}`, updates).then((response) => {
    return response.body;
  });
});
