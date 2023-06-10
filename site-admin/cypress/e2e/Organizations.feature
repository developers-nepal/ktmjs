Feature: Organizations page
  Scenario: visiting the Organizations page
    When I visit "companies" page
    Then I should see "Organizations" in navigation bar
    Then I click the "Add new company"
    Then I fill form with company info
    Then I fill form with company photo
    Then I click the "Save"
    Then I see the company info
    