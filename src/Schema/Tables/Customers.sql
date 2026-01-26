-- Customers table
CREATE TABLE Customers (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    StreetAddress VARCHAR(500) NOT NULL,
    AdditionalAddress VARCHAR(500),
    PostalCode VARCHAR(20) NOT NULL,
    Latitude DECIMAL(9, 6),
    Longitude DECIMAL(9, 6),
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255)
);
