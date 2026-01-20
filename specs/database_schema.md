# Database schema

## Tables

Below is a list of tables that should be defined in the database. Please use `PascalCase` for all column names and table names, and foreign keys should not delete rows on deletion.

Prefer BIGINT auto-incrementing values for primary keys

Every table should have the following columns:

* CreatedAt - The DATETIME that the record was created
* CreatedBy - The user that altered the record
* ModifiedAt - The DATETIME that the record was last modified. It should default to null when the record is first created
* ModifiedBy - The user that last modified the record. It should default to null when the record is created

### Customers

A table that contains all the customers including:

* a unique ID to identify the customer
* Customer name
* Their full postal address
* The latitude & longitude

### Suppliers
A table that contains the list of suppliers that will deliver goods to people, it should include the following:
* Name of the supplier
* An optional email address

### Supplier Items

A table that provides information on items that are sold by a supplier. Columns include:

* Unique ID
* Foreign key to Supplier
* Product name
* Price (and currency/precision)
* Unit of measure (e.g., "per bottle", "per dozen")
* Maximum quanitity
* Active/inactive status

### Supplier Rotas
A list of rotas that the customer can sign up for. A supplier may have multiple rotas. Each contains

* A foreign key to the suppliers table
* a unique key that customers can use to sign up from the home screen
* The cut off time - a number of hours before release that changes to the order are frozen

### Delivery Schedules
An entity that defines a delivery that is part of a rota

* A foreign key to an owning supplier rota
* The schedule type: Daily, Weekly or Monthly. Stored as an enum.
* The day of the week, for weekly deliveries. This should be an enum Sunday = 0, Saturday = 6
* The day of the month (stored as an integer)
* An enum for day of month (stored as an integer). 0 = First, 1 = Second, 2 = Third, 3 = Last

### Delivery Schedule Items
A list of items that are available in each delivery schedule.

* A unique ID
* The foreign key of a supplier item
* The foreign key of a delivery schedule

### Actualized Delivery Schedule
An entity that describes a specific instance of a delivery schedule. Columns are:

* A unique primary key
* The foreign key of a delivery schedule
* A DATETIME for delivery
* A DATETIME for the cutoff
* A status for the order 0 = Pending, 1 = Locked, 2 = Cancelled, 3 = Delivered

### Customer Supplier Rota Associations
A table that links customers to supplier rotas. It should contain the following:

* A foreign key to the supplier rota table
* A foreign key to the customer table

The primary key should be the above two combined, to prevent duplicates being inserted.

### Customer Delivery Schedule Subscriptions

A join table that links customers to delivery schedules. It should contain the following:

* A unique primary key
* A foreign key to customer
* A foreign key to delivery schedule
* A status which is an integer. 0 = Cancelled, 1 = Active

There should be a uniqueness constraint on the customer ID and delivery schedule ID

### Customer Delivery Schedule Order Items
A table that links delivery schedule subscriptions to specific items. Columns are:

* A unique primary key
* A foreign key to Customer Delivery Schedule Subscriptions
* A supplier item foreign key
* A quantity

### Customer Actualised Order Items

A table that links out order items to an actualized order. It should contain the following:

* A unique primary key
* A foreign key to customer
* A foreign key that links to an actualized delivery schedule
* A supplier item foreign key
* A quantity
