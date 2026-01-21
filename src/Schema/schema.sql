-- MilkRound Database Schema for PostgreSQL
-- Compatible with Atlas schema management

-- Enum types
CREATE TYPE ScheduleType AS ENUM ('Daily', 'Weekly', 'Monthly');
CREATE TYPE DayOfWeek AS ENUM ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
CREATE TYPE WeekOfMonth AS ENUM ('First', 'Second', 'Third', 'Last');
CREATE TYPE DeliveryStatus AS ENUM ('Pending', 'Locked', 'Cancelled', 'Delivered');
CREATE TYPE SubscriptionStatus AS ENUM ('Cancelled', 'Active');

-- Customers table
CREATE TABLE Customers (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    StreetAddress VARCHAR(500) NOT NULL,
    AdditionalAddress VARCHAR(500),
    PostalCode VARCHAR(20) NOT NULL,
    Latitude DECIMAL(9, 6),
    Longitude DECIMAL(9, 6),
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255)
);

-- Suppliers table
CREATE TABLE Suppliers (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255),
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255)
);

-- Supplier Items table
CREATE TABLE SupplierItems (
    Id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    SupplierId BIGINT NOT NULL,
    ProductName VARCHAR(255) NOT NULL,
    PriceAmount DECIMAL(19, 4) NOT NULL,
    PricePrecision INT NOT NULL DEFAULT 2,
    PriceCurrency VARCHAR(3) NOT NULL DEFAULT 'GBP',
    UnitOfMeasure VARCHAR(100) NOT NULL,
    MaxQuantity INT,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CreatedBy VARCHAR(255) NOT NULL,
    ModifiedAt TIMESTAMPTZ,
    ModifiedBy VARCHAR(255),
    CONSTRAINT FK_SupplierItems_Suppliers FOREIGN KEY (SupplierId)
        REFERENCES Suppliers(Id) ON DELETE NO ACTION
);

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

-- Indexes for common query patterns
CREATE INDEX IX_SupplierItems_SupplierId ON SupplierItems(SupplierId);
CREATE INDEX IX_SupplierRotas_SupplierId ON SupplierRotas(SupplierId);
CREATE INDEX IX_DeliverySchedules_SupplierRotaId ON DeliverySchedules(SupplierRotaId);
CREATE INDEX IX_DeliveryScheduleItems_DeliveryScheduleId ON DeliveryScheduleItems(DeliveryScheduleId);
CREATE INDEX IX_DeliveryScheduleItems_SupplierItemId ON DeliveryScheduleItems(SupplierItemId);
CREATE INDEX IX_ActualizedDeliverySchedules_DeliveryScheduleId ON ActualizedDeliverySchedules(DeliveryScheduleId);
CREATE INDEX IX_ActualizedDeliverySchedules_Status ON ActualizedDeliverySchedules(Status);
CREATE INDEX IX_CustomerSupplierRotaAssociations_CustomerId ON CustomerSupplierRotaAssociations(CustomerId);
CREATE INDEX IX_CustomerDeliveryScheduleSubscriptions_CustomerId ON CustomerDeliveryScheduleSubscriptions(CustomerId);
CREATE INDEX IX_CustomerDeliveryScheduleSubscriptions_DeliveryScheduleId ON CustomerDeliveryScheduleSubscriptions(DeliveryScheduleId);
CREATE INDEX IX_CustomerDeliveryScheduleOrderItems_SubscriptionId ON CustomerDeliveryScheduleOrderItems(SubscriptionId);
CREATE INDEX IX_CustomerActualisedOrderItems_CustomerId ON CustomerActualisedOrderItems(CustomerId);
CREATE INDEX IX_CustomerActualisedOrderItems_ActualizedDeliveryScheduleId ON CustomerActualisedOrderItems(ActualizedDeliveryScheduleId);
