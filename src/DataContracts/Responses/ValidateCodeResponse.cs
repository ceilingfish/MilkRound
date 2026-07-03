namespace MilkRound.DataContracts.Responses;

/// <summary>
/// Response confirming a supplier signup code resolved to a real supplier.
/// </summary>
public record ValidateCodeResponse(
    Guid SupplierId,
    string BusinessName
);
