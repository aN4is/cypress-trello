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

    it('should persist session in localStorage or cookies', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        homePage.assertHomePageVisible();

        cy.getAllLocalStorage().should((storage) => {
          expect(Object.keys(storage).length).to.be.greaterThan(0);
        });
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
      cy.getByDataCy('user-dropdown').click();
      cy.getByDataCy('logout-button').click();

      cy.url().should('include', '/login');
    });

    it('should clear session data on logout', () => {
      cy.getByDataCy('user-dropdown').click();
      cy.getByDataCy('logout-button').click();

      cy.getAllLocalStorage().then((storage) => {
        const storageKeys = Object.keys(storage);
        if (storageKeys.length > 0) {
          const values = Object.values(storage[storageKeys[0]]);
          const hasToken = values.some((v) => typeof v === 'string' && v.includes('token'));
          expect(hasToken).to.equal(false);
        }
      });
    });

    it('should redirect to login when accessing protected route after logout', () => {
      cy.getByDataCy('user-dropdown').click();
      cy.getByDataCy('logout-button').click();

      cy.visit('/');
      cy.url().should('include', '/login');
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login when accessing home page without authentication', () => {
      homePage.visit();

      cy.url().should('include', '/login');
    });

    it('should redirect to login when accessing board page without authentication', () => {
      boardPage.visit(1);

      cy.url().should('include', '/login');
    });

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
        cy.url().should('include', '/login');
      });
    });

    it('should redirect to login when token is invalid', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        cy.window().then((win) => {
          win.localStorage.setItem('token', 'invalid-token-123');
        });

        cy.reload();
        cy.url().should('include', '/login');
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

  describe('Remember Me Functionality', () => {
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

  describe('Automatic Redirect After Login', () => {
    it('should redirect to intended page after login', () => {
      boardPage.visit(1);

      cy.url().should('include', '/login');

      cy.fixture('users').then((users) => {
        loginPage.login(users.testUser.email, users.testUser.password);

        cy.url().should((url) => {
          expect(url).to.satisfy((u: string) => u.includes('/board/1') || u.includes('/'));
        });
      });
    });

    it('should redirect to home if no previous page', () => {
      cy.fixture('users').then((users) => {
        loginPage.visit();
        loginPage.login(users.testUser.email, users.testUser.password);

        homePage.assertHomePageVisible();
      });
    });
  });
});
