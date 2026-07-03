namespace MilkRound.Abstractions.Data;

/// <summary>
/// Read/write access to supplier, rota, and supplier item data.
/// </summary>
public interface ISupplierRepository
{
    Task<SupplierLookupResult?> FindBySignupKeyAsync(string signupKey, CancellationToken cancellationToken = default);

    Task<SupplierLookupResult?> FindByPublicIdAsync(Guid publicId, CancellationToken cancellationToken = default);

    Task<RotaMatchResult?> FindMatchingRotaForPostcodeAsync(
        long supplierId,
        string outwardCode,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ValidatedSupplierItem>> ValidateSupplierItemsAsync(
        long supplierId,
        IReadOnlyList<Guid> itemPublicIds,
        CancellationToken cancellationToken = default);
}
