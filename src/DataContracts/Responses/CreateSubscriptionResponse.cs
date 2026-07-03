namespace MilkRound.DataContracts.Responses;

/// <summary>
/// Response returned after a subscription's delivery schedules have been created.
/// </summary>
public record CreateSubscriptionResponse(
    IReadOnlyList<Guid> ScheduleIds,
    DateOnly FirstDeliveryDate
);
