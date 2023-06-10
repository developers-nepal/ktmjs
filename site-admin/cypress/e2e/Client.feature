Feature: Client page
  Scenario: visiting the Client page
  
    Given I am on the "clientURL"
    Then session number "session #1" should be visible
    Then meetup date "September 27th" should be present
    And session title "Streamline UI Components in JS Frameworks" should be present and visible
    And session time "03:00pm - 04:30pm" should exsist
    Then session sponser should be present