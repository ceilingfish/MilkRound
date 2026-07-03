using MilkRound.Abstractions.Data;
using MilkRound.Abstractions.Queries;
using MilkRound.Application.Models.Queries;
using MilkRound.DataContracts.Responses;

namespace MilkRound.Application.Handlers.Queries;

/// <summary>
/// Resolves a supplier from the 6-character signup code a customer enters during onboarding.
/// </summary>
public class ValidateCodeQueryHandler(ISupplierRepository supplierRepository)
    : IQueryHandler<ValidateCodeQuery, ValidateCodeResponse?>
{
    public async Task<ValidateCodeResponse?> HandleAsync(
        ValidateCodeQuery query,
        CancellationToken cancellationToken = default)
    {
        var supplier = await supplierRepository.FindBySignupKeyAsync(query.Code, cancellationToken);
        return supplier is null ? null : new ValidateCodeResponse(supplier.PublicId, supplier.BusinessName);
    }
}
