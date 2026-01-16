# Customer API specifications

This document outlines the APIs that will be available to the "customer" audience in the open API spec.

The APIs are intended to be the ones that will be called by users who are making orders and managing their deliveries through the app.

## Common models

This is a list of common models that will frequently be seen in responses & requests

## Price

This is a combination of the following:
* Amount - a decimal that represents the amount
* Precision - The precision for the currency to render in the UI
* Symbol - The symbol to represent in the UI

### Delivery

This should contain a list of items, a delivery slot ID, a scheduled time and a status.

The status should be one of Pending, Packed, Shipped, Cancelled & Delivered

### Item

This should contain an id, name, price, currency & icon name

## Commands

### Signup API

We need a section of the application that allows a user to register. The API should take the unique code supplied by the supplier and return:
* a 201 if authorized
* a 404 if the code is not known

If the signup is created, then the response returns a redirect to Auth0 for customer signup

### Authentication Callback

This is the callback that handles the response from Auth0. If the user is authenticated, then it responds with a response that sets the default ASP.Net authentication cookies. If not, it returns a 401.

## Queries

### Authorized API

This API should be used to check if the customer has a valid session. If they do, it returns a 200, otherwise it returns a 401