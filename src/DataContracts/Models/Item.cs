namespace MilkRound.DataContracts.Models;

/// <summary>
/// Represents a product item.
/// </summary>
public record Item(
    Guid Id,
    string Name,
    Price Price,
    string IconName
);
