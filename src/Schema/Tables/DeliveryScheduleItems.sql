-- Delivery Schedule Items table
CREATE TABLE DeliveryScheduleItems (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    SupplierItemId BIGINT NOT NULL,
    DeliveryScheduleId BIGINT NOT NULL,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255),
    CONSTRAINT FK_DeliveryScheduleItems_SupplierItems FOREIGN KEY (SupplierItemId)
        REFERENCES SupplierItems(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_DeliveryScheduleItems_DeliverySchedules FOREIGN KEY (DeliveryScheduleId)
        REFERENCES DeliverySchedules(Id) ON DELETE NO ACTION
);

CREATE INDEX IX_DeliveryScheduleItems_DeliveryScheduleId ON DeliveryScheduleItems(DeliveryScheduleId);
CREATE INDEX IX_DeliveryScheduleItems_SupplierItemId ON DeliveryScheduleItems(SupplierItemId);
