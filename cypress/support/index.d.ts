import Board from 'trelloapp/src/typings/board';
import List from 'trelloapp/src/typings/list';
import Card from 'trelloapp/src/typings/card';

declare global {
  namespace Cypress {
    interface Chainable {
      // UI Helper commands
      getByDataCy(dataCy: string): Chainable<JQuery<HTMLElement>>;

      // Visual Test Helper commands
      setupBoardForVisualTest(boardName: string): Chainable<Board>;
      markCardComplete(cardId: number): Chainable<void>;

      // Database reset commands
      resetDatabase(): Chainable<void>;
      deleteAllBoards(): Chainable<void>;
      deleteAllLists(): Chainable<void>;
      deleteAllCards(): Chainable<void>;
      deleteAllUsers(): Chainable<void>;

      // Board commands
      createBoard(boardName: string): Chainable<Board>;
      getBoards(): Chainable<Board[]>;
      deleteBoard(boardId: number): Chainable<void>;
      updateBoard(boardId: number, updates: { name?: string; starred?: boolean }): Chainable<Board>;

      // List commands
      createList(boardId: number, listName: string): Chainable<List>;
      createListAPI(boardId: number, listName: string): Chainable<List>;
      getLists(boardId?: number): Chainable<List[]>;
      deleteList(listId: number): Chainable<void>;
      updateList(listId: number, updates: { name?: string }): Chainable<List>;

      // Card commands
      createCard(boardId: number, listId: number, cardName: string): Chainable<Card>;
      createCardAPI(boardId: number, listId: number, cardName: string): Chainable<Card>;
      updateCard(
        cardId: number,
        updates: { name?: string; completed?: boolean; listId?: number }
      ): Chainable<Card>;
      deleteCard(cardId: number): Chainable<void>;

      // User commands
      signup(email: string, password: string): Chainable<unknown>;
      apiLogin(email: string, password: string): Chainable<unknown>;
      ensureUserExists(email: string, password: string): Chainable<unknown>;

      // Data builder commands
      createBoardWithLists(
        boardName: string,
        listNames: string[]
      ): Chainable<{ board: Board; lists: List[] }>;
      createBoardWithListsAndCards(
        boardName: string,
        listsWithCards: { listName: string; cards: string[] }[]
      ): Chainable<{ board: Board; lists: List[] }>;
    }

    interface BoardData {
      board: { id: number };
      lists: {
        id: number;
        cards: string[];
      }[];
    }

    interface ListData {
      list: {
        boardId: number;
        name: string;
        created: string;
        id: number;
        cards: {
          cardName: string;
        }[];
      };
    }
  }
}

export {};
