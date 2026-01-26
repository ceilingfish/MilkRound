-- Customer Actualised Order Items table
CREATE TABLE CustomerActualisedOrderItems (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    CustomerId BIGINT NOT NULL,
    ActualizedDeliveryScheduleId BIGINT NOT NULL,
    SupplierItemId BIGINT NOT NULL,
    Quantity INT NOT NULL,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255),
    CONSTRAINT FK_CustomerActualisedOrderItems_Customers FOREIGN KEY (CustomerId)
        REFERENCES Customers(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_CustomerActualisedOrderItems_ActualizedDeliverySchedules FOREIGN KEY (ActualizedDeliveryScheduleId)
        REFERENCES ActualizedDeliverySchedules(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_CustomerActualisedOrderItems_SupplierItems FOREIGN KEY (SupplierItemId)
        REFERENCES SupplierItems(Id) ON DELETE NO ACTION,
    CONSTRAINT CHK_ActualisedQuantity_Positive CHECK (Quantity > 0)
);

CREATE INDEX IX_CustomerActualisedOrderItems_CustomerId ON CustomerActualisedOrderItems(CustomerId);
CREATE INDEX IX_CustomerActualisedOrderItems_ActualizedDeliveryScheduleId ON CustomerActualisedOrderItems(ActualizedDeliveryScheduleId);
