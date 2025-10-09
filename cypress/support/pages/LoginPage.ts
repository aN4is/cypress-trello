import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly emailInput = '[data-cy="login-email"]';
  private readonly passwordInput = '[data-cy="login-password"]';
  private readonly submitButton = '[data-cy="login-submit"]';
  private readonly signupLink = 'a[href="/signup"]';

  visit(): void {
    cy.visit('/login');
  }

  fillEmail(email: string): this {
    this.clearAndType(this.emailInput, email);
    return this;
  }

  fillPassword(password: string): this {
    this.clearAndType(this.passwordInput, password);
    return this;
  }

  submit(): this {
    this.clickElement(this.submitButton);
    return this;
  }

  login(email: string, password: string): this {
    this.fillEmail(email).fillPassword(password).submit();
    return this;
  }

  goToSignup(): void {
    this.clickElement(this.signupLink);
  }

  assertLoginPageVisible(): this {
    this.getByDataCy('login-email').should('be.visible');
    this.getByDataCy('login-password').should('be.visible');
    this.getByDataCy('login-submit').should('be.visible');
    return this;
  }
}
