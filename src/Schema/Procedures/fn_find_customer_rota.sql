-- A customer is associated with exactly one supplier rota. Resolves it along
-- with the owning supplier, so callers can validate order items belong to
-- that supplier.
CREATE OR REPLACE FUNCTION fn_find_customer_rota(p_customer_id BIGINT)
RETURNS TABLE (
    rota_id BIGINT,
    supplier_id BIGINT
)
LANGUAGE sql
STABLE
AS $$
    SELECT r.Id, r.SupplierId
    FROM CustomerSupplierRotaAssociations a
    JOIN SupplierRotas r ON r.Id = a.SupplierRotaId
    WHERE a.CustomerId = p_customer_id
    LIMIT 1;
$$;
