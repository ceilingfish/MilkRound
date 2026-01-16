namespace MilkRound.DataContracts.Models;

/// <summary>
/// Represents a product item available from a supplier with quantity constraints.
/// </summary>
public record SupplierItem(
    Guid Id,
    string Name,
    Price Price,
    string IconName,
    int MaximumQuantity
) : Item(Id, Name, Price, IconName);
