# Customer Security

Customer APIs should _not_ include their own customer ID. That should be read from the JWT token.

If a customer is accessing a resource like an order by ID, there should be an explicit check in the application handler that checks that resource is owned by the requesting user.

## JWT scopes

| Name | Audiences | Purpose |
|------|----------|---------|
| `read:self` | `customer`, `supplier` | Allows read only access to own data |
| `write:self` | `customer`, `supplier` | Allows write access to own data |
| `read:deliveries` | `admin` | Allows read access to schedule objects |
| `write:deliveries` | `admin` | Allows write access to schedule objects |
| `read:supplier_rotas` | `admin`, `supplier` | Allows the reading of supplier rotas |
| `write:supplier_rotas` | `admin`, `supplier` | Allows the editing of supplier rotas |
| `read:supplier_items` | `admin`, `supplier` | Allows the reading of supplier items |
| `write:supplier_items` | `admin`, `supplier` | Allows the editing of supplier items |