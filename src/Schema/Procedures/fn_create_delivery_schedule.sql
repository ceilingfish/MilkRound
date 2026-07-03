-- Creates a single recurring weekly delivery schedule for a supplier rota.
CREATE OR REPLACE FUNCTION fn_create_delivery_schedule(
    p_supplier_rota_id BIGINT,
    p_schedule_type ScheduleType,
    p_day_of_week DayOfWeek,
    p_created_by VARCHAR(255)
)
RETURNS TABLE (
    schedule_id BIGINT,
    public_id UUID
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id BIGINT;
    v_public_id UUID;
BEGIN
    INSERT INTO DeliverySchedules (SupplierRotaId, ScheduleType, DayOfWeek, CreatedBy)
    VALUES (p_supplier_rota_id, p_schedule_type, p_day_of_week, p_created_by)
    RETURNING Id, PublicId INTO v_id, v_public_id;

    RETURN QUERY SELECT v_id, v_public_id;
END;
$$;
