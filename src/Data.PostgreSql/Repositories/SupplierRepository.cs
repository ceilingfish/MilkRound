using Dapper;
using MilkRound.Abstractions.Data;
using Npgsql;

namespace MilkRound.Data.PostgreSql.Repositories;

/// <summary>
/// Postgres-backed implementation of <see cref="ISupplierRepository"/>. Every method calls exactly
/// one stored function under src/Schema/Procedures via Dapper — no inline/ad-hoc SQL.
/// </summary>
public class SupplierRepository(NpgsqlDataSource dataSource) : ISupplierRepository
{
    public async Task<SupplierLookupResult?> FindBySignupKeyAsync(
        string signupKey,
        CancellationToken cancellationToken = default)
    {
        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(
            "SELECT * FROM fn_find_supplier_by_signup_key(@SignupKey)",
            new { SignupKey = signupKey },
            cancellationToken: cancellationToken);
        var row = await connection.QuerySingleOrDefaultAsync<SupplierRow>(command);
        return row is null ? null : new SupplierLookupResult(row.SupplierId, row.PublicId, row.BusinessName);
    }

    public async Task<SupplierLookupResult?> FindByPublicIdAsync(
        Guid publicId,
        CancellationToken cancellationToken = default)
    {
        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(
            "SELECT * FROM fn_find_supplier_by_public_id(@PublicId)",
            new { PublicId = publicId },
            cancellationToken: cancellationToken);
        var row = await connection.QuerySingleOrDefaultAsync<SupplierByIdRow>(command);
        return row is null ? null : new SupplierLookupResult(row.SupplierId, publicId, row.BusinessName);
    }

    public async Task<RotaMatchResult?> FindMatchingRotaForPostcodeAsync(
        long supplierId,
        string outwardCode,
        CancellationToken cancellationToken = default)
    {
        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(
            "SELECT * FROM fn_find_matching_rota_for_postcode(@SupplierId, @OutwardCode)",
            new { SupplierId = supplierId, OutwardCode = outwardCode },
            cancellationToken: cancellationToken);
        var row = await connection.QuerySingleOrDefaultAsync<RotaMatchRow>(command);
        return row is null ? null : new RotaMatchResult(row.RotaId, row.EtaDescription);
    }

    public async Task<IReadOnlyList<ValidatedSupplierItem>> ValidateSupplierItemsAsync(
        long supplierId,
        IReadOnlyList<Guid> itemPublicIds,
        CancellationToken cancellationToken = default)
    {
        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(
            "SELECT * FROM fn_validate_supplier_items(@SupplierId, @ItemPublicIds)",
            new { SupplierId = supplierId, ItemPublicIds = itemPublicIds.ToArray() },
            cancellationToken: cancellationToken);
        var rows = await connection.QueryAsync<ValidatedItemRow>(command);
        return rows.Select(r => new ValidatedSupplierItem(r.ItemId, r.PublicId)).ToList();
    }

    private sealed record SupplierRow(long SupplierId, Guid PublicId, string BusinessName);

    private sealed record SupplierByIdRow(long SupplierId, string BusinessName);

    private sealed record RotaMatchRow(long RotaId, string? EtaDescription);

    private sealed record ValidatedItemRow(long ItemId, Guid PublicId);
}
