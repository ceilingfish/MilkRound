using MilkRound.Abstractions.Data;
using MilkRound.Abstractions.Queries;
using MilkRound.Application.Helpers;
using MilkRound.Application.Models.Queries;

namespace MilkRound.Application.Handlers.Queries;

/// <summary>
/// Checks whether a postcode falls within any of a supplier's rotas' service areas.
/// </summary>
public class CheckServiceAreaQueryHandler(ISupplierRepository supplierRepository)
    : IQueryHandler<CheckServiceAreaQuery, CheckServiceAreaResult>
{
    public async Task<CheckServiceAreaResult> HandleAsync(
        CheckServiceAreaQuery query,
        CancellationToken cancellationToken = default)
    {
        var supplier = await supplierRepository.FindByPublicIdAsync(query.SupplierId, cancellationToken);
        if (supplier is null)
        {
            return new CheckServiceAreaResult(SupplierFound: false, InRange: false, Eta: null);
        }

        var outwardCode = PostcodeHelper.ToOutwardCode(query.Postcode);
        var match = await supplierRepository.FindMatchingRotaForPostcodeAsync(
            supplier.SupplierId,
            outwardCode,
            cancellationToken);

        return match is null
            ? new CheckServiceAreaResult(SupplierFound: true, InRange: false, Eta: null)
            : new CheckServiceAreaResult(SupplierFound: true, InRange: true, Eta: match.EtaDescription);
    }
}
