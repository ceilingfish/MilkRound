namespace MilkRound.DataContracts.Responses;

/// <summary>
/// Response returned after a customer has been created.
/// </summary>
public record CreateCustomerResponse(
    Guid CustomerId
);
