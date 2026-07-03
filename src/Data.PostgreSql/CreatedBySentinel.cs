namespace MilkRound.Data.PostgreSql;

/// <summary>
/// The CreatedBy value stamped on rows written by the onboarding API.
/// </summary>
public static class CreatedBySentinel
{
    public const string Value = "onboarding-api";
}
