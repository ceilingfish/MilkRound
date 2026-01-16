namespace MilkRound.DataContracts.Models;

/// <summary>
/// An item within a delivery with quantity.
/// </summary>
public record DeliveryItem(
    Item Item,
    int Quantity
);
