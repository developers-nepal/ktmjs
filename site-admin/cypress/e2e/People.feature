Feature: People page
  Scenario: visiting the people page
    When I visit "people" page
    Then I should see "People" in navigation bar
    Then I click the "Add new member"
    Then I fill form with user info
    Then I fill form with user photo
    Then I click the "Save"
    Then I see the user info