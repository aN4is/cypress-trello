describe('API Data Setup - Smoke Test', () => {
  beforeEach(() => {
    cy.deleteAllBoards();
  });

  it('should reset database', () => {
    cy.createBoard('Test Board');
    cy.getBoards().then((boards) => {
      expect(boards.length).to.be.greaterThan(0);
    });

    cy.resetDatabase();

    cy.getBoards().then((boards) => {
      expect(boards).to.have.length(0);
    });
  });

  it('should create board via API', () => {
    cy.createBoard('API Created Board').then((board) => {
      expect(board).to.have.property('id');
      expect(board).to.have.property('name', 'API Created Board');
      expect(board).to.have.property('starred', false);
    });
  });

  it('should update board via API', () => {
    cy.createBoard('Original Name').then((board) => {
      cy.updateBoard(board.id, { name: 'Updated Name', starred: true }).then((updated) => {
        expect(updated).to.have.property('name', 'Updated Name');
        expect(updated).to.have.property('starred', true);
      });
    });
  });

  it('should create lists and cards via API', () => {
    cy.createBoard('Test Board').then((board) => {
      cy.createList(board.id, 'List 1').then((list) => {
        cy.createCard(board.id, list.id, 'Card 1').then((card) => {
          expect(card).to.have.property('name', 'Card 1');
          expect(card).to.have.property('listId', list.id);
          expect(card).to.have.property('boardId', board.id);
        });
      });
    });
  });

  it('should use data builder command', () => {
    cy.fixture('lists').then((lists) => {
      cy.createBoardWithLists('Builder Board', lists.kanbanLists).then((result) => {
        expect(result.board).to.have.property('name', 'Builder Board');
        expect(result.lists).to.have.length(lists.kanbanLists.length);

        result.lists.forEach((list, index) => {
          expect(list).to.have.property('name', lists.kanbanLists[index]);
        });
      });
    });
  });
});
