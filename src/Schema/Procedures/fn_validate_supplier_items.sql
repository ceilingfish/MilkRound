-- Given a set of SupplierItems public ids, returns the subset that are
-- active and belong to the given supplier. Callers compare the returned
-- count/ids against the requested set to detect invalid product ids.
CREATE OR REPLACE FUNCTION fn_validate_supplier_items(p_supplier_id BIGINT, p_item_public_ids UUID[])
RETURNS TABLE (
    item_id BIGINT,
    public_id UUID
)
LANGUAGE sql
STABLE
AS $$
    SELECT Id, PublicId
    FROM SupplierItems
    WHERE SupplierId = p_supplier_id
      AND IsActive = TRUE
      AND PublicId = ANY (p_item_public_ids);
$$;
