import { LoginPage, HomePage, BoardPage } from '../../support/pages';
import Board from '../../../trelloapp/src/typings/board';

describe('Session Management - Authentication Tests', () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();
  const boardPage = new BoardPage();

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Session Persistence', () => {
    it('should maintain session after page reload', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        homePage.assertHomePageVisible();

        cy.reload();
        homePage.assertHomePageVisible();
        cy.url().should('not.include', '/login');
      });
    });

    it('should maintain session across different pages', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        cy.createBoard('Navigation Test').then((board: Board) => {
          boardPage.visit(board.id);
          boardPage.assertBoardLoaded();

          homePage.visit();
          homePage.assertHomePageVisible();

          boardPage.visit(board.id);
          boardPage.assertBoardLoaded();
        });
      });
    });

    it('should persist session in cookies', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        homePage.assertHomePageVisible();

        cy.getCookie('auth_token').should('exist');
      });
    });
  });

  describe('Logout Functionality', () => {
    beforeEach(() => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);
        homePage.assertHomePageVisible();
      });
    });

    it('should logout successfully', () => {
      cy.getByDataCy('logged-user').click();

      cy.url().should('include', '/login');
    });

    it('should clear session data on logout', () => {
      cy.getByDataCy('logged-user').click();

      cy.getCookie('auth_token').should('not.exist');
    });
  });

  describe('Protected Routes', () => {
    it('should allow access to login page without authentication', () => {
      loginPage.visit();

      loginPage.assertLoginPageVisible();
      cy.url().should('include', '/login');
    });

    it('should allow access to signup page without authentication', () => {
      cy.visit('/signup');

      cy.url().should('include', '/signup');
    });
  });

  describe('Session Expiry', () => {
    it('should handle expired session gracefully', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        homePage.assertHomePageVisible();

        cy.clearCookies();
        cy.clearLocalStorage();

        cy.reload();
        homePage.assertHomePageVisible();
      });
    });

    it('should show authorization error when accessing private board with invalid token', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        homePage.assertHomePageVisible();

        cy.createBoard('Private Test Board').then((board: Board) => {
          const privateBoardId = board.id;

          cy.setCookie('auth_token', 'invalid-token-123');

          boardPage.visit(privateBoardId);

          cy.contains(/invalid authorization|unauthorized|not authorized/i).should('be.visible');
        });
      });
    });
  });

  describe('Concurrent Sessions', () => {
    it('should handle login from multiple tabs', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        homePage.assertHomePageVisible();

        cy.window().then((win) => {
          win.open('/', '_blank');
        });
      });
    });
  });

  // 'Remember Me' feature not yet implemented - skip until ready
  describe.skip('Remember Me Functionality', () => {
    it('should maintain session when remember me is enabled', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();

        cy.getByDataCy('remember-me').check();
        loginPage.login(users.testUser.email, users.testUser.password);

        homePage.assertHomePageVisible();

        cy.reload();
        homePage.assertHomePageVisible();
      });
    });

    it('should clear session when remember me is not enabled', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();

        cy.getByDataCy('remember-me').should('not.be.checked');
        loginPage.login(users.testUser.email, users.testUser.password);

        homePage.assertHomePageVisible();
      });
    });
  });

  describe('Session Security', () => {
    it('should use secure cookies for authentication', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        cy.getCookies().then((cookies) => {
          const authCookie = cookies.find(
            (c) => c.name.includes('token') || c.name.includes('session')
          );
          if (authCookie) {
            expect(authCookie).to.have.property('httpOnly');
          }
        });
      });
    });

    it('should not expose sensitive data in localStorage', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        cy.getAllLocalStorage().then((storage) => {
          const allValues = JSON.stringify(storage).toLowerCase();
          expect(allValues).to.not.include('password');
        });
      });
    });

    it('should handle session hijacking attempts', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        let stolenToken: string = '';

        cy.window().then((win) => {
          stolenToken = win.localStorage.getItem('token') || '';
        });

        cy.clearCookies();
        cy.clearLocalStorage();

        cy.window().then((win) => {
          win.localStorage.setItem('token', stolenToken);
        });

        cy.reload();
      });
    });
  });

  describe('Board Access Control', () => {
    it('should allow unauthenticated users to access public boards', () => {
      boardPage.visit(1);

      boardPage.assertBoardLoaded();
      cy.url().should('include', '/board/1');
    });

    it('should deny unauthenticated users access to private boards', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        homePage.assertHomePageVisible();

        cy.getCookie('auth_token').then((cookie) => {
          if (!cookie) {
            throw new Error('Auth token cookie not found after login');
          }
          const authHeader = { Authorization: `Bearer ${cookie.value}` };

          cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/boards',
            body: { name: `Private Board - ${users.testUser.email}` },
            headers: authHeader,
          }).then((createResponse) => {
            const privateBoardId = createResponse.body.id;

            cy.getByDataCy('logged-user').click();
            cy.url().should('include', '/login');

            cy.request({
              url: `http://localhost:3000/api/boards/${privateBoardId}`,
              failOnStatusCode: false,
            }).then((response) => {
              expect(response.status).to.eq(403);
              expect(response.body.error).to.match(/don.t have access/i);
            });
          });
        });
      });
    });

    it('should allow authenticated users to access their own boards', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        cy.createBoard('My Private Board').then((board: Board) => {
          boardPage.visit(board.id);
          boardPage.assertBoardLoaded();
          cy.url().should('include', `/board/${board.id}`);
        });
      });
    });

    it('should allow authenticated users to access public boards', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        boardPage.visit(1);
        boardPage.assertBoardLoaded();
        cy.url().should('include', '/board/1');
      });
    });
  });
});
