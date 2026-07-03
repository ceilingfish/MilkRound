-- Inserts the recurring basket (item + quantity pairs) for a subscription in
-- a single batch, using parallel arrays.
CREATE OR REPLACE FUNCTION fn_create_order_items_batch(
    p_subscription_id BIGINT,
    p_supplier_item_ids BIGINT[],
    p_quantities INT[],
    p_created_by VARCHAR(255)
)
RETURNS TABLE (
    order_item_id BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO CustomerDeliveryScheduleOrderItems (SubscriptionId, SupplierItemId, Quantity, CreatedBy)
    SELECT p_subscription_id, t.item_id, t.qty, p_created_by
    FROM UNNEST(p_supplier_item_ids, p_quantities) AS t(item_id, qty)
    RETURNING Id;
END;
$$;
