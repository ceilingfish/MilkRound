-- Supplier Items table
CREATE TABLE SupplierItems (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PublicId UUID NOT NULL DEFAULT gen_random_uuid(),
    SupplierId BIGINT NOT NULL,
    ProductName VARCHAR(255) NOT NULL,
    PriceAmount DECIMAL(19, 4) NOT NULL,
    PricePrecision INT NOT NULL DEFAULT 2,
    PriceCurrency VARCHAR(3) NOT NULL DEFAULT 'GBP',
    UnitOfMeasure VARCHAR(100) NOT NULL,
    MaxQuantity INT,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255),
    CONSTRAINT UQ_SupplierItems_PublicId UNIQUE (PublicId),
    CONSTRAINT FK_SupplierItems_Suppliers FOREIGN KEY (SupplierId)
        REFERENCES Suppliers(Id) ON DELETE NO ACTION
);

CREATE INDEX IX_SupplierItems_SupplierId ON SupplierItems(SupplierId);
