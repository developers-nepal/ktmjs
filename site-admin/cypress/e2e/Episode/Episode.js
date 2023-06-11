import { When, Then } from "cypress-cucumber-preprocessor/steps";

Then(`I click the {string}`, (label) => {
  cy.contains(label).should('exist').click()
});

Then(`I fill form with episode details`, () => {
  cy.fixture('data.json').then((data) => {
    const { venue : {date, startsAt, endsAt}, company : {name, address}, session: {title, description, time}, person  } = data;
    cy.get('input[name="date"]').type(date);
    cy.get('input[name="startsAt"]').type(startsAt);
    cy.get('input[name="endsAt"]').type(endsAt);
    cy.get('#pac-s').type(name,{ force: true} );
    cy.get('input[name="venue[addr_line1]"]').type(address);
    cy.get('input[name="session[0][title]"]').type(title);
    cy.get('input[name="session[0][time]"]').type(time);
    cy.get('textarea').type(description, { force: true});
    cy.get('#token-input-speakers').type(person.name, { force: true});
    cy.wait(1000);
    cy.get('.token-input-dropdown-item2').click();
    cy.get('#token-input-sponsors').type(name, { force: true});
    cy.wait(1000);
    cy.get('.token-input-dropdown-item2').click();
    cy.get('#token-input-supporters').type(name, { force: true});
    cy.wait(1000);
    cy.get('.token-input-dropdown-item2').click();
    cy.get('button[type="submit"]').click();
  });
});