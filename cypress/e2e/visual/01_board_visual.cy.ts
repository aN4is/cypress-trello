import { HomePage, BoardPage } from '../../support/pages';
import { setupApplitoolsTest, teardownApplitoolsTest } from '../../support/visual/applitoolsHelper';
import { VISUAL_TEST_DATA } from '../../support/constants/visualTestData';
import Board from '../../../trelloapp/src/typings/board';

describe('Board Visual Regression Tests', () => {
  const homePage = new HomePage();
  const boardPage = new BoardPage();

  beforeEach(() => {
    cy.deleteAllBoards();
    setupApplitoolsTest(Cypress.currentTest.title);
  });

  afterEach(() => {
    teardownApplitoolsTest();
  });

  it('Empty home page', () => {
    homePage.visit();
    cy.eyesCheckWindow('Empty Home Page');
  });

  it('Board creation modal', () => {
    homePage.visit();
    cy.getByDataCy('first-board').click();
    cy.eyesCheckWindow('Board Creation Modal');
  });

  it('Newly created board', () => {
    homePage.visit();
    homePage.createFirstBoard('Visual Test Board');
    boardPage.assertBoardLoaded();
    cy.eyesCheckWindow('Empty Board View');
  });

  it('Starred board', () => {
    cy.createBoard('Starred Board').then((board: Board) => {
      boardPage.visit(board.id);
      boardPage.assertBoardLoaded();
      boardPage.toggleStar();
      cy.eyesCheckWindow('Board with Star Active');
    });
  });

  it('Multiple boards on home page', () => {
    cy.createBoard('Board 1');
    cy.createBoard('Board 2');
    cy.createBoard('Board 3');
    homePage.visit();
    cy.eyesCheckWindow('Multiple Boards');
  });

  it('Board with long title', () => {
    homePage.visit();
    homePage.createFirstBoard(VISUAL_TEST_DATA.LONG_TITLES.BOARD);
    boardPage.assertBoardLoaded();
    cy.eyesCheckWindow('Board with Long Title');
  });

  it('Board with special characters', () => {
    const specialTitle = `${VISUAL_TEST_DATA.SPECIAL_CHARACTERS.CHINESE} Board ${VISUAL_TEST_DATA.SPECIAL_CHARACTERS.EMOJI} Special ${VISUAL_TEST_DATA.SPECIAL_CHARACTERS.SYMBOLS}`;
    homePage.visit();
    homePage.createFirstBoard(specialTitle);
    boardPage.assertBoardLoaded();
    cy.eyesCheckWindow('Board with Special Characters');
  });
});
