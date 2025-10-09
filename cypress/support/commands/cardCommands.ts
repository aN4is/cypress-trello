export {};
// Card API commands
Cypress.Commands.add('createCard', (boardId: number, listId: number, cardName: string) => {
  return cy.request('POST', '/api/cards', { boardId, listId, name: cardName }).then((response) => {
    return response.body;
  });
});

Cypress.Commands.add(
  'updateCard',
  (cardId: number, updates: { name?: string; completed?: boolean; listId?: number }) => {
    return cy.request('PATCH', `/api/cards/${cardId}`, updates).then((response) => {
      return response.body;
    });
  }
);

Cypress.Commands.add('deleteCard', (cardId: number): void => {
  cy.request('DELETE', `/api/cards/${cardId}`).then(() => {});
});
