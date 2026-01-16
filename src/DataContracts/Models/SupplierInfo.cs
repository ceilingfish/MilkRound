namespace MilkRound.DataContracts.Models;

/// <summary>
/// Basic contact information for a supplier.
/// </summary>
public record SupplierInfo(
    Guid Id,
    string BusinessName,
    string? PhoneNumber = null,
    string? EmailAddress = null
);
