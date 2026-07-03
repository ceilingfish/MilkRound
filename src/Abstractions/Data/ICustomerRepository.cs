namespace MilkRound.Abstractions.Data;

/// <summary>
/// Read/write access to customer data.
/// </summary>
public interface ICustomerRepository
{
    Task<CreateCustomerResult> CreateCustomerAsync(
        CreateCustomerParams parameters,
        CancellationToken cancellationToken = default);

    Task<long?> FindCustomerIdByPublicIdAsync(Guid publicId, CancellationToken cancellationToken = default);

    Task<CustomerRotaResult?> FindCustomerRotaAsync(long customerId, CancellationToken cancellationToken = default);
}
