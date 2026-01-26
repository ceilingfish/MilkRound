-- Delivery Schedules table
CREATE TABLE DeliverySchedules (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    SupplierRotaId BIGINT NOT NULL,
    ScheduleType ScheduleType NOT NULL,
    DayOfWeek DayOfWeek,
    DayOfMonth INT,
    WeekOfMonth WeekOfMonth,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255),
    CONSTRAINT FK_DeliverySchedules_SupplierRotas FOREIGN KEY (SupplierRotaId)
        REFERENCES SupplierRotas(Id) ON DELETE NO ACTION,
    CONSTRAINT CHK_DayOfMonth_Range CHECK (DayOfMonth IS NULL OR (DayOfMonth >= 1 AND DayOfMonth <= 31))
);

CREATE INDEX IX_DeliverySchedules_SupplierRotaId ON DeliverySchedules(SupplierRotaId);
