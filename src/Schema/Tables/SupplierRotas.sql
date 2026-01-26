-- Supplier Rotas table
CREATE TABLE SupplierRotas (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    SupplierId BIGINT NOT NULL,
    SignupKey VARCHAR(100) NOT NULL UNIQUE,
    CutoffHours INT NOT NULL,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255),
    CONSTRAINT FK_SupplierRotas_Suppliers FOREIGN KEY (SupplierId)
        REFERENCES Suppliers(Id) ON DELETE NO ACTION
);

CREATE INDEX IX_SupplierRotas_SupplierId ON SupplierRotas(SupplierId);
