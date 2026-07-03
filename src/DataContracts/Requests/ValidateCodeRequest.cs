namespace MilkRound.DataContracts.Requests;

/// <summary>
/// Request body for validating a supplier signup code.
/// </summary>
public record ValidateCodeRequest(
    string Code
);
