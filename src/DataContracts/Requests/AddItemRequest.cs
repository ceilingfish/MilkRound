namespace MilkRound.DataContracts.Requests;

/// <summary>
/// Request to add an item to a delivery or schedule.
/// </summary>
public record AddItemRequest(
    Guid ProductId,
    IReadOnlyList<Guid> DeliveryScheduleIds,
    int Quantity
);
