-- Finds a supplier by the 6-character signup key a customer enters during onboarding.
CREATE OR REPLACE FUNCTION fn_find_supplier_by_signup_key(p_signup_key VARCHAR(100))
RETURNS TABLE (
    supplier_id BIGINT,
    public_id UUID,
    business_name VARCHAR(255)
)
LANGUAGE sql
STABLE
AS $$
    SELECT Id, PublicId, Name
    FROM Suppliers
    WHERE SignupKey = p_signup_key;
$$;
