name: Cypress Tests

on: push

jobs:
  cypress-run:
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Install Cypress 📥
        run: npm i cypress@12.14.0
      - name: Run Client Test
        run: cd site-admin && cypress run --spec cypress/e2e/Client.feature