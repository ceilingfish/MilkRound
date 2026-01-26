-- Customer Delivery Schedule Order Items table
CREATE TABLE CustomerDeliveryScheduleOrderItems (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    SubscriptionId BIGINT NOT NULL,
    SupplierItemId BIGINT NOT NULL,
    Quantity INT NOT NULL,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255),
    CONSTRAINT FK_CustomerDeliveryScheduleOrderItems_Subscriptions FOREIGN KEY (SubscriptionId)
        REFERENCES CustomerDeliveryScheduleSubscriptions(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_CustomerDeliveryScheduleOrderItems_SupplierItems FOREIGN KEY (SupplierItemId)
        REFERENCES SupplierItems(Id) ON DELETE NO ACTION,
    CONSTRAINT CHK_Quantity_Positive CHECK (Quantity > 0)
);

CREATE INDEX IX_CustomerDeliveryScheduleOrderItems_SubscriptionId ON CustomerDeliveryScheduleOrderItems(SubscriptionId);
