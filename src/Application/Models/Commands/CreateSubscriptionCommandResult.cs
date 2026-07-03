namespace MilkRound.Application.Models.Commands;

public enum CreateSubscriptionOutcome
{
    Created,
    CustomerNotFound,
    InvalidRequest
}

public record CreateSubscriptionCommandResult(
    CreateSubscriptionOutcome Outcome,
    IReadOnlyList<Guid>? ScheduleIds,
    DateOnly? FirstDeliveryDate,
    string? ErrorMessage = null);
