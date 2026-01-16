namespace MilkRound.DataContracts.Responses;

/// <summary>
/// Response containing the Auth0 redirect URL for signup.
/// </summary>
public record SignupResponse(
    Uri RedirectUrl
);
