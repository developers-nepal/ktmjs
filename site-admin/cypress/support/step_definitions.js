import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

When(`I visit {string} page`, (pageName) => {
  cy.visit(`${Cypress.env("applicationURL")}/${pageName}`);
});

Then(`I should see {string} in navigation bar`, (label) => {
  cy.get('nav').contains(label);
});

Then(`I remove the details`, () => {
  cy.contains("Remove").should('exist').click();
})