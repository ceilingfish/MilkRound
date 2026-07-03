-- Finds a supplier's internal identity by its public id.
CREATE OR REPLACE FUNCTION fn_find_supplier_by_public_id(p_public_id UUID)
RETURNS TABLE (
    supplier_id BIGINT,
    business_name VARCHAR(255)
)
LANGUAGE sql
STABLE
AS $$
    SELECT Id, Name
    FROM Suppliers
    WHERE PublicId = p_public_id;
$$;
