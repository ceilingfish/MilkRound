namespace MilkRound.DataContracts.Models;

/// <summary>
/// A recurring delivery slot.
/// </summary>
public record DeliverySlot(
    Guid Id,
    DeliveryDayOfWeek DayOfWeek,
    DeliveryFrequency Frequency,
    TimeOnly CutoffTime,
    int? CutoffDaysBefore = null
);
