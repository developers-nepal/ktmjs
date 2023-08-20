import { Given } from "cypress-cucumber-preprocessor/steps";

Given('count list of rows', () => {
  cy.task('queryDb', `SELECT COUNT(*) as "rowCount" FROM Users`).then((result) => {

    expect(result[0].rowCount).to.equal(3)
  });
})