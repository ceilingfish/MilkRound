-- Scans all of a supplier's rotas for one whose service area covers the given
-- UK outward postcode (e.g. 'BS8'). Returns at most one match.
CREATE OR REPLACE FUNCTION fn_find_matching_rota_for_postcode(p_supplier_id BIGINT, p_outward_code VARCHAR(10))
RETURNS TABLE (
    rota_id BIGINT,
    eta_description VARCHAR(255)
)
LANGUAGE sql
STABLE
AS $$
    SELECT r.Id, r.ServiceAreaEtaDescription
    FROM SupplierRotas r
    JOIN SupplierServiceAreaPostcodes p ON p.SupplierRotaId = r.Id
    WHERE r.SupplierId = p_supplier_id
      AND p.OutwardCode = p_outward_code
    LIMIT 1;
$$;
