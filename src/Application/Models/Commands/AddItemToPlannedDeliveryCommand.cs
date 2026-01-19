namespace MilkRound.Application.Models.Commands;

/// <summary>
/// Command to add an item to a specific planned delivery.
/// </summary>
public record AddItemToPlannedDeliveryCommand(
    Guid PlannedDeliveryId,
    Guid ProductId,
    IReadOnlyList<Guid> DeliveryScheduleIds,
    int Quantity
);
