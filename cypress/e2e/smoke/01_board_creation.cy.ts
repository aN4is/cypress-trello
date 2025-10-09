import { HomePage, BoardPage } from '../../support/pages';

describe('Board Creation - Smoke Test', () => {
  const homePage = new HomePage();
  const boardPage = new BoardPage();

  it('should create a first board successfully', () => {
    cy.deleteAllBoards();
    homePage.visit();
    homePage.createFirstBoard('test');

    boardPage.assertBoardLoaded();
    boardPage.assertBoardTitle('test');
  });

  it('should create a new board successfully', () => {
    cy.fixture('boards').then((boards) => {
      homePage.visit();
      homePage.createBoard(boards.projectBoard.name);

      boardPage.assertBoardLoaded();
      boardPage.assertBoardTitle(boards.projectBoard.name);
    });
  });

  it('should create and star a board', () => {
    cy.fixture('boards').then((boards) => {
      cy.createBoard(boards.personalBoard.name).then((board) => {
        boardPage.visit(board.id);
        boardPage.assertBoardLoaded();
        boardPage.toggleStar();
        boardPage.assertStarred();
      });
    });
  });

  it('should rename a board', () => {
    cy.fixture('boards').then((boards) => {
      cy.createBoard(boards.projectBoard.name).then((board) => {
        boardPage.visit(board.id);
        boardPage.changeBoardTitle('Renamed Board');
        boardPage.assertBoardTitle('Renamed Board');
      });
    });
  });
});
