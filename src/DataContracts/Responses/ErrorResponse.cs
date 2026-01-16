namespace MilkRound.DataContracts.Responses;

/// <summary>
/// Standard error response.
/// </summary>
public record ErrorResponse(
    string Message,
    string? Code = null
);
