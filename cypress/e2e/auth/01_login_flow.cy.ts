import { LoginPage, HomePage } from '../../support/pages';

describe('Login Flow - Authentication Tests', () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  beforeEach(() => {
    loginPage.visit();
  });

  describe('Successful Login', () => {
    it('should login with valid credentials', () => {
      cy.fixture('users').then((users) => {
        loginPage.login(users.testUser.email, users.testUser.password);

        homePage.assertHomePageVisible();
      });
    });

    it('should display login form elements correctly', () => {
      loginPage.assertLoginPageVisible();
    });

    it('should navigate to signup page', () => {
      loginPage.goToSignup();

      cy.url().should('include', '/signup');
    });
  });

  describe('Invalid Credentials', () => {
    it('should not login with incorrect password', () => {
      cy.fixture('users').then((users) => {
        loginPage.login(users.testUser.email, 'WrongPassword123!');

        cy.url().should('include', '/login');
        cy.getByDataCy('login-error').should('be.visible');
      });
    });

    it('should not login with incorrect email', () => {
      cy.fixture('users').then((users) => {
        loginPage.login('wrong@example.com', users.testUser.password);

        cy.url().should('include', '/login');
        cy.getByDataCy('login-error').should('be.visible');
      });
    });

    it('should not login with non-existent user', () => {
      loginPage.login('nonexistent@example.com', 'RandomPassword123!');

      cy.url().should('include', '/login');
      cy.getByDataCy('login-error').should('be.visible');
    });
  });

  describe('Input Validation', () => {
    it('should not login with empty email', () => {
      cy.fixture('users').then((users) => {
        loginPage.fillPassword(users.testUser.password).submit();

        cy.url().should('include', '/login');
      });
    });

    it('should not login with empty password', () => {
      cy.fixture('users').then((users) => {
        loginPage.fillEmail(users.testUser.email).submit();

        cy.url().should('include', '/login');
      });
    });

    it('should not login with both fields empty', () => {
      loginPage.submit();

      cy.url().should('include', '/login');
    });

    it('should not login with invalid email format', () => {
      loginPage.login('invalid-email-format', 'Password123!');

      cy.url().should('include', '/login');
    });

    it('should handle email with special characters', () => {
      loginPage.login('user+test@example.com', 'Password123!');

      cy.url().should('include', '/login');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long email input', () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      loginPage.login(longEmail, 'Password123!');

      cy.url().should('include', '/login');
    });

    it('should handle very long password input', () => {
      const longPassword = 'P'.repeat(200);
      cy.fixture('users').then((users) => {
        loginPage.login(users.testUser.email, longPassword);

        cy.url().should('include', '/login');
      });
    });

    it('should handle password with special characters', () => {
      cy.fixture('users').then((users) => {
        loginPage.login(users.testUser.email, '!@#$%^&*()_+-=[]{}|;:,.<>?');

        cy.url().should('include', '/login');
      });
    });

    it('should handle email and password with leading/trailing spaces', () => {
      cy.fixture('users').then((users) => {
        loginPage.login(`  ${users.testUser.email}  `, `  ${users.testUser.password}  `);

        cy.url().should('include', '/login');
      });
    });

    it('should handle case-sensitive email', () => {
      cy.fixture('users').then((users) => {
        const upperCaseEmail = users.testUser.email.toUpperCase();
        loginPage.login(upperCaseEmail, users.testUser.password);

        cy.url().should('include', '/login');
      });
    });
  });

  describe('Security', () => {
    it('should mask password input', () => {
      cy.getByDataCy('login-password').should('have.attr', 'type', 'password');
    });

    it('should prevent SQL injection in email field', () => {
      loginPage.login("' OR '1'='1", "' OR '1'='1");

      cy.url().should('include', '/login');
    });

    it('should prevent XSS in email field', () => {
      loginPage.login('<script>alert("XSS")</script>', 'Password123!');

      cy.url().should('include', '/login');
    });
  });

  describe('Multiple Login Attempts', () => {
    it('should handle multiple failed login attempts', () => {
      for (let i = 0; i < 3; i++) {
        loginPage.login('wrong@example.com', 'WrongPassword');
        cy.url().should('include', '/login');
      }
    });
  });
});
