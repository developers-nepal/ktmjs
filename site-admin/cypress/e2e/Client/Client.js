import { When, Then } from "cypress-cucumber-preprocessor/steps";

Given(`I am on the {string}`, (url) => {
  cy.visit(`${Cypress.env("clientURL")}`);
  cy.get('.logo').should('exist').should('be.visible')
});

Then(`session number {string} should be visible`, (Session__Number) => {
 cy.get('.Session__Number').should('exist').should('be.visible')
});

Then(`meetup date {string} should be present`, (Meetup__Date) => {
  cy.get('.Meetup__Date').should('exist').should('be.visible')
});

Then(`session title {string} should be present and visible`, (Session__Title) => {
 cy.get('.Session__Title').should('be.visible')
});

Then(`session time {string} should exsist`, (Meetup__Date) => {
  cy.get('.Session__Time').should('exist');
});

Then(`session sponser should be present`, (Meetup__Date) => {
cy.get('.Panel__SponsorsAndSupporters').children().contains('Sponsors') 
});