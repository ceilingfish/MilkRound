using MilkRound.Abstractions.Commands;
using MilkRound.Abstractions.Data;
using MilkRound.Application.Models.Commands;
using MilkRound.DataContracts.Models;

namespace MilkRound.Application.Handlers.Commands;

/// <summary>
/// Resolves a customer's rota, validates the requested product ids belong to that rota's supplier,
/// then creates one weekly delivery schedule + subscription per selected day.
/// </summary>
public class CreateSubscriptionCommandHandler(
    ICustomerRepository customerRepository,
    ISupplierRepository supplierRepository,
    ISubscriptionRepository subscriptionRepository)
    : ICommandHandler<CreateSubscriptionCommand, CreateSubscriptionCommandResult>
{
    private static readonly TimeZoneInfo LondonTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/London");

    public async Task<CreateSubscriptionCommandResult> HandleAsync(
        CreateSubscriptionCommand command,
        CancellationToken cancellationToken = default)
    {
        if (command.DeliveryDays.Count == 0)
        {
            return new CreateSubscriptionCommandResult(
                CreateSubscriptionOutcome.InvalidRequest,
                null,
                null,
                "At least one delivery day must be selected.");
        }

        var customerId = await customerRepository.FindCustomerIdByPublicIdAsync(command.CustomerId, cancellationToken);
        if (customerId is null)
        {
            return new CreateSubscriptionCommandResult(CreateSubscriptionOutcome.CustomerNotFound, null, null);
        }

        var rota = await customerRepository.FindCustomerRotaAsync(customerId.Value, cancellationToken);
        if (rota is null)
        {
            return new CreateSubscriptionCommandResult(CreateSubscriptionOutcome.CustomerNotFound, null, null);
        }

        var allProductIds = command.DefaultBasket.Select(b => b.ProductId)
            .Concat((command.DayOverrides?.Values ?? Enumerable.Empty<IReadOnlyList<CreateSubscriptionBasketLine>>())
                .SelectMany(basket => basket.Select(b => b.ProductId)))
            .Distinct()
            .ToList();

        var validatedItems = await supplierRepository.ValidateSupplierItemsAsync(
            rota.SupplierId,
            allProductIds,
            cancellationToken);
        var validatedMap = validatedItems.ToDictionary(v => v.PublicId, v => v.ItemId);

        if (validatedMap.Count != allProductIds.Count)
        {
            return new CreateSubscriptionCommandResult(
                CreateSubscriptionOutcome.InvalidRequest,
                null,
                null,
                "One or more product ids are invalid for this supplier.");
        }

        var scheduleInputs = command.DeliveryDays
            .Select(day =>
            {
                var basket = command.DayOverrides is not null && command.DayOverrides.TryGetValue(day, out var overrideBasket)
                    ? overrideBasket
                    : command.DefaultBasket;

                var items = basket
                    .Select(b => new DayBasketItem(validatedMap[b.ProductId], b.Quantity))
                    .ToList();

                return new CreateSubscriptionScheduleInput(day.ToString(), items);
            })
            .ToList();

        var created = await subscriptionRepository.CreateSubscriptionAsync(
            new CreateSubscriptionParams(customerId.Value, rota.RotaId, scheduleInputs),
            cancellationToken);

        var firstDeliveryDate = ComputeFirstDeliveryDate(command.DeliveryDays);

        return new CreateSubscriptionCommandResult(
            CreateSubscriptionOutcome.Created,
            created.Select(c => c.PublicId).ToList(),
            firstDeliveryDate);
    }

    private static DateOnly ComputeFirstDeliveryDate(IReadOnlyList<DeliveryDayOfWeek> deliveryDays)
    {
        var nowLondon = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, LondonTimeZone);
        var today = DateOnly.FromDateTime(nowLondon.DateTime);

        return deliveryDays
            .Select(day => NextOccurrence(today, Enum.Parse<DayOfWeek>(day.ToString())))
            .Min();
    }

    private static DateOnly NextOccurrence(DateOnly from, DayOfWeek dayOfWeek)
    {
        var daysUntil = ((int)dayOfWeek - (int)from.DayOfWeek + 7) % 7;
        return from.AddDays(daysUntil);
    }
}
