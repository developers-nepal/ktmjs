import { When, Then } from "cypress-cucumber-preprocessor/steps";

Then(`I fill form with company info`, () => {
  cy.fixture('data.json').then((data) => {
    const { company : {name, address, phone_number, email, website, facebook, twitter, about, github } } = data;
    cy.get('input[name="name"]').type(name);
    cy.get('input[name="address_1"]').type(address);
    cy.get('input[name="phone_number"]').type(phone_number);
    cy.get('input[name="email"]').type(email);
    cy.get('textarea').type(about, { force: true});
    cy.get('input[name="website"]').type(website);
    cy.get('input[name="twitter"]').type(twitter);
    cy.get('input[name="github"]').type(github);
    cy.get('input[name="facebook"]').type(facebook);
  });
});

Then(`I fill form with company photo`, () => {
  // Load JPEG image file as binary data
  cy.fixture('company.jpeg', 'binary').then((fileContent) => {
    // Create a Blob object from the binary data
    const blob = Cypress.Blob.binaryStringToBlob(fileContent);
    // Create a File object from the Blob
    const testFile = new File([blob], 'company.jpeg', { type: 'image/jpeg' });

    // Upload the file by setting the value of the file input field
    cy.get('input[type="file"]').then((input) => {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      input[0].files = dataTransfer.files;
      cy.wrap(input).trigger('change', { force: true });
    });
  });
})

Then(`I see the company info`, () => {
  cy.fixture('data.json').then((data) => {
    const { company : {name, website } } = data;
    cy.contains(name).should('exist')
    cy.contains(website).should('exist')
  })
})