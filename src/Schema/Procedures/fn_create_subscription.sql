-- Links a customer to a delivery schedule as an active subscription.
CREATE OR REPLACE FUNCTION fn_create_subscription(
    p_customer_id BIGINT,
    p_delivery_schedule_id BIGINT,
    p_created_by VARCHAR(255)
)
RETURNS TABLE (
    subscription_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id BIGINT;
BEGIN
    INSERT INTO CustomerDeliveryScheduleSubscriptions (CustomerId, DeliveryScheduleId, Status, CreatedBy)
    VALUES (p_customer_id, p_delivery_schedule_id, 'Active', p_created_by)
    RETURNING Id INTO v_id;

    RETURN QUERY SELECT v_id;
END;
$$;
