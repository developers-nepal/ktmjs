Feature: Meetups page
  Scenario: visiting the meetups page
    When I visit "meetups" page
    Then I should see "Episodes" in navigation bar
    Then I click the "Add new episode"
    Then I fill form with episode details