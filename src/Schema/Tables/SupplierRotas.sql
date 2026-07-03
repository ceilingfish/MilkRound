-- Supplier Rotas table
CREATE TABLE SupplierRotas (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PublicId UUID NOT NULL DEFAULT gen_random_uuid(),
    SupplierId BIGINT NOT NULL,
    CutoffHours INT NOT NULL,
    ServiceAreaEtaDescription VARCHAR(255),
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255),
    CONSTRAINT UQ_SupplierRotas_PublicId UNIQUE (PublicId),
    CONSTRAINT FK_SupplierRotas_Suppliers FOREIGN KEY (SupplierId)
        REFERENCES Suppliers(Id) ON DELETE NO ACTION
);

CREATE INDEX IX_SupplierRotas_SupplierId ON SupplierRotas(SupplierId);
