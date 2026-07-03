-- Suppliers table
CREATE TABLE Suppliers (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PublicId UUID NOT NULL DEFAULT gen_random_uuid(),
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255),
    SignupKey VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255),
    CONSTRAINT UQ_Suppliers_PublicId UNIQUE (PublicId),
    CONSTRAINT UQ_Suppliers_SignupKey UNIQUE (SignupKey)
);
