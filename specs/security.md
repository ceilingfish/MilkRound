# Customer Security

Customer APIs should _not_ include their own customer ID. That should be read from the JWT token.

If a customer is accessing a resource like an order by ID, there should be an explicit check in the application handler that checks that resource is owned by the requesting user.