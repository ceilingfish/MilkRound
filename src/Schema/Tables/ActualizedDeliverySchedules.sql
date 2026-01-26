-- Actualized Delivery Schedule table
CREATE TABLE ActualizedDeliverySchedules (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    DeliveryScheduleId BIGINT NOT NULL,
    DeliveryAt TIMESTAMPTZ NOT NULL,
    CutoffAt TIMESTAMPTZ NOT NULL,
    Status DeliveryStatus NOT NULL DEFAULT 'Pending',
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255),
    CONSTRAINT FK_ActualizedDeliverySchedules_DeliverySchedules FOREIGN KEY (DeliveryScheduleId)
        REFERENCES DeliverySchedules(Id) ON DELETE NO ACTION
);

CREATE INDEX IX_ActualizedDeliverySchedules_DeliveryScheduleId ON ActualizedDeliverySchedules(DeliveryScheduleId);
CREATE INDEX IX_ActualizedDeliverySchedules_Status ON ActualizedDeliverySchedules(Status);
