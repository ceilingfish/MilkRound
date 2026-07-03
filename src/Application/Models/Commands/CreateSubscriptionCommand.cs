using MilkRound.DataContracts.Models;

namespace MilkRound.Application.Models.Commands;

public record CreateSubscriptionBasketLine(Guid ProductId, int Quantity);

public record CreateSubscriptionCommand(
    Guid CustomerId,
    IReadOnlyList<DeliveryDayOfWeek> DeliveryDays,
    IReadOnlyList<CreateSubscriptionBasketLine> DefaultBasket,
    IReadOnlyDictionary<DeliveryDayOfWeek, IReadOnlyList<CreateSubscriptionBasketLine>>? DayOverrides);
