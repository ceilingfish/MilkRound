-- Customer Supplier Rota Associations table
CREATE TABLE CustomerSupplierRotaAssociations (
    SupplierRotaId BIGINT NOT NULL,
    CustomerId BIGINT NOT NULL,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255),
    PRIMARY KEY (SupplierRotaId, CustomerId),
    CONSTRAINT FK_CustomerSupplierRotaAssociations_SupplierRotas FOREIGN KEY (SupplierRotaId)
        REFERENCES SupplierRotas(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_CustomerSupplierRotaAssociations_Customers FOREIGN KEY (CustomerId)
        REFERENCES Customers(Id) ON DELETE NO ACTION
);

CREATE INDEX IX_CustomerSupplierRotaAssociations_CustomerId ON CustomerSupplierRotaAssociations(CustomerId);
