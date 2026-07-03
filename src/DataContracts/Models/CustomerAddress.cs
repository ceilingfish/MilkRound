namespace MilkRound.DataContracts.Models;

/// <summary>
/// A customer's delivery address, as captured during onboarding.
/// </summary>
public record CustomerAddress(
    string? Flat,
    string Line1,
    string? Line2,
    string Postcode,
    string? Notes,
    decimal? Latitude,
    decimal? Longitude
);
