namespace MilkRound.DataContracts.Models;

/// <summary>
/// Represents a monetary value with currency information.
/// </summary>
public record Price(
    decimal Amount,
    int Precision,
    string Symbol
);
