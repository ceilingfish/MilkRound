namespace MilkRound.Abstractions.Data;

/// <summary>
/// Result of resolving a supplier, either by signup key or public id.
/// </summary>
public record SupplierLookupResult(long SupplierId, Guid PublicId, string BusinessName);

/// <summary>
/// Result of matching a postcode's outward code against a supplier's rotas.
/// </summary>
public record RotaMatchResult(long RotaId, string? EtaDescription);

/// <summary>
/// A supplier item that was confirmed to belong to the supplier being validated against.
/// </summary>
public record ValidatedSupplierItem(long ItemId, Guid PublicId);

/// <summary>
/// Parameters required to atomically create a customer and associate it with a resolved rota.
/// </summary>
public record CreateCustomerParams(
    long SupplierId,
    long RotaId,
    string Name,
    string? Flat,
    string StreetAddress,
    string? AdditionalAddress,
    string PostalCode,
    string? Notes,
    decimal? Latitude,
    decimal? Longitude);

/// <summary>
/// Outcome of attempting to create a customer.
/// </summary>
public enum CreateCustomerOutcome
{
    Created,
    DuplicateAddress
}

/// <summary>
/// Result of a customer creation attempt.
/// </summary>
public record CreateCustomerResult(CreateCustomerOutcome Outcome, long? CustomerId, Guid? PublicId);

/// <summary>
/// The single supplier rota a customer is associated with.
/// </summary>
public record CustomerRotaResult(long RotaId, long SupplierId);

/// <summary>
/// A single basket line (supplier item + quantity) for a delivery schedule.
/// </summary>
public record DayBasketItem(long SupplierItemId, int Quantity);

/// <summary>
/// One delivery schedule (day of week + basket) to create as part of a subscription.
/// </summary>
public record CreateSubscriptionScheduleInput(string DayOfWeek, IReadOnlyList<DayBasketItem> Items);

/// <summary>
/// Parameters required to create a subscription spanning one or more weekly delivery schedules.
/// </summary>
public record CreateSubscriptionParams(
    long CustomerId,
    long SupplierRotaId,
    IReadOnlyList<CreateSubscriptionScheduleInput> Schedules);

/// <summary>
/// A newly created delivery schedule.
/// </summary>
public record CreatedScheduleResult(Guid PublicId, string DayOfWeek);
