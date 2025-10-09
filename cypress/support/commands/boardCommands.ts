import Board from 'trelloapp/src/typings/board';
import List from 'trelloapp/src/typings/list';
import Card from 'trelloapp/src/typings/card';

// Board API commands
Cypress.Commands.add('createBoard', (boardName: string) => {
  return cy.request('POST', '/api/boards', { name: boardName }).then((response) => {
    return response.body;
  });
});

Cypress.Commands.add('getBoards', () => {
  return cy.request('GET', '/api/boards').then((response) => {
    return response.body;
  });
});

Cypress.Commands.add('deleteBoard', (boardId: number): void => {
  cy.request('DELETE', `/api/boards/${boardId}`).then(() => {});
});

Cypress.Commands.add(
  'updateBoard',
  (boardId: number, updates: { name?: string; starred?: boolean }) => {
    return cy.request('PATCH', `/api/boards/${boardId}`, updates).then((response) => {
      return response.body;
    });
  }
);

// Data builder commands
Cypress.Commands.add('createBoardWithLists', (boardName: string, listNames: string[]) => {
  return cy.createBoard(boardName).then((board) => {
    return listNames
      .reduce(
        (chain: Cypress.Chainable<List[]>, listName: string) => {
          return chain.then((lists: List[]) => {
            return cy.createList(board.id, listName).then((newList: List) => {
              return [...lists, newList];
            });
          });
        },
        cy.wrap([] as List[])
      )
      .then((lists) => {
        return { board, lists };
      });
  });
});

Cypress.Commands.add(
  'createBoardWithListsAndCards',
  (boardName: string, listsWithCards: { listName: string; cards: string[] }[]) => {
    return cy.createBoard(boardName).then((board: Board) => {
      type ListWithCards = List & { cards: Card[] };

      return listsWithCards
        .reduce(
          (
            chain: Cypress.Chainable<ListWithCards[]>,
            listData: { listName: string; cards: string[] }
          ) => {
            return chain.then((accumulatedLists: ListWithCards[]) => {
              return cy.createList(board.id, listData.listName).then((createdList: List) => {
                return listData.cards
                  .reduce(
                    (cardChain: Cypress.Chainable<Card[]>, cardName: string) => {
                      return cardChain.then((cards: Card[]) => {
                        return cy
                          .createCard(board.id, createdList.id, cardName)
                          .then((newCard: Card) => {
                            return [...cards, newCard];
                          });
                      });
                    },
                    cy.wrap([] as Card[])
                  )
                  .then((cards: Card[]) => {
                    const listWithCards: ListWithCards = {
                      ...createdList,
                      cards,
                    };
                    return [...accumulatedLists, listWithCards];
                  });
              });
            });
          },
          cy.wrap([] as ListWithCards[])
        )
        .then((lists: ListWithCards[]) => {
          return { board, lists };
        });
    });
  }
);
