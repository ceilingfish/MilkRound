namespace MilkRound.DataContracts.Models;

/// <summary>
/// Represents a scheduled delivery.
/// </summary>
public record Delivery(
    Guid Id,
    IReadOnlyList<DeliveryItem> Items,
    Guid DeliverySlotId,
    DateTimeOffset ScheduledTime,
    DeliveryStatus Status
);
