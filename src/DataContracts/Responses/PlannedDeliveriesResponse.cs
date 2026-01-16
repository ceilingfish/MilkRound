using MilkRound.DataContracts.Models;

namespace MilkRound.DataContracts.Responses;

/// <summary>
/// Response containing planned deliveries for a customer.
/// </summary>
public record PlannedDeliveriesResponse(
    IReadOnlyList<Delivery> Deliveries
);
