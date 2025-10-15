import { BoardPage } from '../../support/pages';
import { setupApplitoolsTest, teardownApplitoolsTest } from '../../support/visual/applitoolsHelper';
import { VISUAL_TEST_DATA } from '../../support/constants/visualTestData';

describe('Card Visual Regression Tests', () => {
  const boardPage = new BoardPage();

  beforeEach(() => {
    cy.deleteAllBoards();
    setupApplitoolsTest(Cypress.currentTest.title);
  });

  afterEach(() => {
    teardownApplitoolsTest();
  });

  it('List with single card', () => {
    cy.createBoardWithListsAndCards(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, [
      { listName: 'To Do', cards: ['Task 1'] },
    ]).then((result) => {
      boardPage.visit(result.board.id);
      boardPage.assertBoardLoaded();
      cy.eyesCheckWindow('List with Single Card');
    });
  });

  it('List with multiple cards', () => {
    cy.createBoardWithListsAndCards(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, [
      { listName: 'To Do', cards: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'] },
    ]).then((result) => {
      boardPage.visit(result.board.id);
      boardPage.assertBoardLoaded();
      cy.eyesCheckWindow('List with Multiple Cards');
    });
  });

  it('Card detail modal', () => {
    cy.createBoardWithListsAndCards(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, [
      { listName: 'To Do', cards: ['Task 1'] },
    ]).then((result) => {
      boardPage.visit(result.board.id);
      boardPage.assertBoardLoaded();
      cy.getByDataCy('card').first().click();
      cy.eyesCheckWindow('Card Detail Modal Open');
    });
  });

  it('Card with long title', () => {
    cy.createBoardWithListsAndCards(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, [
      { listName: 'To Do', cards: [VISUAL_TEST_DATA.LONG_TITLES.CARD] },
    ]).then((result) => {
      boardPage.visit(result.board.id);
      boardPage.assertBoardLoaded();
      cy.eyesCheckWindow('Card with Long Title');
    });
  });

  it('Cards across multiple lists', () => {
    cy.createBoardWithListsAndCards(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, [
      { listName: 'To Do', cards: ['Task 1', 'Task 2', 'Task 3'] },
      { listName: 'In Progress', cards: ['Task 4', 'Task 5'] },
      { listName: 'Done', cards: ['Task 6'] },
    ]).then((result) => {
      boardPage.visit(result.board.id);
      boardPage.assertBoardLoaded();
      cy.eyesCheckWindow('Cards Across Multiple Lists');
    });
  });

  it('List with many cards requiring scroll', () => {
    const cards = Array.from({ length: 15 }, (_, i) => `Card ${i + 1}`);
    cy.createBoardWithListsAndCards(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, [
      { listName: 'To Do', cards: cards },
    ]).then((result) => {
      boardPage.visit(result.board.id);
      boardPage.assertBoardLoaded();
      cy.eyesCheckWindow({
        tag: 'List with Many Cards',
        scrollRootElement: 'body',
      });
    });
  });

  it('Card with special characters', () => {
    const specialCardTitle = `${VISUAL_TEST_DATA.SPECIAL_CHARACTERS.CHINESE} Card ${VISUAL_TEST_DATA.SPECIAL_CHARACTERS.EMOJI} ${VISUAL_TEST_DATA.SPECIAL_CHARACTERS.SYMBOLS}`;
    cy.createBoardWithListsAndCards(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, [
      { listName: 'To Do', cards: [specialCardTitle] },
    ]).then((result) => {
      boardPage.visit(result.board.id);
      boardPage.assertBoardLoaded();
      cy.eyesCheckWindow('Card with Special Characters');
    });
  });

  it('Card creation form', () => {
    cy.createBoardWithLists(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, ['To Do']).then((result) => {
      boardPage.visit(result.board.id);
      boardPage.assertBoardLoaded();
      cy.getByDataCy('new-card').first().click();
      cy.eyesCheckWindow('Card Creation Form Active');
    });
  });

  it('Completed card indicator', () => {
    cy.createBoardWithListsAndCards(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, [
      { listName: 'Done', cards: ['Completed Task'] },
    ]).then((result) => {
      const card = result.lists[0].cards[0];
      cy.markCardComplete(card.id);
      boardPage.visit(result.board.id);
      boardPage.assertBoardLoaded();
      cy.eyesCheckWindow('List with Completed Card');
    });
  });
});
