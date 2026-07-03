namespace MilkRound.Application.Models.Queries;

/// <summary>
/// Result of a service area check. <see cref="SupplierFound"/> is false when the supplier id does
/// not resolve to a real supplier, which the caller should treat as a 404.
/// </summary>
public record CheckServiceAreaResult(bool SupplierFound, bool InRange, string? Eta);
