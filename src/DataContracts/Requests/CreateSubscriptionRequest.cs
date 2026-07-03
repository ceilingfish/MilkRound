using MilkRound.DataContracts.Models;

namespace MilkRound.DataContracts.Requests;

/// <summary>
/// Request to create a recurring delivery subscription for a customer.
/// </summary>
public record CreateSubscriptionRequest(
    IReadOnlyList<DeliveryDayOfWeek> DeliveryDays,
    IReadOnlyList<BasketItem> DefaultBasket,
    IReadOnlyDictionary<DeliveryDayOfWeek, IReadOnlyList<BasketItem>>? DayOverrides
);
