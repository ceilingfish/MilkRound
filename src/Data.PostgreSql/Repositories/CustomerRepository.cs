using Dapper;
using MilkRound.Abstractions.Data;
using Npgsql;

namespace MilkRound.Data.PostgreSql.Repositories;

/// <summary>
/// Postgres-backed implementation of <see cref="ICustomerRepository"/>. Every method calls exactly
/// one stored function under src/Schema/Procedures via Dapper — no inline/ad-hoc SQL.
/// </summary>
public class CustomerRepository(NpgsqlDataSource dataSource) : ICustomerRepository
{
    public async Task<CreateCustomerResult> CreateCustomerAsync(
        CreateCustomerParams parameters,
        CancellationToken cancellationToken = default)
    {
        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(
            "SELECT * FROM fn_create_customer(@SupplierId, @RotaId, @Name, @Flat, @StreetAddress, @AdditionalAddress, @PostalCode, @Notes, @Latitude, @Longitude, @CreatedBy)",
            new
            {
                parameters.SupplierId,
                parameters.RotaId,
                parameters.Name,
                parameters.Flat,
                parameters.StreetAddress,
                parameters.AdditionalAddress,
                parameters.PostalCode,
                parameters.Notes,
                parameters.Latitude,
                parameters.Longitude,
                CreatedBy = CreatedBySentinel.Value,
            },
            cancellationToken: cancellationToken);
        var row = await connection.QuerySingleAsync<CreateCustomerRow>(command);
        var outcome = Enum.Parse<CreateCustomerOutcome>(row.Outcome);
        return new CreateCustomerResult(outcome, row.CustomerId, row.PublicId);
    }

    public async Task<long?> FindCustomerIdByPublicIdAsync(
        Guid publicId,
        CancellationToken cancellationToken = default)
    {
        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(
            "SELECT * FROM fn_find_customer_by_public_id(@PublicId)",
            new { PublicId = publicId },
            cancellationToken: cancellationToken);
        return await connection.QuerySingleOrDefaultAsync<long?>(command);
    }

    public async Task<CustomerRotaResult?> FindCustomerRotaAsync(
        long customerId,
        CancellationToken cancellationToken = default)
    {
        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(
            "SELECT * FROM fn_find_customer_rota(@CustomerId)",
            new { CustomerId = customerId },
            cancellationToken: cancellationToken);
        var row = await connection.QuerySingleOrDefaultAsync<CustomerRotaRow>(command);
        return row is null ? null : new CustomerRotaResult(row.RotaId, row.SupplierId);
    }

    private sealed record CreateCustomerRow(string Outcome, long? CustomerId, Guid? PublicId);

    private sealed record CustomerRotaRow(long RotaId, long SupplierId);
}
