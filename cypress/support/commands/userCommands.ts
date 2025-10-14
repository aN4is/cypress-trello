export {};
// User API commands
Cypress.Commands.add('signup', (email: string, password: string) => {
  return cy.request('POST', '/api/signup', { email, password }).then((response) => {
    return response.body;
  });
});

Cypress.Commands.add('apiLogin', (email: string, password: string) => {
  return cy.request('POST', '/api/login', { email, password }).then((response) => {
    return response.body;
  });
});

Cypress.Commands.add('ensureUserExists', (email: string, password: string) => {
  cy.readFile('../../../trelloapp/backend/data/database.json').then((db: any) => {
    const userExists = db.users.some((user: any) => user.email === email);

    if (!userExists) {
      cy.log(`User ${email} does not exist in database, signing up...`);
      cy.signup(email, password);
    } else {
      cy.log(`User ${email} already exists in database`);
    }
  });
});
