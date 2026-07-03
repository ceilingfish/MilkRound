-- Atomically creates a customer and links it to the resolved supplier rota,
-- unless a customer with the same street address + postal code is already
-- associated with any rota belonging to the same supplier.
CREATE OR REPLACE FUNCTION fn_create_customer(
    p_supplier_id BIGINT,
    p_rota_id BIGINT,
    p_name VARCHAR(255),
    p_flat VARCHAR(50),
    p_street_address VARCHAR(500),
    p_additional_address VARCHAR(500),
    p_postal_code VARCHAR(20),
    p_notes VARCHAR(500),
    p_latitude DECIMAL(9, 6),
    p_longitude DECIMAL(9, 6),
    p_created_by VARCHAR(255)
)
RETURNS TABLE (
    outcome VARCHAR(20),
    customer_id BIGINT,
    public_id UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_existing_id BIGINT;
    v_new_id BIGINT;
    v_new_public_id UUID;
BEGIN
    SELECT c.Id INTO v_existing_id
    FROM Customers c
    JOIN CustomerSupplierRotaAssociations a ON a.CustomerId = c.Id
    JOIN SupplierRotas r ON r.Id = a.SupplierRotaId
    WHERE r.SupplierId = p_supplier_id
      AND c.StreetAddress = p_street_address
      AND c.PostalCode = p_postal_code
    LIMIT 1;

    IF v_existing_id IS NOT NULL THEN
        RETURN QUERY SELECT 'DuplicateAddress'::VARCHAR(20), NULL::BIGINT, NULL::UUID;
        RETURN;
    END IF;

    INSERT INTO Customers (Name, Flat, StreetAddress, AdditionalAddress, Notes, PostalCode, Latitude, Longitude, CreatedBy)
    VALUES (p_name, p_flat, p_street_address, p_additional_address, p_notes, p_postal_code, p_latitude, p_longitude, p_created_by)
    RETURNING Id, PublicId INTO v_new_id, v_new_public_id;

    INSERT INTO CustomerSupplierRotaAssociations (SupplierRotaId, CustomerId, CreatedBy)
    VALUES (p_rota_id, v_new_id, p_created_by);

    RETURN QUERY SELECT 'Created'::VARCHAR(20), v_new_id, v_new_public_id;
END;
$$;
