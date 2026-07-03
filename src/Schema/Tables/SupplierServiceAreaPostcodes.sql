-- Supplier Service Area Postcodes table
-- MVP allow-list of UK outward postcodes (e.g. 'BS8') that a given supplier rota delivers to.
CREATE TABLE SupplierServiceAreaPostcodes (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    SupplierRotaId BIGINT NOT NULL,
    OutwardCode VARCHAR(10) NOT NULL,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255),
    CONSTRAINT FK_SupplierServiceAreaPostcodes_SupplierRotas FOREIGN KEY (SupplierRotaId)
        REFERENCES SupplierRotas(Id) ON DELETE NO ACTION,
    CONSTRAINT UQ_SupplierServiceAreaPostcodes_Rota_Outward UNIQUE (SupplierRotaId, OutwardCode)
);

CREATE INDEX IX_SupplierServiceAreaPostcodes_SupplierRotaId ON SupplierServiceAreaPostcodes(SupplierRotaId);
