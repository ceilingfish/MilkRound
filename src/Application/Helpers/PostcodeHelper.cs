namespace MilkRound.Application.Helpers;

/// <summary>
/// Normalizes UK postcodes down to their outward code (e.g. "BS8 1AB" -> "BS8"), which is the
/// granularity at which supplier service areas are configured.
/// </summary>
public static class PostcodeHelper
{
    public static string ToOutwardCode(string postcode)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(postcode);

        var trimmed = postcode.Trim().ToUpperInvariant();
        var lastSpaceIndex = trimmed.LastIndexOf(' ');

        if (lastSpaceIndex >= 0)
        {
            return trimmed[..lastSpaceIndex];
        }

        // No space: inward codes are always digit+letter+letter (3 characters), so strip those.
        return trimmed.Length > 3 ? trimmed[..^3] : trimmed;
    }
}
