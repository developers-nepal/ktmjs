import { Given } from "cypress-cucumber-preprocessor/steps";


Given('fetching the list of customers', () => {
  cy.request("GET", Cypress.env("apiURL"), {
  }).then((response) => {
     expect(response.status).to.eq(200)
     expect(response).to.have.property('headers')
     expect(response).to.have.property('duration')
  });
})