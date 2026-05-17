using MilkRound.Abstractions.Queries;
using MilkRound.Application.Models.Queries;
using MilkRound.DataContracts.Responses;

namespace MilkRound.Application.Handlers.Queries;

/// <summary>
/// Stub implementation — returns a fixed supplier for any well-formed code.
/// Replace with a real repository lookup once the data layer is wired up.
/// </summary>
public class FindSupplierByCodeQueryHandler
    : IQueryHandler<FindSupplierByCodeQuery, FindSupplierByCodeResponse?>
{
    private static readonly Dictionary<string, FindSupplierByCodeResponse> _suppliers = new()
    {
        ["123456"] = new FindSupplierByCodeResponse(
            Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
            "Adam's Dairy"
        ),
    };

    public Task<FindSupplierByCodeResponse?> HandleAsync(
        FindSupplierByCodeQuery query,
        CancellationToken cancellationToken = default)
    {
        _suppliers.TryGetValue(query.Code, out var result);
        return Task.FromResult(result);
    }
}
