namespace MilkRound.DataContracts.Models;

/// <summary>
/// A single line in a recurring delivery basket: a product and the quantity to deliver.
/// </summary>
public record BasketItem(
    Guid ProductId,
    int Quantity
);
