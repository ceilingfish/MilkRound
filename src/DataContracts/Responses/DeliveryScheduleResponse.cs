using MilkRound.DataContracts.Models;

namespace MilkRound.DataContracts.Responses;

/// <summary>
/// Response containing delivery slots available from a supplier.
/// </summary>
public record DeliveryScheduleResponse(
    IReadOnlyList<DeliverySlot> Slots
);
