# Customer API specifications

This document outlines the APIs that will be available to the "customer" audience in the open API spec.

The APIs are intended to be the ones that will be called by users who are making orders and managing their deliveries through the app.

## Commands

All of these commands should be scoped to `write:self`, unless otherwise specifically stated.

### Add item to a specific delivery

This should allow a customer to add an item to a specific instance of a delivery

* a product ID
* An array (of at least one) delivery schedule IDs
* A quantity

It should return either a confirmation that the order was modified (with an ID)

Verb: POST
Path: `/PlannedDeliveries/{id}/Items`

### Add item to a delivery schedule

This should allow a customer to add an item to a delivery. The should have to supply:

* a product ID
* An array (of at least one) delivery schedule IDs
* A quantity

It should return either a confirmation that the order was modified (with an ID)

Verb: POST
Path: `/DeliverySchedules/{id}/Items`

### Remove item from a specific delivery

This should allow a customer to remove an item from a specific delivery. They should have to supply:

Verb: DELETE
Path: `/PlannedDeliveries/{id}/Items/{id}`

### Remove item from a delivery schedule

This should allow a customer to remove an item from a delivery schedule, so it isn't delivered on that day again at all.

Verb: DELETE
Path: `/DeliverySchedules/{id}/Items/{id}`

### Skip a planned delivery

This should cancel the for a specific day, and mark it as skipped. Should have to pass the ID of the planned delivery to cancel it.

Verb POST
Path `/PlannedDeliveries/{id}/Cancel`

## Cancel a scheduled delivery

This should cancel a delivery for a customer on a specific schedule ID

Verb POST
Path `/DeliverySchedules/{id}/Cancel`

## Queries

All of these queries should be scoped to `read:self` unless otherwise stated.

### Get supplier delivery schedule

Gets the supplier delivery schedules that are available to the customer. This should be scoped to `read:self`, and available at the path `/Supplier/{id}/DeliverySchedule`. It should return a list of schedules that are available from the customers current supplier, how frequently they occur, and on what day. It should also include information about cutoff times.

### Get supplier info

At `/Supplier/{id}` this should return the basic contact information for the supplier including:
* Business name
* Phone number
* Email address

The contact details are not mandatory.

### Get next delivery

This API should return the next delivery for the customer. It should be at `/PlannedDeliveries/Next` and return a delivery model.

If the customer has no deliveries scheduled, then this should return 404

### Get planned deliveries

This API should return the deliveries that are planned for a customer. It should return a list of delivery models.

Path `/Supplier/{id}/PlannedDeliveries`

### Get supplier items

Path `/Supplier/{id}/Items`. It should take the following parameters:

* DeliveryScheduleId which should trim down to items that are only available for a specific schedule ID. Optional. If not passed, show all available items for that supplier
* Query A free text query that should be used to match against.

The response should be a list of Item models, but extended with the following properties:
* Maximum Quantity - The largest number of items that the supplier can deliver