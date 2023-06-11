import { When, Then } from "cypress-cucumber-preprocessor/steps";

Then(`I fill form with user info`, () => {
  cy.fixture('data.json').then((data) => {
    const { person: {name, designation, organization, bio, facebook, twitter, github } } = data;

    cy.get('input[name="name"]').type(name);
    cy.get('input[name="designation"]').type(designation);
    cy.get('input[name="organization"]').type(organization);
    cy.get('textarea').type(bio, { force: true});
    cy.get('input[name="twitter"]').type(twitter);
    cy.get('input[name="github"]').type(github);
    cy.get('input[name="facebook"]').type(facebook);
  });
});

Then(`I fill form with user photo`, () => {
  // Load JPEG image file as binary data
  cy.fixture('user.jpeg', 'binary').then((fileContent) => {
    // Create a Blob object from the binary data
    const blob = Cypress.Blob.binaryStringToBlob(fileContent);

    // Create a File object from the Blob
    const testFile = new File([blob], 'user.jpeg', { type: 'image/jpeg' });

    // Upload the file by setting the value of the file input field
    cy.get('input[type="file"]').then((input) => {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      input[0].files = dataTransfer.files;
      cy.wrap(input).trigger('change', { force: true });
    });
  });
})

Then(`I see the user info`, () => {
  cy.fixture('data.json').then((data) => {
    const { person : {name, designation, organization, bio, facebook, twitter, github } } = data;
    cy.contains(name).should('exist')
    cy.contains(`${designation} at ${organization}`).should('exist')
  })
})