namespace MilkRound.DataContracts.Responses;

/// <summary>
/// Response describing whether a postcode is within a supplier's service area.
/// </summary>
public record ServiceAreaResponse(
    bool InRange,
    string? Eta
);
