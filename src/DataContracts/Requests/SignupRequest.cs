namespace MilkRound.DataContracts.Requests;

/// <summary>
/// Request to initiate customer signup with a supplier code.
/// </summary>
public record SignupRequest(
    string SupplierCode
);
