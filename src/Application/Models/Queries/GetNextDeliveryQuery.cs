namespace MilkRound.Application.Models.Queries;

/// <summary>
/// Query to get the next scheduled delivery for a customer.
/// </summary>
public record GetNextDeliveryQuery(
    Guid CustomerId
);
