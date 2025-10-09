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
