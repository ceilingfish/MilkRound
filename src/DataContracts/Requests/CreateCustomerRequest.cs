using MilkRound.DataContracts.Models;

namespace MilkRound.DataContracts.Requests;

/// <summary>
/// Request to create a new customer during onboarding.
/// </summary>
public record CreateCustomerRequest(
    string SupplierCode,
    string Name,
    CustomerAddress Address
);
