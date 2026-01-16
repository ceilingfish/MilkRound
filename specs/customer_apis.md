# Customer API specifications

This document outlines the APIs that will be available to the "customer" audience in the open API spec.

The APIs are intended to be the ones that will be called by users who are making orders and managing their deliveries through the app.

## Commands

### Signup API

We need a section of the application that allows a user to register. The API should take the unique code supplied by the supplier and return:
* a 201 if authorized
* a 404 if the code is not known

If the signup is created, then the response returns a redirect to Auth0 for customer signup

### Authentication Callback

This is the callback that handles the response from Auth0. If the user is authenticated, then it responds with a response that sets the default ASP.Net authentication cookies. If not, it returns a 401.

### Authorized API

This API should be used to check if the customer has a valid session. If they do, it returns a 200, otherwise it returns a 401

## Queries

### Get supplier delivery schedule

Gets the supplier delivery slots that are available to the customer. This should be scoped to `read:self`, and available at the path `/Supplier/{id}/DeliverySchedule`. It should return a list of slots that are available from the customers current supplier, how frequently they occur, and on what day. It should also include information about cutoff times.

## Get supplier info

At `/Supplier/{id}` this should return the basic contact information for the supplier including:
* Business name
* Phone number
* Email address

The contact details are not mandatory.

Scope should be `read:self`

# Get next delivery

This API should return the next delivery for the customer. It should be at `/Deliveries/Next` and return a delivery model.

If the customer has no deliveries scheduled, then this should return 404

Scope should be `read:self`

# Get supplier items

Path `/Supplier/{id}/Items`. It should take the following parameters:

* DeliveryScheduleId which should trim down to items that are only available for a specific schedule ID. Optional. If not passed, show all available items for that supplier
* Query A free text query that should be used to match against.

The response should be a list of Item models, but extended with the following properties:
* Maximum Quantity - The largest number of items that the supplier can deliver

Scope should be `read:self`