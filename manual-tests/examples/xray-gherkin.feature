@JIRA-AUTH
Feature: Authentication and Access Control

  @smoke @C101
  Scenario: Valid user login
    Given the user is on the login page
    When the user enters username "standard_user" and password "secret_sauce"
    And clicks the login button
    Then the user should be redirected to the inventory catalog
    And the page title should display "Products"

  @smoke @C102
  Scenario: Locked out user receives error message
    Given the user is on the login page
    When the user enters username "locked_out_user" and password "secret_sauce"
    And clicks the login button
    Then an error message "Sorry, this user has been locked out." should be displayed
