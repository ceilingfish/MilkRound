namespace MilkRound.DataContracts.Models;

/// <summary>
/// The current status of a delivery.
/// </summary>
public enum DeliveryStatus
{
    Pending,
    Packed,
    Shipped,
    Cancelled,
    Delivered
}
