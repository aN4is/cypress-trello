import { BoardPage } from '../../support/pages';
import { setupApplitoolsTest, teardownApplitoolsTest } from '../../support/visual/applitoolsHelper';
import { VISUAL_TEST_DATA } from '../../support/constants/visualTestData';

describe('List Visual Regression Tests', () => {
  const boardPage = new BoardPage();

  beforeEach(() => {
    cy.deleteAllBoards();
    setupApplitoolsTest(Cypress.currentTest.title);
  });

  afterEach(() => {
    teardownApplitoolsTest();
  });

  it('Board with single list', () => {
    cy.createBoardWithLists(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, ['To Do']).then((result) => {
      boardPage.visit(result.board.id);
      boardPage.assertBoardLoaded();
      cy.eyesCheckWindow('Board with Single List');
    });
  });

  it('Board with multiple lists', () => {
    cy.createBoardWithLists(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, [
      'To Do',
      'In Progress',
      'Done',
    ]).then((result) => {
      boardPage.visit(result.board.id);
      boardPage.assertBoardLoaded();
      cy.eyesCheckWindow('Board with Multiple Lists');
    });
  });

  it('List creation form', () => {
    cy.setupBoardForVisualTest(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD).then(() => {
      cy.getByDataCy('add-list-input').click();
      cy.eyesCheckWindow('List Creation Form Active');
    });
  });

  it('List with long title', () => {
    cy.createBoardWithLists(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, [
      VISUAL_TEST_DATA.LONG_TITLES.LIST,
    ]).then((result) => {
      boardPage.visit(result.board.id);
      boardPage.assertBoardLoaded();
      cy.eyesCheckWindow('List with Long Title');
    });
  });

  it('Board with many lists requiring scroll', () => {
    const listNames = Array.from({ length: 10 }, (_, i) => `List ${i + 1}`);
    cy.createBoardWithLists(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, listNames).then((result) => {
      boardPage.visit(result.board.id);
      boardPage.assertBoardLoaded();
      cy.eyesCheckWindow({
        tag: 'Board with Many Lists',
        scrollRootElement: 'body',
      });
    });
  });

  it('Empty list placeholder', () => {
    cy.createBoardWithLists(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, ['Empty List']).then(
      (result) => {
        boardPage.visit(result.board.id);
        boardPage.assertBoardLoaded();
        cy.eyesCheckWindow('Empty List Placeholder');
      }
    );
  });

  it('List with special characters', () => {
    const specialListName = `${VISUAL_TEST_DATA.SPECIAL_CHARACTERS.CHINESE} List ${VISUAL_TEST_DATA.SPECIAL_CHARACTERS.EMOJI} ${VISUAL_TEST_DATA.SPECIAL_CHARACTERS.SYMBOLS}`;
    cy.createBoardWithLists(VISUAL_TEST_DATA.STANDARD_NAMES.BOARD, [specialListName]).then(
      (result) => {
        boardPage.visit(result.board.id);
        boardPage.assertBoardLoaded();
        cy.eyesCheckWindow('List with Special Characters');
      }
    );
  });
});
