-- Customer Delivery Schedule Subscriptions table
CREATE TABLE CustomerDeliveryScheduleSubscriptions (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    CustomerId BIGINT NOT NULL,
    DeliveryScheduleId BIGINT NOT NULL,
    Status SubscriptionStatus NOT NULL DEFAULT 'Active',
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255),
    CONSTRAINT FK_CustomerDeliveryScheduleSubscriptions_Customers FOREIGN KEY (CustomerId)
        REFERENCES Customers(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_CustomerDeliveryScheduleSubscriptions_DeliverySchedules FOREIGN KEY (DeliveryScheduleId)
        REFERENCES DeliverySchedules(Id) ON DELETE NO ACTION,
    CONSTRAINT UQ_CustomerDeliveryScheduleSubscriptions_Customer_Schedule
        UNIQUE (CustomerId, DeliveryScheduleId)
);

CREATE INDEX IX_CustomerDeliveryScheduleSubscriptions_CustomerId ON CustomerDeliveryScheduleSubscriptions(CustomerId);
CREATE INDEX IX_CustomerDeliveryScheduleSubscriptions_DeliveryScheduleId ON CustomerDeliveryScheduleSubscriptions(DeliveryScheduleId);
