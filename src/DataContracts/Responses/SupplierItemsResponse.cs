using MilkRound.DataContracts.Models;

namespace MilkRound.DataContracts.Responses;

/// <summary>
/// Response containing items available from a supplier.
/// </summary>
public record SupplierItemsResponse(
    IReadOnlyList<SupplierItem> Items
);
