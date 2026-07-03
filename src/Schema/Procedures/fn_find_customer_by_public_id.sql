-- Resolves a customer's internal id from its public id.
CREATE OR REPLACE FUNCTION fn_find_customer_by_public_id(p_public_id UUID)
RETURNS TABLE (
    customer_id BIGINT
)
LANGUAGE sql
STABLE
AS $$
    SELECT Id
    FROM Customers
    WHERE PublicId = p_public_id;
$$;
