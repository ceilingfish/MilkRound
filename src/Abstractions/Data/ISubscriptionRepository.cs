namespace MilkRound.Abstractions.Data;

/// <summary>
/// Write access for creating delivery schedule subscriptions.
/// </summary>
public interface ISubscriptionRepository
{
    Task<IReadOnlyList<CreatedScheduleResult>> CreateSubscriptionAsync(
        CreateSubscriptionParams parameters,
        CancellationToken cancellationToken = default);
}
